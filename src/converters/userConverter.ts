import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from "firebase/firestore";

import { UserDocument } from "../types/UserDocument";

export const userConverter: FirestoreDataConverter<UserDocument> = {
  toFirestore(user: UserDocument): DocumentData {
    return user;
  },

  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): UserDocument {
    const data = snapshot.data(options);
    return {
      created_at: data.created_at,
      email: data.email,
      uid: data.uid,
      user_name: data.user_name,
      lineUserId: data.lineUserId,
    };
  },
};
