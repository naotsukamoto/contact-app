/* eslint-disable react-hooks/exhaustive-deps */

import React, { memo } from "react";
import styled from "styled-components";
import { format, parse } from "date-fns";

import { StockOfContacts } from "../../types/StockOfContactsDocument";
import ja from "date-fns/locale/ja";
import { InputDate } from "../atoms/InputDate";
import { doc, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

export const SBox = styled.div`
  width: 30%;
  margin: 0 auto;
  margin-top: 16px;
  padding: 16px 16px 8px 16px;
  border-radius: 8px;
  background: #fff;

  @media (max-width: 768px) {
    width: 85%;
    padding: 4px 4px 2px 4px;
  }
`;

const SInventoryDeadline = styled.p`
  text-align: right;
  margin: 36px 16px 0 0;
  color: gray;
  font-size: 14px;

  @media (max-width: 768px) {
    margin: 9px 4px 0 0;
    font-size: 10px;
  }
`;

type Props = {
  stockOfContacts: Array<StockOfContacts>;
  collectionId: string;
  subCollectionId: string;
};

export const ExchangeDay: React.FC<Props> = memo((props) => {
  console.log("Exchangeday.tsxがレンダリングされた");
  const { stockOfContacts, collectionId, subCollectionId } = props;

  // 交換日の設定
  const onChangeDate = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const resetExchangeDay: string = e.target.value;

    // console.log(`${e.target.value} & type: ${typeof e.target.value}`);
    // console.log(parse(e.target.value, "yyyy-MM-dd", new Date()));

    // firestoreへの参照
    const contactsDocRef = doc(
      db,
      "users",
      collectionId,
      "stock_of_contacts",
      subCollectionId
    );
    await updateDoc(contactsDocRef, {
      // 交換日をでTimestampに変換してupdateする
      exchangeDay: Timestamp.fromDate(
        parse(resetExchangeDay, "yyyy-MM-dd", new Date())
      ),
    });
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
      <h3>交換日</h3>
      {stockOfContacts.map((s: StockOfContacts) => (
        <div key={s.id}>
          <p>
            {format(s.exchangeDay.toDate(), "yyyy/MM/dd (E)", { locale: ja })}
          </p>
          <InputDate dt={s.exchangeDay.toDate()} onChangeDate={onChangeDate} />
          <SInventoryDeadline>
            在庫期限:
            {statusDeadLine(
              s,
              format(s.deadLine.toDate(), "yyyy/MM/dd (E)", { locale: ja })
            )}
          </SInventoryDeadline>
        </div>
      ))}
    </SBox>
  );
});
