import React from "react";
import styled from "styled-components";

type Props = {
  sign: "+" | "-";
  onClickCount: () => void;
  disabled: boolean;
};

const SCountButton = styled.button<{ $sign: "+" | "-"; $disabled: boolean }>`
  font-size: 20px;
  font-weight: 800;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  margin: 0 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-sizing: border-box;

  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
    font-size: 16px;
    margin: 0 2px;
  }

  ${({ $sign }) =>
    $sign === "+"
      ? `
        background: #ef5f26;
        color: #ffffff;
        border: none;
        box-shadow: 0 2px 8px rgba(239, 95, 38, 0.16);

        &:hover {
          background: #ff7a45;
          transform: scale(1.05);
        }
      `
      : `
        background: #ffffff;
        color: #1c2b36;
        border: 1.5px solid #e7ecf1;

        &:hover {
          background: #f6f9fc;
          border-color: #7186ad;
          transform: scale(1.05);
        }
      `}

  ${({ $disabled }) =>
    $disabled &&
    `
      opacity: 0.3;
      cursor: not-allowed;
      pointer-events: none;
    `}
`;

export const CountButton: React.FC<Props> = (props) => {
  const { sign, onClickCount, disabled } = props;

  return (
    <SCountButton
      type="button"
      onClick={onClickCount}
      $sign={sign}
      $disabled={disabled}
      disabled={disabled}
    >
      {sign}
    </SCountButton>
  );
};

