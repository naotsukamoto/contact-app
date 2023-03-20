import React, { memo } from "react";
import styled from "styled-components";
import { SBox } from "../styles/Elements";

type Props = {
  title: string;
  sentense: string;
};

const SContainer = styled.div`
  text-align: center;
  font-size: 14px;
`;

export const Sentense: React.FC<Props> = memo((props) => {
  const { title, sentense } = props;
  return (
    <SContainer>
      <SBox>
        <h3>{title}</h3>
        <p>{sentense}</p>
      </SBox>
    </SContainer>
  );
});
