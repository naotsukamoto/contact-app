import React, { ReactNode, memo } from "react";
import styled from "styled-components";

type Props = {
  children: ReactNode;
};

const SWelcome = styled.div`
  max-width: 460px;
  width: 90%;
  margin: 32px auto 8px auto;
  text-align: left;
  font-size: 14px;
  font-weight: 800;
  color: #7186ad;
  letter-spacing: -0.01em;

  span {
    color: #1c2b36;
    font-size: 18px;
    margin-right: 4px;
  }
`;

export const UserName: React.FC<Props> = memo((props) => {
  const { children } = props;

  return (
    <SWelcome>
      こんにちは、<span>{children || "ゲスト"}</span>さん
    </SWelcome>
  );
});

