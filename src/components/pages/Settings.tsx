/* eslint-disable react-hooks/exhaustive-deps */

import React, { memo, useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { useAtom, useSetAtom } from "jotai";
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
import { getFunctions, httpsCallable } from "firebase/functions";
import { onAuthStateChanged, User } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import { SettingWithToggle } from "../molecules/SettingWithToogle";
import { auth, db } from "../../firebase";
import { contactManageTypeAtom } from "../../grobalStates/contactManageTypeAtom";
import { userInfoAtom } from "../../grobalStates/userInfoAtom";
import { userConverter } from "../../converters/userConverter";
import { Button } from "../atoms/Button";
import { toastFunc } from "../../utils/toastFunc";

const SContainer = styled.div`
  text-align: center;
`;

export const Settings: React.FC = memo(() => {
  const navigate = useNavigate();

  const setContactManageType = useSetAtom(contactManageTypeAtom);
  const [userInfo, setUserInfo] = useAtom(userInfoAtom);

  const [isLinking, setIsLinking] = useState(false);
  const [isUnlinking, setIsUnlinking] = useState(false);

  const settingsCollectionRef = collection(db, "settings");
  const usersCollectionRef = collection(db, "users").withConverter(
    userConverter
  );

  useEffect(() => {
    let active = true;

    const loadData = async (user: User) => {
      if (!active) return;
      try {
        const settingsSnapShot = await getDocs(
          query(settingsCollectionRef, where("uid", "==", user.uid))
        );
        settingsSnapShot.forEach((docObj) => {
          if (active) setContactManageType(docObj.data().contactManageType);
        });

        const usersSnapShot = await getDocs(
          query(usersCollectionRef, where("uid", "==", user.uid))
        );
        usersSnapShot.forEach((docObj) => {
          if (active) setUserInfo(docObj.data());
        });
      } catch (error) {
        console.error("設定データの取得中にエラーが発生しました:", error);
      }
    };

    const currentUser = auth.currentUser;
    let unsubscribe: (() => void) | undefined;

    if (currentUser) {
      loadData(currentUser);
    } else {
      unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          loadData(user);
        } else {
          navigate("/");
        }
      });
    }

    return () => {
      active = false;
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const handleChange = useCallback(() => {
    setContactManageType((prevType) => (prevType === 0 ? 1 : 0));

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
    setIsLinking(true);
    try {
      const token = crypto.randomUUID();
      const expiry = new Date(Date.now() + 10 * 60 * 1000);

      await setDoc(doc(db, "line_link_tokens", token), {
        uid: userInfo.uid,
        expiry: Timestamp.fromDate(expiry),
        createdAt: Timestamp.now(),
      });

      const liffId = process.env.REACT_APP_LIFF_ID;
      const redirectOrigin = encodeURIComponent(window.location.origin);
      window.location.href = `https://liff.line.me/${liffId}?token=${encodeURIComponent(
        token
      )}&redirect=${redirectOrigin}`;
    } catch (err) {
      console.error("[LINE連携] エラー:", err);
      toastFunc("error", "連携処理中にエラーが発生しました");
      setIsLinking(false);
    }
  }, [userInfo]);

  const onClickLineUnlink = useCallback(async () => {
    if (!window.confirm("LINE通知連携を解除しますか？")) return;
    setIsUnlinking(true);
    try {
      const functions = getFunctions(undefined, "asia-northeast1");
      const unlinkFn = httpsCallable(functions, "unlinkLineAccount");
      await unlinkFn();
      setUserInfo((prev) => {
        const next = { ...prev };
        delete next.lineUserId;
        return next;
      });
      toastFunc("success", "LINE連携を解除しました");
    } catch (err) {
      console.error("[LINE連携解除] エラー:", err);
      toastFunc("error", "解除中にエラーが発生しました");
    } finally {
      setIsUnlinking(false);
    }
  }, [setUserInfo]);

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
        <>
          <p>LINE通知 連携済み ✓</p>
          <Button
            name={isUnlinking ? "解除中..." : "LINE連携を解除する"}
            onClick={onClickLineUnlink}
          />
        </>
      ) : (
        <Button
          name={isLinking ? "連携中..." : "LINEで通知を受け取る"}
          onClick={onClickLineConnect}
        />
      )}
      <br />
      <Button name="戻る" onClick={onClickToHome} />
    </SContainer>
  );
});
