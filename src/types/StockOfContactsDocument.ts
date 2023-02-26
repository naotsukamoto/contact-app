import { Timestamp } from "firebase/firestore";

export type StockOfContacts = {
  id: string;
  exchangeDay: Timestamp;
  exchangeDayRight: Timestamp;
  exchangeDayLeft: Timestamp;
  left_eye: number;
  right_eye: number;
  updated_at: Timestamp;
  deadLine: Timestamp;
};
