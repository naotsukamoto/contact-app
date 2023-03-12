// @ts-nocheck

import { collection, getDocs, query } from "firebase/firestore";
import { differenceInCalendarDays } from "date-fns";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const functions = require("firebase-functions");
const nodemailer = require("nodemailer");

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
// firestoreとの接続でDBを取得
const db = getFirestore(app);

// 認証情報の設定
const auth = {
  type: "OAuth2",
  user: "m0naaa0u@gmail.com",
  clientId:
    "904944278791-sokj39cqhma8arovh35nd3rvbemrpf0m.apps.googleusercontent.com",
  clientSecret: "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",
  refreshToken:
    "1//04mp4h0z_ir74CgYIARAAGAQSNwF-L9Iruvo-DBbLvuZp0ObywR8QQBagR6w7Z9SbDFeo03irlfzpd_RNurNJrZK-QcnTCpaO64Q",
};

const transport = {
  service: "gmail",
  auth,
};

// 送信に使用するメールサーバーの設定
const transporter = nodemailer.createTransport(transport);

exports.sendMail = functions
  .region("asia-northeast1")
  .pubsub.schedule("every 1 days")
  .onRun(async () => {
    await getDocs(query(collection(db, "users"))).then((snapShot) => {
      snapShot.forEach(async (doc) => {
        // コンタクトレンズの交換日を取得
        const subCollection = await getDocs(
          collection(db, "users", doc.id, "stock_of_contacts")
        );
        subCollection.forEach((s) => {
          const today = new Date();
          // もし交換日が明日より前になったら
          if (
            differenceInCalendarDays(
              s.data().exchangeDayLeft.toDate(),
              today
            ) <= 1 ||
            differenceInCalendarDays(
              s.data().exchangeDayRight.toDate(),
              today
            ) <= 1
          ) {
            // メール情報
            const mailOptions = {
              from: "no-replay@conconcontacts.com",
              to: doc.data().email,
              subject: "交換日について | ConCon",
              text: "コンタクトレンズの交換日が近づいてきました。交換日をご確認ください。",
            };

            // メール送信
            transporter.sendMail(mailOptions, (err, res) => {
              console.log(err || res);
            });
          }
        });
      });
    });
  });
