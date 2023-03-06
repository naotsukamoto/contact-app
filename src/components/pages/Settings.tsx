/* eslint-disable react-hooks/exhaustive-deps */

import React, { useCallback } from "react";
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

import { contactManageTypeAtom } from "../../grobalStates/contactManageTypeAtom";
import { SettingWithToggle } from "../molecules/SettingWithToogle";
import { db } from "../../firebase";

const SContainer = styled.div`
  text-align: center;
`;

export const Settings: React.FC = () => {
  // コンタクトレンズの管理方法を格納するstateを作成
  const [contactManageType, setContactManageType] = useRecoilState(
    contactManageTypeAtom
  );

  // settingコレクションを参照
  const settingsCollectionRef = collection(db, "settings");

  // toggleのONのOFFによって実行される関数
  const handleChange = useCallback(() => {
    // stateを更新
    setContactManageType((prevType) => (prevType === 0 ? 1 : 0));

    // firestoreを更新する
    // getDocs(query(settingsCollectionRef, where("uid", "==", user.uid))).then(
    getDocs(
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
