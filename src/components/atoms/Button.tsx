import React, { memo } from "react";
import styled from "styled-components";

const SButton = styled.button`
  display: flex;
  background: #fff;
  border-radius: 100vh;
  cursor: pointer;
  padding: 0.5rem 2rem;
  border: 1px solid #333333;
  margin: 0 auto;
  margin-bottom: 10px;
  color: #333333;
  align-items: center;

  &:hover {
    opacity: 60%;
  }
`;

const SImg = styled.img`
  width: 16px;
  height: 16px;
  margin: 0 5px 0 0;
`;

type Props = {
  name: string;
  img?: string;
  onClick: () => void;
};

export const Button: React.FC<Props> = memo((props) => {
  const { name, img, onClick } = props;
  return (
    <div>
      {img ? (
        <SButton type="button" onClick={onClick}>
          <SImg src={img} alt="logo" />
          {name}
        </SButton>
      ) : (
        <SButton type="button" onClick={onClick}>
          {name}
        </SButton>
      )}
    </div>
  );
});
