/* eslint-disable react-hooks/exhaustive-deps */

import React, { memo, useCallback, useEffect } from "react";
import styled from "styled-components";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  collection,
  getDocs,
  query,
  updateDoc,
  where,
  doc,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import { SettingWithToggle } from "../molecules/SettingWithToogle";
import { auth, db } from "../../firebase";
import { contactManageTypeAtom } from "../../grobalStates/contactManageTypeAtom";
import { userInfoAtom } from "../../grobalStates/userInfoAtom";
import { userConverter } from "../../converters/userConverter";
import { Button } from "../atoms/Button";

const SContainer = styled.div`
  text-align: center;
`;

export const Settings: React.FC = memo(() => {
  // 未ログイン時のリダイレクトnavigate
  const navigate = useNavigate();

  // コンタクトレンズの管理方法を格納するstateを作成
  const setContactManageType = useSetRecoilState(contactManageTypeAtom);

  // ユーザー情報を格納するstateを作成
  const [userInfo, setUserInfo] = useRecoilState(userInfoAtom);

  // settingコレクションを参照
  const settingsCollectionRef = collection(db, "settings");

  // usersコレクションを参照
  const usersCollectionRef = collection(db, "users").withConverter(
    userConverter
  );

  // settingsアクセス後のデータ取得
  let access: boolean = false;

  // ページアクセス時はfirebaseから情報を取得する
  useEffect(() => {
    if (!access) {
      console.log("Settingsがレンダリングされた");
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          // コンタクトレンズの管理方法を取得
          await getDocs(
            query(settingsCollectionRef, where("uid", "==", user.uid))
          ).then((snapShot) => {
            snapShot.forEach((doc) => {
              // stateを更新する
              setContactManageType(doc.data().contactManageType);
            });
          });

          // userInfoを更新
          await getDocs(
            query(usersCollectionRef, where("uid", "==", user.uid))
          ).then((snapShot) => {
            snapShot.forEach((doc) => {
              setUserInfo(doc.data());
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

  // toggleのONのOFFによって実行される関数
  const handleChange = useCallback(() => {
    // stateを更新
    setContactManageType((prevType) => (prevType === 0 ? 1 : 0));

    // firestoreを更新する
    getDocs(
      query(settingsCollectionRef, where("uid", "==", userInfo.uid))
    ).then((snapShot) => {
      snapShot.forEach((d) => {
        updateDoc(doc(settingsCollectionRef, d.id), {
          contactManageType: d.data().contactManageType === 0 ? 1 : 0,
        });
      });
    });
  }, []);

  const onClickLineConnect = useCallback(async () => {
    if (!userInfo?.uid) return;

    // ランダムトークンを生成
    const token = crypto.randomUUID();
    // 10分間有効な有効期限を設定
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    // Firestoreにトークンを保存
    await setDoc(doc(db, "line_link_tokens", token), {
      uid: userInfo.uid,
      expiry: Timestamp.fromDate(expiry),
    });

    // LINEのDeepLinkを開く（トークンをメッセージとして自動入力）
    const lineAccountId = process.env.REACT_APP_LINE_OA_ID;
    const lineUrl = `https://line.me/R/oaMessage/${lineAccountId}/?${encodeURIComponent(token)}`;
    window.open(lineUrl, "_blank");
  }, [userInfo]);

  const onClickToHome = useCallback(() => {
    navigate("/home");
  }, []);

  return (
    <SContainer>
      <p>Settings</p>
      <SettingWithToggle
        settingContent="コンタクト交換日を右左それぞれ設定できるようにする"
        handleChange={handleChange}
      />
      <br />
      {userInfo?.lineUserId ? (
        <p>LINE通知 連携済み ✓</p>
      ) : (
        <Button name="LINEと連携する" onClick={onClickLineConnect} />
      )}
      <br />
      <Button name="戻る" onClick={onClickToHome} />
    </SContainer>
  );
});
