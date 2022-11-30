import { Timestamp } from "firebase/firestore";

export type UserDocument = {
  created_at: Timestamp | Date;
  email: string;
  uid: string;
  user_name: string;
};
