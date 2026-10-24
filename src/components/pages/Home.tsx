import React, { memo, useCallback } from "react";
import styled from "styled-components";
import {
  doc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import { db, auth } from "../../firebase";
import { ExchangeDay } from "../molecules/ExchangeDay";
import { Inventory } from "../molecules/Inventory";
import { Button } from "../atoms/Button";
import { StockOfContacts } from "../../types/StockOfContactsDocument";
import { calcInventoryDeadline } from "../../utils/calcInventoryDeadline";
import { toastFunc } from "../../utils/toastFunc";
import { UserName } from "../atoms/UserName";
import { useContactSettings } from "../../hooks/useContactSettings";
import { useHomeData } from "../../hooks/useHomeData";
import { SkeletonComponent } from "../organisms/SkeletonComponent";

const SContainer = styled.div`
  padding: 0 16px;
  box-sizing: border-box;
`;

const SButtonArea = styled.div`
  margin: 32px auto 56px auto;
  max-width: 460px;
  width: 90%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const EMPTY_STOCK: StockOfContacts[] = [];

export const Home: React.FC = memo(() => {
  console.log("Home.tsxがレンダリングされた");
  const navigate = useNavigate();

  const user = auth.currentUser;
  const home = useHomeData(user);
  const settings = useContactSettings(user?.uid ?? "");
  const { setStockOfContacts } = home;
  const stockOfContacts = home.data?.stockOfContacts ?? EMPTY_STOCK;
  const collectionId = home.data?.collectionId ?? "";
  const subCollectionId = home.data?.subCollectionId ?? "";
  const contactManageType = settings.data?.contactManageType ?? 0;

  const onClickCount = useCallback(
    async (targetId: string, eyePosition: "L" | "R", sign: "+" | "-") => {
      console.log("onClickCountがレンダリングされた");

      const targetStockIndex = stockOfContacts.findIndex((s) => s.id === targetId);
      if (targetStockIndex === -1) return;
      const targetStock = stockOfContacts[targetStockIndex];

      const nextExchangeDay: Date = new Date();
      nextExchangeDay.setDate(nextExchangeDay.getDate() + 14);

      const payload: Partial<StockOfContacts> = {};

      let newLeft = targetStock.left_eye;
      let newRight = targetStock.right_eye;

      if (eyePosition === "R") {
        newRight = sign === "+" ? newRight + 1 : newRight - 1;
        payload.right_eye = newRight;
        if (sign === "-") {
          payload.exchangeDayRight = Timestamp.fromDate(nextExchangeDay);
          if (newRight < newLeft) {
            payload.exchangeDay = Timestamp.fromDate(nextExchangeDay);
          }
        }
      } else {
        newLeft = sign === "+" ? newLeft + 1 : newLeft - 1;
        payload.left_eye = newLeft;
        if (sign === "-") {
          payload.exchangeDayLeft = Timestamp.fromDate(nextExchangeDay);
          if (newLeft < newRight) {
            payload.exchangeDay = Timestamp.fromDate(nextExchangeDay);
          }
        }
      }

      payload.deadLine = calcInventoryDeadline(
        newLeft,
        newRight,
        payload.exchangeDay || targetStock.exchangeDay
      );

      const updatedStock = { ...targetStock, ...payload } as StockOfContacts;

      // オプティミスティック更新で画面を即座に変更
      setStockOfContacts((prevState) =>
        prevState.map((obj) => (obj.id === targetId ? updatedStock : obj))
      );

      // バックグラウンドでFirestoreのデータを更新
      const contactsDocRef = doc(
        db,
        "users",
        collectionId,
        "stock_of_contacts",
        targetId
      );

      try {
        await updateDoc(contactsDocRef, payload);
      } catch (error) {
        console.error("更新に失敗しました:", error);
        toastFunc("error", "数量の更新に失敗しました");
        // 更新に失敗した場合は元の状態にロールバック
        setStockOfContacts((prevState) =>
          prevState.map((obj) => (obj.id === targetId ? targetStock : obj))
        );
      }
    },
    [collectionId, stockOfContacts, setStockOfContacts]
  );

  const onClickToGuide = useCallback(() => {
    navigate("/guide");
  }, [navigate]);

  const onClickToSettings = useCallback(() => {
    navigate("/settings");
  }, [navigate]);

  const onClickSignOut = useCallback(() => {
    signOut(auth);
    toastFunc("success", "ログアウトしました");
  }, []);

  return (
    <SContainer>
      {home.isLoading ? (
        <SkeletonComponent contactManageType={contactManageType} />
      ) : !home.data ? (
        <div role="alert">
          <p>データを読み込めませんでした。通信環境を確認して、もう一度お試しください。</p>
          <Button name="再読み込み" onClick={() => { home.refetch(); }} />
        </div>
      ) : (
        <>
          <UserName children={home.data.userInfo.user_name} />
          {home.isError && <p role="alert">最新データを取得できませんでした。</p>}
          {settings.isSaving && <p role="status">設定を保存中...</p>}
          {settings.data ? (
            <ExchangeDay
              stockOfContacts={stockOfContacts}
              collectionId={collectionId}
              subCollectionId={subCollectionId}
              setStockOfContacts={setStockOfContacts}
              contactManageType={contactManageType}
            />
          ) : settings.isError ? (
            <div role="alert">
              <p>交換日の設定を読み込めませんでした。</p>
              <Button name="設定を再読み込み" onClick={() => { settings.refetch(); }} />
            </div>
          ) : (
            <p role="status">交換日の設定を読み込み中...</p>
          )}
          <Inventory
            stockOfContacts={stockOfContacts}
            onClickCount={onClickCount}
          />
          <SButtonArea>
            <Button name="使い方ガイド" onClick={onClickToGuide} />
            <Button name="設定" onClick={onClickToSettings} />
            <Button name="Sign Out" onClick={onClickSignOut} />
          </SButtonArea>
        </>
      )}
    </SContainer>
  );
});
