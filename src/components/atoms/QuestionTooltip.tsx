import React from "react";
import { Tooltip } from "react-tooltip";
import styled from "styled-components";
import { AiFillQuestionCircle } from "react-icons/ai";

type Props = {
  content: string;
};

export const STooltip = styled.p`
  cursor: pointer;
`;

export const QuestionTooltip: React.FC<Props> = (props) => {
  const { content } = props;
  return (
    <>
      <STooltip data-tooltip-id="mark-tooltip" data-tip="React-tooltip">
        <AiFillQuestionCircle />
      </STooltip>
      <Tooltip id="mark-tooltip" place="top" content={content} />
    </>
  );
};
