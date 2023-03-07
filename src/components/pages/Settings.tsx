/* eslint-disable react-hooks/exhaustive-deps */

import React, { useCallback, useEffect } from "react";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import {
  collection,
  getDocs,
  query,
  updateDoc,
  where,
  doc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import { SettingWithToggle } from "../molecules/SettingWithToogle";
import { auth, db } from "../../firebase";
import { contactManageTypeAtom } from "../../grobalStates/contactManageTypeAtom";
import { userInfoAtom } from "../../grobalStates/userInfoAtom";

const SContainer = styled.div`
  text-align: center;
`;

export const Settings: React.FC = () => {
  // 未ログイン時のリダイレクトnavigate
  const navigate = useNavigate();

  // コンタクトレンズの管理方法を格納するstateを作成
  const [contactManageType, setContactManageType] = useRecoilState(
    contactManageTypeAtom
  );
  // ユーザー情報を格納するstateを作成
  const [userInfo, setUserInfo] = useRecoilState(userInfoAtom);

  // settingコレクションを参照
  const settingsCollectionRef = collection(db, "settings");

  // settingsアクセス後のデータ取得
  let access: boolean = false;
  // ページアクセス時はfirebaseから情報を取得する
  useEffect(() => {
    if (!access) {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          // コンタクトレンズの管理方法を取得
          getDocs(
            query(settingsCollectionRef, where("uid", "==", user.uid))
          ).then((snapShot) => {
            snapShot.forEach((doc) => {
              // stateを更新する
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
  });

  // toggleのONのOFFによって実行される関数
  const handleChange = useCallback(() => {
    // stateを更新
    setContactManageType((prevType) => (prevType === 0 ? 1 : 0));

    // firestoreを更新する
    getDocs(
      //   query(settingsCollectionRef, where("uid", "==", userInfo.uid))
      query(
        settingsCollectionRef,
        where("uid", "==", "QPb7HajAY4PqQ0ZKTOsW1s9Aj7E2")
      )
    ).then((snapShot) => {
      snapShot.forEach((d) => {
        // stateを更新する
        // console.log("settingのデータ", doc.data().contactManageType);
        updateDoc(doc(settingsCollectionRef, d.id), {
          contactManageType: d.data().contactManageType === 0 ? 1 : 0,
        });
      });
    });
  }, []);

  return (
    <SContainer>
      <p>Settings</p>
      {contactManageType}
      <SettingWithToggle
        settingContent="コンタクト交換日を右左それぞれ設定できるようにする"
        handleChange={handleChange}
      />
    </SContainer>
  );
};
