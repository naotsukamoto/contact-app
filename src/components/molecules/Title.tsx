import React, { memo } from "react";
import styled from "styled-components";

const STitle = styled.div`
  text-align: center;
`;

export const Title: React.FC = memo(() => {
  console.log("Titleがレンダリングされた");

  return (
    <STitle>
      <h2>コンタクトレンズ交換日通知</h2>
      <hr />
    </STitle>
  );
});
