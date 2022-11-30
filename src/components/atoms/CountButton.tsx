import React from "react";
import styled from "styled-components";

type Props = {
  sign: "+" | "-";
  onClickCount: () => void;
};

const SCountButton = styled.button`
  height: 40px;
  width: 40%;
  font-size: 24px;
  color: #666666;

  &:hover {
    opacity: 60%;
    cursor: pointer;
  }

  @media (max-width: 768px) {
    height: 30px;
    width: 50%;
    font-size: 18px;
  }
`;

export const CountButton: React.FC<Props> = (props) => {
  const { sign, onClickCount } = props;

  return (
    <>
      <SCountButton type="button" onClick={onClickCount}>
        {sign}
      </SCountButton>
    </>
  );
};
