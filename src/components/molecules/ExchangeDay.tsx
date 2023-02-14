/* eslint-disable react-hooks/exhaustive-deps */

import React, { memo } from "react";
import styled from "styled-components";
import { format } from "date-fns";

import { StockOfContacts } from "../../types/StockOfContactsDocument";
import ja from "date-fns/locale/ja";
import { InputDate } from "../atoms/InputDate";

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
};

export const ExchangeDay: React.FC<Props> = memo((props) => {
  console.log("Exchangeday.tsxがレンダリングされた");
  const { stockOfContacts } = props;

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
          <InputDate dt={s.exchangeDay.toDate()} />
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
