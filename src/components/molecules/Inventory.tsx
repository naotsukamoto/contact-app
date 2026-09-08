import React, { memo } from "react";
import styled from "styled-components";

import { StockOfContacts } from "../../types/StockOfContactsDocument";
import { CountButton } from "../atoms/CountButton";
import { SBox, SRow, SSplitBox } from "../styles/Elements";

type Props = {
  stockOfContacts: Array<StockOfContacts>;
  onClickCount: (targetId: string, eyePosition: "L" | "R", sign: "+" | "-") => void;
};

const SCountValue = styled.p`
  font-size: 28px;
  font-weight: 900;
  color: #1c2b36;
  margin: 4px 0 12px 0;
  font-family: 'Inter', sans-serif;
`;

const SButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
  width: 100%;
`;

const SIndexLabel = styled.p`
  font-size: 11px;
  color: #7186ad;
  margin: 0 0 12px 0;
  text-align: left;
  font-weight: 500;
`;

export const Inventory: React.FC<Props> = memo((props) => {
  const { stockOfContacts, onClickCount } = props;

  console.log("inventoryがレンダリングされた");

  return (
    <>
      <SBox>
        <h3>コンタクトレンズ残り</h3>
        {stockOfContacts.map((stockOfContact: StockOfContacts, n: number) => (
          <div key={stockOfContact.id}>
            {stockOfContacts.length > 1 && (
              <SIndexLabel>{`${n + 1}個目`}</SIndexLabel>
            )}
            <SSplitBox>
              <SRow>
                <p>左</p>
                <SCountValue>{stockOfContact.left_eye}</SCountValue>
                <SButtonGroup>
                  <CountButton
                    sign="-"
                    onClickCount={() => onClickCount(stockOfContact.id, "L", "-")}
                    disabled={stockOfContact.left_eye <= 0}
                  />
                  <CountButton
                    sign="+"
                    onClickCount={() => onClickCount(stockOfContact.id, "L", "+")}
                    disabled={false}
                  />
                </SButtonGroup>
              </SRow>
              <SRow>
                <p>右</p>
                <SCountValue>{stockOfContact.right_eye}</SCountValue>
                <SButtonGroup>
                  <CountButton
                    sign="-"
                    onClickCount={() => onClickCount(stockOfContact.id, "R", "-")}
                    disabled={stockOfContact.right_eye <= 0}
                  />
                  <CountButton
                    sign="+"
                    onClickCount={() => onClickCount(stockOfContact.id, "R", "+")}
                    disabled={false}
                  />
                </SButtonGroup>
              </SRow>
            </SSplitBox>
          </div>
        ))}
      </SBox>
    </>
  );
});

