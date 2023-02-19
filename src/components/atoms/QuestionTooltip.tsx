import React from "react";
import { Tooltip } from "react-tooltip";
import styled from "styled-components";

const STooltip = styled.p`
  font-size: 14px;
  width: 20px;
  height: 20px;
  background-color: pink;
  border-radius: 50%;
  cursor: pointer;

  @media (max-width: 768px) {
    font-size: 10px;
    line-height: 20px;
  }
`;

type Props = {
  mark: string;
};

export const QuestionTooltip: React.FC<Props> = (props) => {
  const { mark } = props;
  return (
    <>
      <STooltip data-tooltip-id="mark-tooltip" data-tip="React-tooltip">
        {mark}
      </STooltip>
      <Tooltip id="mark-tooltip" place="top" content="Hello!" />
    </>
  );
};
