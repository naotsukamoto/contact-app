// @ts-nocheck

const functions = require("firebase-functions");
const nodemailer = require("nodemailer");

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

// 管理者用のメールテンプレート
const mailOptions = {
  from: "no-replay@conconcontacts.com",
  to: auth.user,
  subject: "交換日について | ConCon",
  text: "コンタクトレンズの交換日が近づいてきました。交換日をご確認ください。",
};

exports.sendMail = functions.https.onCall((data, context) => {
  transporter.sendMail(mailOptions, (err, res) => {
    console.log(err || res);
  });
});
