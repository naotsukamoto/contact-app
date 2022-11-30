/* eslint-disable react-hooks/exhaustive-deps */

import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import { db, auth } from "../../firebase";
import { ExchangeDay } from "../molecules/ExchangeDay";
import { Inventory } from "../molecules/Inventory";
import { Button } from "../atoms/Button";
import { stockOfContactsConverter } from "../../converters/stockOfContactsConverter";
import { StockOfContacts } from "../../types/StockOfContactsDocument";
import { userConverter } from "../../converters/userConverter";
import { UserDocument } from "../../types/UserDocument";
import { calcInventoryDeadline } from "../../utils/calcInventoryDeadline";

const SContainer = styled.div`
  text-align: center;
`;

export const Home: React.FC = () => {
  const navigate = useNavigate();
  // ユーザー情報を格納するstateを作成
  const [userInfo, setUserInfo] = useState<UserDocument>();
  // コンタクトレンズの在庫を格納するstateを作成
  const [stockOfContacts, setStockOfContacts] = useState<
    Array<StockOfContacts>
  >([]);

  // コレクションのドキュメントIDを格納するstateを作成
  const [collectionID, setCollectionId] = useState("");
  // サブコレクションのドキュメントIDを格納するstateを作成
  const [subCollectionId, setSubCollectionId] = useState("");

  // ログイン後のデータ取得
  let access: boolean = false;

  useEffect(() => {
    if (!access) {
      console.log("onAuthStateChangedがレンダリングされた");
      onAuthStateChanged(auth, (user) => {
        if (user) {
          let currentUser: UserDocument;
          const currentUserstockOfContacts: Array<StockOfContacts> = [];

          // usersコレクションを参照
          const usersCollectionRef = collection(db, "users").withConverter(
            userConverter
          );

          // queryのwhereクエリ演算子を使ってドキュメント情報を取得
          getDocs(query(usersCollectionRef, where("uid", "==", user.uid))).then(
            (snapShot) => {
              snapShot.forEach(async (doc) => {
                // ここで対象ユーザーのドキュメントのIDを取得
                setCollectionId(doc.id);
                // サブコレクションを取得
                const subCollectionSnapShot = await getDocs(
                  collection(
                    db,
                    "users",
                    doc.id,
                    "stock_of_contacts"
                  ).withConverter(stockOfContactsConverter)
                );

                subCollectionSnapShot.forEach((s) => {
                  currentUserstockOfContacts.push({ ...s.data(), id: s.id });
                  // ここで対象ユーザーのstock_of_contactsのサブコレクションのIDを取得
                  setSubCollectionId(s.id);
                });

                // state更新
                setStockOfContacts(currentUserstockOfContacts);

                currentUser = doc.data();
                setUserInfo(currentUser);
              });
            }
          );
        } else {
          navigate("/");
        }
      });
    }
    // accessをtrueにする処理は、コールバック関数で書くことによって関数を処理してから次の処理を行うようになる
    return () => {
      access = true;
    };
  }, []);

  const onClickCount = useCallback(
    async (eyePosition: "L" | "R", sign: "+" | "-") => {
      console.log("onClickCountがレンダリングされた");
      // firestoreへの参照
      const contactsDocRef = doc(
        db,
        "users",
        collectionID,
        "stock_of_contacts",
        subCollectionId
      );

      // stateの更新を待たずに計算する
      const stockofContactsData = (
        await getDoc(contactsDocRef.withConverter(stockOfContactsConverter))
      ).data();
      const nextExchangeDay: Date = new Date();
      nextExchangeDay.setDate(nextExchangeDay.getDate() + 14);

      if (eyePosition === "R") {
        if (stockofContactsData) {
          sign === "+"
            ? await updateDoc(contactsDocRef, {
                right_eye: stockofContactsData?.right_eye + 1,
                deadLine: calcInventoryDeadline(
                  stockofContactsData.left_eye,
                  stockofContactsData.right_eye + 1,
                  stockofContactsData.exchangeDay
                ),
              })
            : await updateDoc(contactsDocRef, {
                right_eye: stockofContactsData?.right_eye - 1,
                exchangeDay: nextExchangeDay,
                deadLine: calcInventoryDeadline(
                  stockofContactsData.left_eye,
                  stockofContactsData.right_eye - 1,
                  stockofContactsData.exchangeDay
                ),
              });
        }

        // prevStateを使ってスプレッド構文でstateを更新
        setStockOfContacts((prevState: Array<StockOfContacts>) =>
          prevState.map((obj: StockOfContacts) =>
            obj.id === subCollectionId
              ? {
                  id: obj.id,
                  left_eye: obj.left_eye,
                  right_eye:
                    sign === "+" ? obj.right_eye + 1 : obj.right_eye - 1,
                  updated_at: obj.updated_at,
                  exchangeDay:
                    obj.right_eye - 1 < obj.left_eye && sign === "-"
                      ? Timestamp.fromDate(nextExchangeDay)
                      : obj.exchangeDay,
                  deadLine:
                    sign === "+"
                      ? calcInventoryDeadline(
                          obj.left_eye,
                          obj.right_eye + 1,
                          obj.exchangeDay
                        )
                      : calcInventoryDeadline(
                          obj.left_eye,
                          obj.right_eye - 1,
                          obj.exchangeDay
                        ),
                }
              : obj
          )
        );
      } else {
        if (stockofContactsData) {
          sign === "+"
            ? await updateDoc(contactsDocRef, {
                left_eye: stockofContactsData?.left_eye + 1,
                deadLine: calcInventoryDeadline(
                  stockofContactsData.left_eye + 1,
                  stockofContactsData.right_eye,
                  stockofContactsData.exchangeDay
                ),
              })
            : await updateDoc(contactsDocRef, {
                left_eye: stockofContactsData?.left_eye - 1,
                exchangeDay: Timestamp.fromDate(nextExchangeDay),
                deadLine: calcInventoryDeadline(
                  stockofContactsData.left_eye - 1,
                  stockofContactsData.right_eye,
                  stockofContactsData.exchangeDay
                ),
              });
        }
        // 個数のstateをスプレッド構文を使って更新
        setStockOfContacts((prevState: Array<StockOfContacts>) =>
          prevState.map((obj: StockOfContacts) =>
            obj.id === subCollectionId
              ? {
                  id: obj.id,
                  left_eye: sign === "+" ? obj.left_eye + 1 : obj.left_eye - 1,
                  right_eye: obj.right_eye,
                  updated_at: obj.updated_at,
                  exchangeDay:
                    obj.left_eye - 1 < obj.right_eye && sign === "-"
                      ? Timestamp.fromDate(nextExchangeDay)
                      : obj.exchangeDay,
                  deadLine:
                    sign === "+"
                      ? calcInventoryDeadline(
                          obj.left_eye + 1,
                          obj.right_eye,
                          obj.exchangeDay
                        )
                      : calcInventoryDeadline(
                          obj.left_eye - 1,
                          obj.right_eye,
                          obj.exchangeDay
                        ),
                }
              : obj
          )
        );
      }
    },
    [collectionID, subCollectionId]
  );

  return (
    <SContainer>
      <p>{userInfo?.user_name} さん</p>
      <ExchangeDay stockOfContacts={stockOfContacts} />
      <br />
      <Inventory
        stockOfContacts={stockOfContacts}
        onClickCount={onClickCount}
      />
      <br />
      <Button name="ログアウト" onClick={() => signOut(auth)} />
    </SContainer>
  );
};
