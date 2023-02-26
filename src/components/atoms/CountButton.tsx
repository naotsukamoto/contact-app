import React from "react";
import styled, { css } from "styled-components";

type Props = {
  sign: "+" | "-";
  onClickCount: () => void;
  disabled: boolean;
};

const SCountButton = styled.button`
  font-size: 36px;
  width: 55px;
  height: 55px;
  border-radius: 50%;
  cursor: pointer;
  margin: 0 2px;
  background: #afeeee;
  border: none;
  color: #333333;

  &:hover {
    opacity: 80%;
  }

  ${(props) =>
    props.disabled &&
    css`
      opacity: 30%;
      &:hover {
        opacity: 30%;
      }
    `}

  @media (max-width: 768px) {
    font-size: 18px;

    ${(props) =>
      props.disabled === false &&
      css`
        &:active {
          opacity: 80%;
        }
      `}
  }
`;

export const CountButton: React.FC<Props> = (props) => {
  const { sign, onClickCount, disabled } = props;

  return (
    <>
      {disabled ? (
        <SCountButton
          type="button"
          onClick={onClickCount}
          onTouchStart={() => ""}
          disabled
        >
          {sign}
        </SCountButton>
      ) : (
        <SCountButton
          type="button"
          onClick={onClickCount}
          onTouchStart={() => ""}
        >
          {sign}
        </SCountButton>
      )}
    </>
  );
};
