import React, { memo, useCallback, useState } from "react";
import styled from "styled-components";
import { useQuery, useQueryClient } from "react-query";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { useNavigate } from "react-router-dom";

import { SettingWithToggle } from "../molecules/SettingWithToogle";
import { auth, db } from "../../firebase";
import { useContactSettings } from "../../hooks/useContactSettings";
import { HomeData } from "../../hooks/useHomeData";
import { UserDocument } from "../../types/UserDocument";
import { withTimeout } from "../../utils/withTimeout";
import { userConverter } from "../../converters/userConverter";
import { Button } from "../atoms/Button";
import { toastFunc } from "../../utils/toastFunc";

const SContainer = styled.div`
  text-align: center;
`;

export const Settings: React.FC = memo(() => {
  const navigate = useNavigate();

  const uid = auth.currentUser?.uid ?? "";
  const queryClient = useQueryClient();
  const settings = useContactSettings(uid);
  const { data: userInfo } = useQuery<UserDocument | undefined>(
    ["userInfo", uid],
    async () => {
      const snapshot = await withTimeout(getDocs(
        query(collection(db, "users").withConverter(userConverter), where("uid", "==", uid))
      ));
      return snapshot.docs[0]?.data();
    },
    {
      enabled: !!uid,
      initialData: () => queryClient.getQueryData<HomeData>(["home", uid])?.userInfo,
      staleTime: 30000,
      retry: false,
    }
  );
  const [isLinking, setIsLinking] = useState(false);
  const [isUnlinking, setIsUnlinking] = useState(false);

  const handleChange = () => {
    if (!settings.data || settings.isSaving) return;
    settings.save(settings.data.contactManageType === 0 ? 1 : 0);
  };

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
      queryClient.setQueryData<UserDocument | undefined>(["userInfo", uid], (previous) => {
        if (!previous) return previous;
        const next = { ...previous };
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
  }, [queryClient, uid]);

  const onClickToHome = useCallback(() => {
    navigate("/home");
  }, [navigate]);

  return (
    <SContainer>
      <p>Settings</p>
      <SettingWithToggle
        disabled={!settings.data || settings.isSaving}
        checked={settings.data?.contactManageType === 1}
        settingContent="コンタクト交換日を右左それぞれ設定できるようにする"
        handleChange={handleChange}
      />
      {settings.isLoading && <p role="status">設定を読み込み中...</p>}
      {settings.isSaving && <p role="status">設定を保存中...</p>}
      {settings.isError && <div role="alert">
        <p>設定を読み込めませんでした。</p>
        <Button name="再読み込み" onClick={() => { settings.refetch(); }} />
      </div>}
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
