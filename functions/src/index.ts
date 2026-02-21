// @ts-nocheck

import { differenceInCalendarDays } from "date-fns";

const functions = require("firebase-functions");
const nodemailer = require("nodemailer");
const line = require("@line/bot-sdk");

// cloudfunctionsでfirestoreを利用する
const admin = require("firebase-admin");
const app = admin.initializeApp();

// 認証情報の設定
const auth = {
  type: process.env.REACT_APP_OAUTH_AUTH_TYPE,
  user: process.env.REACT_APP_OAUTH_AUTH_USER,
  clientId: process.env.REACT_APP_OAUTH_AUTH_CLIENT_ID,
  clientSecret: process.env.REACT_APP_OAUTH_AUTH_CLIENT_SECRET,
  refreshToken: process.env.REACT_APP_OAUTH_AUTH_REFRESH_TOKEN,
};

const transport = {
  service: "gmail",
  auth,
};

// 送信に使用するメールサーバーの設定
const transporter = nodemailer.createTransport(transport);

exports.sendMail = functions
  .region("asia-northeast1")
  .pubsub.schedule("0 20 * * *")
  .timeZone("Asia/Tokyo")
  .onRun(async () => {
    // メール送信成功フラグと変数
    let mailCount: number = 0;
    let times: number = 0;
    const today: Date = new Date();

    // まず、Firestore からデータを持ってくる
    const snapshot = await app.firestore().collection("users").get();
    // それぞれに対してメールを送る
    await snapshot.forEach(async (doc) => {
      const stockSnapshot = await app
        .firestore()
        .collection("users")
        .doc(doc.id)
        .collection("stock_of_contacts")
        .get();

      stockSnapshot.forEach((s) => {
        // もし交換日が明日より前になったら
        if (
          s.data().exchangeDayLeft !== undefined &&
          s.data().exchangeDayRight !== undefined
        ) {
          const leftDiff = differenceInCalendarDays(
            s.data().exchangeDayLeft?.toDate(),
            today
          );
          const rightDiff = differenceInCalendarDays(
            s.data().exchangeDayRight?.toDate(),
            today
          );

          if (leftDiff <= 1 || rightDiff <= 1) {
            // 日付フォーマット（例: 2024年3月15日）
            const formatDate = (date: Date) => {
              const y = date.getFullYear();
              const m = date.getMonth() + 1;
              const d = date.getDate();
              return `${y}年${m}月${d}日`;
            };
            // 残り日数ラベル
            const dayLabel = (diff: number) => {
              if (diff < 0) return `（${Math.abs(diff)}日超過）`;
              if (diff === 0) return "（本日）";
              return `（${diff}日後）`;
            };

            // メール情報
            const mailOptions = {
              from: "no-replay@conconcontacts.com",
              to: doc.data().email,
              //   to: "m0naaa0u@gmail.com",
              subject: "交換日について | ConCon",
              text: [
                "コンタクトの交換日のお知らせ",
                `・左目: ${formatDate(s.data().exchangeDayLeft.toDate())}${dayLabel(leftDiff)}`,
                `・右目: ${formatDate(s.data().exchangeDayRight.toDate())}${dayLabel(rightDiff)}`,
                "\nConConをご確認ください。",
              ].join("\n"),
            };
            // メール送信
            transporter.sendMail(mailOptions, (err, res) => {
              console.log(err || res);
            });

            // LINE通知送信
            const lineUserId = doc.data().lineUserId;
            if (lineUserId) {
              const lineMessageLines = [
                "コンタクトの交換日のお知らせ",
                `・左目: ${formatDate(s.data().exchangeDayLeft.toDate())}${dayLabel(leftDiff)}`,
                `・右目: ${formatDate(s.data().exchangeDayRight.toDate())}${dayLabel(rightDiff)}`,
                "\nConConでご確認ください。",
              ];

              const lineClient = new line.Client(lineConfig);
              lineClient.pushMessage(lineUserId, {
                type: "text",
                text: lineMessageLines.join("\n"),
              }).catch((err) => console.error("LINE push error:", err));
            }

            // 送信件数をカウント
            mailCount += 1;
          }
        }

        // ループ数をカウント
        times += 1;
        if (times === 6) {
          console.log("メール送信します");
          // 毎日運営にもメールを送って状況を確認する
          const mailOptions = {
            from: "no-replay@conconcontacts.com",
            to: "m0naaa0u@gmail.com",
            subject: "運営向け：定期メール送信について | ConCon",
            text: `${today}分の定期メール送信${mailCount}件です。`,
          };
          transporter.sendMail(mailOptions, (err, res) => {
            console.log(err || res);
          });
        }
      });
    });
    return null;
  });

// LINE連携用Webhookハンドラー
const lineConfig = {
  channelSecret: process.env.LINE_CHANNEL_SECRET,
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
};

exports.lineWebhook = functions
  .region("asia-northeast1")
  .https.onRequest(async (req, res) => {
    // 署名検証
    const signature = req.headers["x-line-signature"];
    if (
      !signature ||
      !line.validateSignature(req.rawBody, lineConfig.channelSecret, signature)
    ) {
      res.status(403).send("Invalid signature");
      return;
    }

    const events = req.body.events;
    const client = new line.Client(lineConfig);

    try {
      await Promise.all(
        events.map(async (event) => {
          // 友達追加時：挨拶メッセージを送信
          if (event.type === "follow") {
            await client.pushMessage(event.source.userId, {
              type: "text",
              text: "Concon通知botを友達追加していただきありがとうございます！\nコンタクトの交換日が近づいたらLINEでお知らせします。",
            });
            return;
          }
        })
      );
    } catch (err) {
      console.error(err);
    }

    res.status(200).send("OK");
  });

// LIFF経由でLINEアカウントとアプリアカウントを連携するエンドポイント
exports.linkLineAccount = functions
  .region("asia-northeast1")
  .https.onRequest(async (req, res) => {
    res.set("Access-Control-Allow-Origin", "https://contacts-app-bb4dd.web.app");
    res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      res.status(204).send("");
      return;
    }

    const { token, lineUserId } = req.body;

    if (!token || !lineUserId) {
      res.status(400).json({ error: "Missing params" });
      return;
    }

    const tokenDocRef = app.firestore().collection("line_link_tokens").doc(token);
    const tokenDoc = await tokenDocRef.get();

    if (!tokenDoc.exists) {
      res.status(400).json({ error: "トークンが無効か期限切れです。アプリから再度「LINEと連携する」を押してください。" });
      return;
    }

    if (tokenDoc.data().expiry.toDate() < new Date()) {
      await tokenDocRef.delete();
      res.status(400).json({ error: "トークンの有効期限が切れています。アプリから再度「LINEと連携する」を押してください。" });
      return;
    }

    const usersSnapshot = await app
      .firestore()
      .collection("users")
      .where("uid", "==", tokenDoc.data().uid)
      .get();

    if (usersSnapshot.empty) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    await usersSnapshot.docs[0].ref.update({ lineUserId });
    await tokenDocRef.delete();

    res.status(200).json({ success: true });
  });
