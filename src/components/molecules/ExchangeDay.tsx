/* eslint-disable react-hooks/exhaustive-deps */

import React, { memo } from "react";
import styled from "styled-components";
import { differenceInCalendarDays, format, parse } from "date-fns";
import ja from "date-fns/locale/ja";
import { doc, Timestamp, updateDoc } from "firebase/firestore";

import { StockOfContacts } from "../../types/StockOfContactsDocument";
import { InputDate } from "../atoms/InputDate";
import { db } from "../../firebase";
import { QuestionTooltip } from "../atoms/QuestionTooltip";
import { SRow, SSplitBox } from "./Inventory";

export const SBox = styled.div`
  width: 30%;
  margin: 0 auto;
  margin-top: 16px;
  padding: 16px 16px 8px 16px;
  border-radius: 8px;
  background: #fff;

  @media (max-width: 768px) {
    width: 85%;
    padding: 4px 4px 0px 4px;
  }
`;

const SInventoryDeadline = styled.p`
  color: gray;
  font-size: 14px;
  margin-right: 4px;

  @media (max-width: 768px) {
    font-size: 10px;
  }
`;

const SFlexRight = styled.div`
  display: flex;
  justify-content: right;
  align-items: center;
`;

const SFlexCenter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

type Props = {
  stockOfContacts: Array<StockOfContacts>;
  collectionId: string;
  subCollectionId: string;
  setStockOfContacts: React.Dispatch<React.SetStateAction<StockOfContacts[]>>;
  contactManageType: number;
};

export const ExchangeDay: React.FC<Props> = memo((props) => {
  console.log("Exchangeday.tsxがレンダリングされた");
  const {
    stockOfContacts,
    collectionId,
    subCollectionId,
    setStockOfContacts,
    contactManageType,
  } = props;

  // 交換日の設定
  const onChangeDate = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "Both" | "R" | "L"
  ) => {
    console.log(
      `onChangeDateが実行されて、交換日が${e.target.value}に変更された`,
      type
    );

    // firestoreへの参照
    const contactsDocRef = doc(
      db,
      "users",
      collectionId,
      "stock_of_contacts",
      subCollectionId
    );

    // date-fnsで文字列をDateオブジェクトにparseする
    const updatedExchangeDay: Date = parse(
      e.target.value,
      "yyyy-MM-dd",
      new Date()
    );

    // update前の在庫期限を取得
    const currentDeadLine: Date | undefined = stockOfContacts
      .find((e) => e.id === subCollectionId)
      ?.deadLine.toDate();

    // update前のupdateするコンタクトの日付typeによって取得
    const currentExchangeDay: Date | undefined = stockOfContacts
      .find((e) => e.id === subCollectionId)
      ?.exchangeDay.toDate();
    const currentExchangeDayRight: Date | undefined = stockOfContacts
      .find((e) => e.id === subCollectionId)
      ?.exchangeDayRight.toDate();
    const currentExchangeDayLeft: Date | undefined = stockOfContacts
      .find((e) => e.id === subCollectionId)
      ?.exchangeDayLeft.toDate();

    // 交換日に、resetExchangeDayをTimestampに変換してupdateする
    switch (type) {
      case "Both":
        if (
          typeof currentDeadLine !== "undefined" &&
          typeof currentExchangeDay !== "undefined"
        ) {
          // updateされた日付差分を抽出
          currentDeadLine?.setDate(
            currentDeadLine.getDate() +
              differenceInCalendarDays(updatedExchangeDay, currentExchangeDay)
          );

          // DBアップデート
          await updateDoc(contactsDocRef, {
            exchangeDay: Timestamp.fromDate(updatedExchangeDay),
            deadLine: Timestamp.fromDate(currentDeadLine),
          });

          // state更新
          setStockOfContacts((prevState: Array<StockOfContacts>) =>
            prevState.map((obj: StockOfContacts) =>
              obj.id === subCollectionId
                ? {
                    id: obj.id,
                    left_eye: obj.left_eye,
                    right_eye: obj.right_eye,
                    updated_at: obj.updated_at,
                    exchangeDay: Timestamp.fromDate(updatedExchangeDay),
                    exchangeDayRight: obj.exchangeDayRight,
                    exchangeDayLeft: obj.exchangeDayLeft,
                    deadLine: Timestamp.fromDate(currentDeadLine),
                  }
                : obj
            )
          );
        }
        break;
      case "R":
        if (
          typeof currentDeadLine !== "undefined" &&
          typeof currentExchangeDay !== "undefined"
        ) {
          // updateされた日付差分を抽出
          currentDeadLine?.setDate(
            currentDeadLine.getDate() +
              differenceInCalendarDays(updatedExchangeDay, currentExchangeDay)
          );

          // DBアップデート
          await updateDoc(contactsDocRef, {
            exchangeDayRight: Timestamp.fromDate(updatedExchangeDay),
            deadLine: Timestamp.fromDate(currentDeadLine),
          });

          // state更新
          setStockOfContacts((prevState: Array<StockOfContacts>) =>
            prevState.map((obj: StockOfContacts) =>
              obj.id === subCollectionId
                ? {
                    id: obj.id,
                    left_eye: obj.left_eye,
                    right_eye: obj.right_eye,
                    updated_at: obj.updated_at,
                    exchangeDay: obj.exchangeDay,
                    exchangeDayRight: Timestamp.fromDate(updatedExchangeDay),
                    exchangeDayLeft: obj.exchangeDayLeft,
                    deadLine: Timestamp.fromDate(currentDeadLine),
                  }
                : obj
            )
          );
        }
        break;
      case "L":
        if (
          typeof currentDeadLine !== "undefined" &&
          typeof currentExchangeDay !== "undefined"
        ) {
          // updateされた日付差分を抽出
          currentDeadLine?.setDate(
            currentDeadLine.getDate() +
              differenceInCalendarDays(updatedExchangeDay, currentExchangeDay)
          );

          // DBアップデート
          await updateDoc(contactsDocRef, {
            exchangeDayLeft: Timestamp.fromDate(updatedExchangeDay),
            deadLine: Timestamp.fromDate(currentDeadLine),
          });

          // state更新
          setStockOfContacts((prevState: Array<StockOfContacts>) =>
            prevState.map((obj: StockOfContacts) =>
              obj.id === subCollectionId
                ? {
                    id: obj.id,
                    left_eye: obj.left_eye,
                    right_eye: obj.right_eye,
                    updated_at: obj.updated_at,
                    exchangeDay: obj.exchangeDay,
                    exchangeDayRight: obj.exchangeDayRight,
                    exchangeDayLeft: Timestamp.fromDate(updatedExchangeDay),
                    deadLine: Timestamp.fromDate(currentDeadLine),
                  }
                : obj
            )
          );
        }
        break;
    }
  };

  // 在庫日の表示を制御
  const statusDeadLine = (s: StockOfContacts, t: string) => {
    if (s.left_eye < 1 || s.right_eye < 1) {
      return "在庫なし";
    } else {
      return t;
    }
  };

  return (
    <SBox>
      <SFlexCenter>
        <h3>交換日</h3>
        <QuestionTooltip content="次の交換日を表示します。手動でも編集できます。" />
      </SFlexCenter>
      {stockOfContacts.map((s: StockOfContacts) => (
        <div key={s.id}>
          {contactManageType === 1 ? (
            <SSplitBox>
              <SRow>
                <p>左</p>
                <InputDate
                  dt={s.exchangeDayLeft.toDate()}
                  onChangeDate={(e) => onChangeDate(e, "L")}
                />
              </SRow>
              <SRow>
                <p>右</p>
                <InputDate
                  dt={s.exchangeDayRight.toDate()}
                  onChangeDate={(e) => onChangeDate(e, "R")}
                />
              </SRow>
            </SSplitBox>
          ) : (
            <InputDate
              dt={s.exchangeDay.toDate()}
              onChangeDate={(e) => onChangeDate(e, "Both")}
            />
          )}

          <SFlexRight>
            <SInventoryDeadline>
              在庫期限:
              {statusDeadLine(
                s,
                format(s.deadLine.toDate(), "yyyy/MM/dd (E)", { locale: ja })
              )}
            </SInventoryDeadline>
            <QuestionTooltip content="残数が少ない方のコンタクトレンズが0になる日です。" />
          </SFlexRight>
        </div>
      ))}
    </SBox>
  );
});
