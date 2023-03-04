/* eslint-disable react-hooks/exhaustive-deps */

import React, { memo, useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
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
import { toastFunc } from "../../utils/toastFunc";
import { UserName } from "../atoms/UserName";

const SContainer = styled.div`
  text-align: center;
`;

export const Home: React.FC = memo(() => {
  console.log("Home.tsxがレンダリングされた");
  const navigate = useNavigate();

  // ユーザー情報を格納するstateを作成
  const [userInfo, setUserInfo] = useState<UserDocument>();
  // コンタクトレンズの在庫を格納するstateを作成
  const [stockOfContacts, setStockOfContacts] = useState<
    Array<StockOfContacts>
  >([]);

  // コレクションのドキュメントIDを格納するstateを作成
  const [collectionId, setCollectionId] = useState<string>("");
  // サブコレクションのドキュメントIDを格納するstateを作成
  const [subCollectionId, setSubCollectionId] = useState<string>("");

  // コンタクトレンズの管理方法を格納するstateを作成
  const [contactManageType, setContactManageType] = useState<number>(0);

  // ログイン後のデータ取得
  let access: boolean = false;

  useEffect(() => {
    if (!access) {
      console.log("useEffectがレンダリングされた");
      onAuthStateChanged(auth, async (user) => {
        console.log("onAuthStateChangedがレンダリングされた");
        if (user) {
          let currentUser: UserDocument;
          const currentUserstockOfContacts: Array<StockOfContacts> = [];

          // usersコレクションを参照
          const usersCollectionRef = collection(db, "users").withConverter(
            userConverter
          );

          // settingコレクションを参照
          const settingsCollectionRef = collection(db, "settings");

          // firestoreにuserが存在しなければ、新規会員として扱う
          await getDocs(
            query(usersCollectionRef, where("uid", "==", user.uid))
          ).then(async (snapShot) => {
            if (snapShot.size === 0) {
              console.log("userの追加を開始します");
              // firestoreにuserデータを登録する
              await addDoc(usersCollectionRef, {
                created_at: Timestamp.now(),
                email: user.email,
                uid: user.uid,
                user_name: user.displayName,
              }).then(() => {
                getDocs(
                  query(usersCollectionRef, where("uid", "==", user.uid))
                ).then((snapShot) => {
                  snapShot.forEach((doc) => {
                    console.log("stockの追加を開始します");
                    addDoc(
                      collection(db, "users", doc.id, "stock_of_contacts"),
                      {
                        id: "",
                        exchangeDay: Timestamp.now(),
                        left_eye: 0,
                        right_eye: 0,
                        updated_at: Timestamp.now(),
                        deadLine: Timestamp.now(),
                      }
                    );
                  });
                });
              });
            }
          });

          // queryのwhereクエリ演算子を使ってドキュメント情報を取得
          getDocs(query(usersCollectionRef, where("uid", "==", user.uid))).then(
            (snapShot) => {
              console.log("データの表示を開始します");
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

          // コンタクトレンズの管理方法を取得
          getDocs(
            query(settingsCollectionRef, where("uid", "==", user.uid))
          ).then((snapShot) => {
            snapShot.forEach((doc) => {
              // stateを更新する
              // console.log("settingのデータ", doc.data().contactManageType);
              setContactManageType(doc.data().contactManageType);
            });
          });
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
        collectionId,
        "stock_of_contacts",
        subCollectionId
      );

      // stateの更新を待たずに計算する
      const stockofContactsData: StockOfContacts | undefined = (
        await getDoc(contactsDocRef.withConverter(stockOfContactsConverter))
      ).data();

      // 交換日を定義
      const nextExchangeDay: Date = new Date();
      nextExchangeDay.setDate(nextExchangeDay.getDate() + 14);

      if (eyePosition === "R") {
        if (stockofContactsData) {
          await updateDoc(
            contactsDocRef,
            sign === "+"
              ? {
                  right_eye: stockofContactsData.right_eye + 1,
                  deadLine: calcInventoryDeadline(
                    stockofContactsData.left_eye,
                    stockofContactsData.right_eye + 1,
                    stockofContactsData.exchangeDay
                  ),
                }
              : {
                  right_eye: stockofContactsData.right_eye - 1,
                  exchangeDay:
                    stockofContactsData.right_eye - 1 <
                    stockofContactsData.left_eye
                      ? Timestamp.fromDate(nextExchangeDay)
                      : stockofContactsData.exchangeDay,
                  exchangeDayRight: Timestamp.fromDate(nextExchangeDay),
                  deadLine: calcInventoryDeadline(
                    stockofContactsData.left_eye,
                    stockofContactsData.right_eye - 1,
                    stockofContactsData.exchangeDay
                  ),
                }
          );
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
                  exchangeDayRight:
                    sign === "-"
                      ? Timestamp.fromDate(nextExchangeDay)
                      : obj.exchangeDayRight,
                  exchangeDayLeft: obj.exchangeDayLeft,
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
          await updateDoc(
            contactsDocRef,
            sign === "+"
              ? {
                  left_eye: stockofContactsData?.left_eye + 1,
                  deadLine: calcInventoryDeadline(
                    stockofContactsData.left_eye + 1,
                    stockofContactsData.right_eye,
                    stockofContactsData.exchangeDay
                  ),
                }
              : {
                  left_eye: stockofContactsData?.left_eye - 1,
                  exchangeDay:
                    stockofContactsData.left_eye - 1 <
                    stockofContactsData.right_eye
                      ? Timestamp.fromDate(nextExchangeDay)
                      : stockofContactsData.exchangeDay,
                  exchangeDayLeft: Timestamp.fromDate(nextExchangeDay),
                  deadLine: calcInventoryDeadline(
                    stockofContactsData.left_eye - 1,
                    stockofContactsData.right_eye,
                    stockofContactsData.exchangeDay
                  ),
                }
          );
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
                  exchangeDayRight: obj.exchangeDayRight,
                  exchangeDayLeft:
                    sign === "-"
                      ? Timestamp.fromDate(nextExchangeDay)
                      : obj.exchangeDayLeft,
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
    [collectionId, subCollectionId]
  );

  const onClickToSettings = useCallback(() => {
    navigate("/settings");
  }, []);

  const onClickSignOut = useCallback(() => {
    signOut(auth);
    toastFunc("success", "ログアウトしました");
  }, []);

  return (
    <SContainer>
      <UserName children={userInfo?.user_name} />
      <p>コンタクト管理方法：{contactManageType}</p>
      <ExchangeDay
        stockOfContacts={stockOfContacts}
        collectionId={collectionId}
        subCollectionId={subCollectionId}
        setStockOfContacts={setStockOfContacts}
        contactManageType={contactManageType}
      />
      <br />
      <Inventory
        stockOfContacts={stockOfContacts}
        onClickCount={onClickCount}
      />
      <br />
      <Button name="設定" onClick={onClickToSettings} />
      <Button name="ログアウト" onClick={onClickSignOut} />
    </SContainer>
  );
});
