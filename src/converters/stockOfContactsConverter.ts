import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from "firebase/firestore";

import { StockOfContacts } from "../types/StockOfContactsDocument";

export const stockOfContactsConverter: FirestoreDataConverter<StockOfContacts> =
  {
    toFirestore(stock_of_contacts: StockOfContacts): DocumentData {
      // idは除外する
      return {
        exchangeDay: stock_of_contacts.exchangeDay,
        left_eye: stock_of_contacts.left_eye,
        right_eye: stock_of_contacts.right_eye,
        updated_at: stock_of_contacts.updated_at,
      };
    },

    fromFirestore(
      snapshot: QueryDocumentSnapshot,
      options: SnapshotOptions
    ): StockOfContacts {
      const data = snapshot.data(options);
      return {
        id: data.id,
        exchangeDay: data.exchangeDay,
        left_eye: data.left_eye,
        right_eye: data.right_eye,
        updated_at: data.updated_at,
        deadLine: data.deadLine,
      };
    },
  };
