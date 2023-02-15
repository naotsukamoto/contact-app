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
  width: 150px;
  height: 36px;
  border: 2px solid #ccc;
  border-radius: 15px;
`;

const SInput = styled.input`
  position: relative;
  padding: 0 20px;
  width: 150px;
  height: 36px;
  border: 0;
  background: transparent;
  box-sizing: border-box;
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
          max="2023-03-31"
          defaultValue={format(dt, "yyyy-MM-dd", { locale: ja })}
          onChange={(e) => onChangeDate(e)}
        ></SInput>
      </SLabel>
    </>
  );
});
