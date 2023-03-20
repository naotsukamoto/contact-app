// @ts-nocheck

import { differenceInCalendarDays } from "date-fns";

const functions = require("firebase-functions");
const nodemailer = require("nodemailer");

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
          if (
            differenceInCalendarDays(
              s.data().exchangeDayLeft?.toDate(),
              today
            ) <= 1 ||
            differenceInCalendarDays(
              s.data().exchangeDayRight?.toDate(),
              today
            ) <= 1
          ) {
            // メール情報
            const mailOptions = {
              from: "no-replay@conconcontacts.com",
              to: doc.data().email,
              //   to: "m0naaa0u@gmail.com",
              subject: "交換日について | ConCon",
              text: "コンタクトレンズの交換日が近づいているか交換日が過ぎています。ConConをご確認ください。",
            };
            // メール送信
            transporter.sendMail(mailOptions, (err, res) => {
              console.log(err || res);
            });
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
