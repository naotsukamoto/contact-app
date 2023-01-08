import { Timestamp } from "firebase/firestore";

export type UserDocument = {
  created_at: Timestamp | Date;
  email: string | null;
  uid: string;
  user_name: string | null;
};
