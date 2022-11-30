import React, { memo } from "react";
import styled from "styled-components";
import { StockOfContacts } from "../../types/StockOfContactsDocument";
import { CountButton } from "../atoms/CountButton";

// import SBox styled-components
import { SBox } from "./ExchangeDay";

const SSplitBox = styled.div`
  display: flex;
  justify-content: center;
`;

const SRow = styled.div`
  margin: 8px;
  width: 100%;

  @media (max-width: 768px) {
    margin: 4px;
  }
`;

type Props = {
  stockOfContacts: Array<StockOfContacts>;
  onClickCount: (eyePosition: "L" | "R", sign: "+" | "-") => void;
};

export const Inventory: React.FC<Props> = memo((props) => {
  const { stockOfContacts, onClickCount } = props;

  console.log("inventoryがレンダリングされた");

  return (
    <>
      <SBox>
        <h3>コンタクトレンズ残り</h3>
        {stockOfContacts.map((stockOfContact: StockOfContacts, n: number) => (
          <div key={stockOfContact.id}>
            <p>{stockOfContacts.length > 0 || `${n}個目`}</p>
            <SSplitBox>
              <SRow>
                <p>左</p>
                <p>{stockOfContact.left_eye}</p>
                <CountButton
                  sign="-"
                  onClickCount={() => onClickCount("L", "-")}
                />
                <CountButton
                  sign="+"
                  onClickCount={() => onClickCount("L", "+")}
                />
              </SRow>
              <SRow>
                <p>右</p>
                <p>{stockOfContact.right_eye}</p>
                <CountButton
                  sign="-"
                  onClickCount={() => onClickCount("R", "-")}
                />
                <CountButton
                  sign="+"
                  onClickCount={() => onClickCount("R", "+")}
                />
              </SRow>
            </SSplitBox>
          </div>
        ))}
      </SBox>
    </>
  );
});
