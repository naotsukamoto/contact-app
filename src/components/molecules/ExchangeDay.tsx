/* eslint-disable react-hooks/exhaustive-deps */

import React, { memo } from "react";
import styled from "styled-components";
import { format } from "date-fns";
import { StockOfContacts } from "../../types/StockOfContactsDocument";

export const SBox = styled.div`
  border: 1px solid gray;
  width: 30%;
  margin: 0 auto;
  margin-top: 16px;
  padding: 16px 16px 8px 16px;
  border-radius: 8px;
  box-shadow: 10px 5px 5px #eeeeee;

  @media (max-width: 768px) {
    width: 80%;
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
  const { stockOfContacts } = props;

  return (
    <SBox>
      <h3>交換日</h3>
      {stockOfContacts.map((s: StockOfContacts) => (
        <div key={s.id}>
          <p>{format(s.exchangeDay.toDate(), "yyyy/MM/dd")}</p>
          <SInventoryDeadline>
            在庫期限:{format(s.deadLine.toDate(), "yyyy/MM/dd")}
          </SInventoryDeadline>
        </div>
      ))}
    </SBox>
  );
});
