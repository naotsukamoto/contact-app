import { format } from "date-fns";
import ja from "date-fns/locale/ja";
import { memo } from "react";
import styled from "styled-components";

type Props = {
  dt: Date;
  onChangeDate: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const SLabel = styled.label`
  position: relative;
  display: inline-block;
  max-width: 170px;
  width: 100%;
  height: 38px;
  border: 1.5px solid #e7ecf1;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(28, 43, 54, 0.02);
  transition: border-color 0.2s;

  &:focus-within {
    border-color: #ef5f26;
  }

  @media (max-width: 768px) {
    max-width: 100%;
    height: 34px;
    border-radius: 8px;
  }
`;

const SInput = styled.input`
  position: relative;
  padding: 0 14px;
  width: 100%;
  height: 100%;
  border: 0;
  color: #1c2b36;
  font-family: inherit;
  font-size: 13.5px;
  font-weight: 700;
  background: transparent;
  box-sizing: border-box;
  outline: none;
  cursor: pointer;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 11.5px;
    padding: 0 8px;
  }
`;

export const InputDate: React.FC<Props> = memo((props) => {
  const { dt, onChangeDate } = props;
  const today = new Date();

  return (
    <>
      <SLabel>
        <SInput
          name="date"
          type="date"
          min={format(today, "yyyy-MM-dd", { locale: ja })}
          value={format(dt, "yyyy-MM-dd", { locale: ja })}
          onChange={(e) => onChangeDate(e)}
        ></SInput>
      </SLabel>
    </>
  );
});
