// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, TwitterAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

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

// 認証
// Authを取得
const auth = getAuth(app);
// Providerをインスタンス化
// https://firebase.google.com/docs/reference/js/v8/firebase.auth.TwitterAuthProvider
const provider = new TwitterAuthProvider();

// DB
// firestoreとの接続でDBを取得
const db = getFirestore(app);

export { auth, provider, db };
