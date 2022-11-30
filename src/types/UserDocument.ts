import firestore from "firebase/firestore";

export type UserDocument = {
  created_at: firestore.Timestamp | Date;
  email: string;
  uid: string;
  user_name: string;
};
