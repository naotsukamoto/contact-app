import { differenceInCalendarDays } from "date-fns";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";
import * as line from "@line/bot-sdk";

admin.initializeApp();

// ─── メール設定 ───────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: process.env.REACT_APP_OAUTH_AUTH_TYPE,
    user: process.env.REACT_APP_OAUTH_AUTH_USER,
    clientId: process.env.REACT_APP_OAUTH_AUTH_CLIENT_ID,
    clientSecret: process.env.REACT_APP_OAUTH_AUTH_CLIENT_SECRET,
    refreshToken: process.env.REACT_APP_OAUTH_AUTH_REFRESH_TOKEN,
  },
} as Parameters<typeof nodemailer.createTransport>[0]);

// ─── LINE 設定 ────────────────────────────────────────────────
// Client はモジュール読み込み時ではなく関数実行時に生成する
// （環境変数が未設定の場合にクラッシュするのを防ぐため）
const getLineClient = (): line.Client => {
  const config: line.ClientConfig = {
    channelSecret: process.env.LINE_CHANNEL_SECRET ?? "",
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN ?? "",
  };
  return new line.Client(config);
};

const getLineChannelSecret = (): string =>
  process.env.LINE_CHANNEL_SECRET ?? "";

// ─── 共通ヘルパー ─────────────────────────────────────────────
const formatDate = (date: Date): string => {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return `${y}年${m}月${d}日`;
};

const dayLabel = (diff: number): string => {
  if (diff < 0) return `（${Math.abs(diff)}日超過）`;
  if (diff === 0) return "（本日）";
  return `（${diff}日後）`;
};

const buildNotificationText = (
  leftDate: Date,
  rightDate: Date,
  leftDiff: number,
  rightDiff: number
): string =>
  [
    "コンタクトの交換日のお知らせ",
    `・左目: ${formatDate(leftDate)}${dayLabel(leftDiff)}`,
    `・右目: ${formatDate(rightDate)}${dayLabel(rightDiff)}`,
    "\nConConでご確認ください。",
  ].join("\n");

// ─── 通知送信（定期実行）────────────────────────────────────
exports.sendNotifications = functions
  .region("asia-northeast1")
  .pubsub.schedule("0 20 * * *")
  .timeZone("Asia/Tokyo")
  .onRun(async () => {
    const db = admin.firestore();
    const today = new Date();

    const usersSnapshot = await db.collection("users").get();

    const results = await Promise.allSettled(
      usersSnapshot.docs.map(async (userDoc) => {
        const userData = userDoc.data();

        const stockSnapshot = await db
          .collection("users")
          .doc(userDoc.id)
          .collection("stock_of_contacts")
          .get();

        await Promise.allSettled(
          stockSnapshot.docs.map(async (stockDoc) => {
            const stock = stockDoc.data();

            if (!stock.exchangeDayLeft || !stock.exchangeDayRight) return;

            const leftDiff = differenceInCalendarDays(
              stock.exchangeDayLeft.toDate(),
              today
            );
            const rightDiff = differenceInCalendarDays(
              stock.exchangeDayRight.toDate(),
              today
            );

            if (leftDiff > 1 && rightDiff > 1) return;

            const messageText = buildNotificationText(
              stock.exchangeDayLeft.toDate(),
              stock.exchangeDayRight.toDate(),
              leftDiff,
              rightDiff
            );

            const tasks: Promise<unknown>[] = [];

            // メール通知
            if (userData.email) {
              tasks.push(
                new Promise<void>((resolve, reject) => {
                  transporter.sendMail(
                    {
                      from: "no-replay@conconcontacts.com",
                      to: userData.email,
                      subject: "交換日について | ConCon",
                      text: messageText,
                    },
                    (err: Error | null) => {
                      if (err) {
                        console.error("メール送信エラー:", err);
                        reject(err);
                      } else {
                        resolve();
                      }
                    }
                  );
                })
              );
            }

            // LINE通知
            if (userData.lineUserId) {
              tasks.push(
                getLineClient()
                  .pushMessage(userData.lineUserId, {
                    type: "text",
                    text: messageText,
                  })
                  .catch((err: unknown) => console.error("LINE push エラー:", err))
              );
            }

            await Promise.allSettled(tasks);
          })
        );
      })
    );

    const failed = results.filter((r) => r.status === "rejected");
    console.log(
      `sendNotifications 完了: ${usersSnapshot.docs.length} ユーザー処理, ${failed.length} 件失敗`
    );
    return null;
  });

// ─── LINE Webhook ─────────────────────────────────────────────
exports.lineWebhook = functions
  .region("asia-northeast1")
  .https.onRequest(async (req, res) => {
    const signature = req.headers["x-line-signature"] as string;
    if (
      !signature ||
      !line.validateSignature(
        req.rawBody,
        getLineChannelSecret(),
        signature
      )
    ) {
      res.status(403).send("Invalid signature");
      return;
    }

    const events: line.WebhookEvent[] = req.body.events;

    await Promise.allSettled(
      events.map(async (event) => {
        if (event.type === "follow") {
          // 友達追加時：ウェルカムメッセージ
          await getLineClient().replyMessage(event.replyToken, {
            type: "text",
            text: "Concon通知botを友達追加していただきありがとうございます！\nコンタクトの交換日が近づいたらLINEでお知らせします。",
          });
        } else if (event.type === "unfollow") {
          // ブロック時：lineUserId を削除して通知停止
          const lineUserId = event.source.userId;
          if (!lineUserId) return;

          const db = admin.firestore();
          const snapshot = await db
            .collection("users")
            .where("lineUserId", "==", lineUserId)
            .limit(1)
            .get();

          if (!snapshot.empty) {
            await snapshot.docs[0].ref.update({
              lineUserId: admin.firestore.FieldValue.delete(),
            });
          }
        }
      })
    );

    res.status(200).send("OK");
  });

// ─── LINE アカウント連携 ──────────────────────────────────────
exports.linkLineAccount = functions
  .region("asia-northeast1")
  .https.onRequest(async (req, res) => {
    const allowedOrigins = [
      "https://contacts-app-bb4dd.web.app",
      "https://contacts-app-bb4dd.firebaseapp.com",
    ];
    const origin = req.headers.origin ?? "";
    if (allowedOrigins.includes(origin)) {
      res.set("Access-Control-Allow-Origin", origin);
    }
    res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      res.status(204).send("");
      return;
    }
    if (req.method !== "POST") {
      res.status(405).json({ error: "Method not allowed" });
      return;
    }

    const { token, lineUserId } = req.body as {
      token?: string;
      lineUserId?: string;
    };

    if (!token || !lineUserId) {
      res.status(400).json({ error: "token と lineUserId は必須です" });
      return;
    }

    const db = admin.firestore();
    const tokenDocRef = db.collection("line_link_tokens").doc(token);

    try {
      let targetUserRef: admin.firestore.DocumentReference | null = null;

      await db.runTransaction(async (tx) => {
        const tokenDoc = await tx.get(tokenDocRef);

        if (!tokenDoc.exists) {
          throw new Error("TOKEN_NOT_FOUND");
        }

        const tokenData = tokenDoc.data()!;
        if ((tokenData.expiry as admin.firestore.Timestamp).toDate() < new Date()) {
          tx.delete(tokenDocRef);
          throw new Error("TOKEN_EXPIRED");
        }

        const usersSnapshot = await db
          .collection("users")
          .where("uid", "==", tokenData.uid)
          .limit(1)
          .get();

        if (usersSnapshot.empty) {
          throw new Error("USER_NOT_FOUND");
        }

        targetUserRef = usersSnapshot.docs[0].ref;
        tx.update(targetUserRef, { lineUserId });
        tx.delete(tokenDocRef);
      });

      // 連携完了メッセージをLINEに送信（失敗しても連携成功扱いを維持）
      await getLineClient()
        .pushMessage(lineUserId, {
          type: "text",
          text: "✅ ConConとのLINE連携が完了しました！\nコンタクトの交換日が近づいたらLINEでお知らせします。",
        })
        .catch((err: unknown) =>
          console.error("LINE連携完了メッセージ送信エラー:", err)
        );

      res.status(200).json({ success: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "UNKNOWN";
      if (message === "TOKEN_NOT_FOUND") {
        res.status(400).json({
          error:
            "トークンが無効です。アプリの設定画面から「LINEと連携する」を押し直してください。",
        });
      } else if (message === "TOKEN_EXPIRED") {
        res.status(400).json({
          error:
            "トークンの有効期限が切れています。アプリの設定画面から「LINEと連携する」を押し直してください。",
        });
      } else if (message === "USER_NOT_FOUND") {
        res.status(404).json({
          error: "ユーザーが見つかりませんでした。再度お試しください。",
        });
      } else {
        console.error("linkLineAccount エラー:", err);
        res.status(500).json({ error: "サーバーエラーが発生しました。" });
      }
    }
  });

// ─── LINE 連携解除（onCall）──────────────────────────────────
exports.unlinkLineAccount = functions
  .region("asia-northeast1")
  .https.onCall(async (_data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "ログインが必要です"
      );
    }

    const db = admin.firestore();
    const snapshot = await db
      .collection("users")
      .where("uid", "==", context.auth.uid)
      .limit(1)
      .get();

    if (snapshot.empty) {
      throw new functions.https.HttpsError(
        "not-found",
        "ユーザーが見つかりません"
      );
    }

    await snapshot.docs[0].ref.update({
      lineUserId: admin.firestore.FieldValue.delete(),
    });

    return { success: true };
  });
