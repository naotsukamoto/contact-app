import React, { memo } from "react";
import styled from "styled-components";

const SButton = styled.button`
  background: #fff;
  border-radius: 100vh;
  cursor: pointer;
  padding: 0.5rem 2rem;
  border: 1px solid #333333;
  margin: 10px;
  color: #333333;

  &:hover {
    opacity: 60%;
  }
`;

type Props = {
  name: string;
  onClick: () => void;
};

export const Button: React.FC<Props> = memo((props) => {
  const { name, onClick } = props;
  return (
    <div>
      <SButton type="button" onClick={onClick}>
        {name}
      </SButton>
    </div>
  );
});
