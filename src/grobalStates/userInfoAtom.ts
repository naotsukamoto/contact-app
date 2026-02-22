import { Timestamp } from "firebase/firestore";
import { atom } from "jotai";

import { UserDocument } from "../types/UserDocument";

export const userInfoAtom = atom<UserDocument>({
  created_at: Timestamp.now(),
  email: "",
  uid: "",
  user_name: "",
});
