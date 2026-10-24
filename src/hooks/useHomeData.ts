import { Dispatch, SetStateAction, useCallback } from "react";
import { User } from "firebase/auth";
import { addDoc, collection, getDocs, query, Timestamp, where } from "firebase/firestore";
import { useQuery, useQueryClient } from "react-query";

import { db } from "../firebase";
import { userConverter } from "../converters/userConverter";
import { stockOfContactsConverter } from "../converters/stockOfContactsConverter";
import { UserDocument } from "../types/UserDocument";
import { StockOfContacts } from "../types/StockOfContactsDocument";
import { withTimeout } from "../utils/withTimeout";

export type HomeData = {
  userInfo: UserDocument;
  collectionId: string;
  subCollectionId: string;
  stockOfContacts: StockOfContacts[];
};

export const useHomeData = (user: User | null) => {
  const uid = user?.uid ?? "";
  const queryClient = useQueryClient();
  const result = useQuery<HomeData>(["home", uid], async () => {
    if (!user) throw new Error("ログインしてください");
    const snapshot = await withTimeout(getDocs(query(
      collection(db, "users").withConverter(userConverter), where("uid", "==", uid)
    )));

    if (snapshot.empty) {
      const now = Timestamp.now();
      const userInfo: UserDocument = {
        created_at: now, email: user.email, uid, user_name: user.displayName,
      };
      const userDoc = await addDoc(collection(db, "users").withConverter(userConverter), userInfo);
      const stock = {
        exchangeDay: now, exchangeDayLeft: now, exchangeDayRight: now,
        left_eye: 0, right_eye: 0, updated_at: now, deadLine: now,
      };
      const stockDoc = await addDoc(collection(db, "users", userDoc.id, "stock_of_contacts"), stock);
      return {
        userInfo, collectionId: userDoc.id, subCollectionId: stockDoc.id,
        stockOfContacts: [{ ...stock, id: stockDoc.id }],
      };
    }

    const stocks = await Promise.all(snapshot.docs.map(async (userDoc) => {
      const stockSnapshot = await withTimeout(getDocs(
        collection(db, "users", userDoc.id, "stock_of_contacts").withConverter(stockOfContactsConverter)
      ));
      return stockSnapshot.docs.map((stock) => ({ ...stock.data(), id: stock.id }));
    }));
    const stockOfContacts = stocks.flat();
    const userDoc = snapshot.docs[snapshot.docs.length - 1];
    return {
      userInfo: userDoc.data(), collectionId: userDoc.id,
      subCollectionId: stockOfContacts[stockOfContacts.length - 1]?.id ?? "",
      stockOfContacts,
    };
  }, {
    enabled: !!user,
    staleTime: 30000,
    retry: false,
    refetchOnWindowFocus: false,
  });

  // 交換日・在庫の変更も同じキャッシュを更新し、画面往復で古い値に戻さない。
  const setStockOfContacts: Dispatch<SetStateAction<StockOfContacts[]>> = useCallback((update) => {
    queryClient.cancelQueries(["home", uid]);
    queryClient.setQueryData<HomeData | undefined>(["home", uid], (current) => {
      if (!current) return current;
      return {
        ...current,
        stockOfContacts: typeof update === "function" ? update(current.stockOfContacts) : update,
      };
    });
  }, [queryClient, uid]);

  return { ...result, setStockOfContacts };
};
