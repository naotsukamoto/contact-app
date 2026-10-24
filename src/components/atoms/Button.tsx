import React, { memo } from "react";
import styled from "styled-components";

type ButtonVariant = "primary" | "ghost";

const SButton = styled.button<{ $variant: ButtonVariant }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 12px 26px;
  font-size: 13.5px;
  font-weight: 800;
  border-radius: 999px;
  transition: all 0.2s ease;
  margin: 6px auto;
  min-width: 200px;
  max-width: 320px;
  width: 100%;
  box-sizing: border-box;

  ${({ $variant }) =>
    $variant === "primary"
      ? `
        background: #ef5f26;
        color: #ffffff;
        border: none;
        box-shadow: 0 4px 12px rgba(239, 95, 38, 0.16);

        &:hover {
          background: #ff7a45;
          transform: translateY(-1px);
        }
      `
      : `
        background: #ffffff;
        color: #1c2b36;
        border: 1.5px solid #e7ecf1;

        &:hover {
          background: #f6f9fc;
          border-color: #7186ad;
        }
      `}

  &:active {
    transform: translateY(0);
  }
`;

const SImg = styled.img`
  width: 16px;
  height: 16px;
  margin-right: 8px;
`;

type Props = {
  name: string;
  img?: string;
  variant?: ButtonVariant;
  onClick: () => void;
  disabled?: boolean;
};

export const Button: React.FC<Props> = memo((props) => {
  const { name, img, variant = "ghost", onClick, disabled } = props;
  return (
    <div style={{ textAlign: "center" }}>
      <SButton type="button" $variant={variant} onClick={onClick} disabled={disabled}>
        {img && <SImg src={img} alt="logo" />}
        {name}
      </SButton>
    </div>
  );
});

