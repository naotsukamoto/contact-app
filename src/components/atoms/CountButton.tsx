import React from "react";
import styled from "styled-components";

type Props = {
  sign: "+" | "-";
  onClickCount: () => void;
};

const SCountButton = styled.button`
  font-size: 36px;
  width: 55px;
  height: 55px;
  border-radius: 50%;
  cursor: pointer;
  margin: 0 2px;
  background: #00ffff;
  border: none;
  outline: none;

  &:hover {
    opacity: 60%;
  }

  @media (max-width: 768px) {
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
