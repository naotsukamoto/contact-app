import { Timestamp } from "firebase/firestore";
import { atom } from "recoil";

import { UserDocument } from "../types/UserDocument";

export const userInfoAtom = atom<UserDocument>({
  key: "userInfo",
  default: {
    created_at: Timestamp.now(),
    email: "",
    uid: "",
    user_name: "",
  },
});
