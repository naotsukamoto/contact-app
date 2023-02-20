/* eslint-disable jsx-a11y/anchor-is-valid */
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
      <a data-tooltip-id="my-anchor-element" data-tooltip-content={content}>
        <AiFillQuestionCircle />
      </a>
      <Tooltip id="my-anchor-element" />
    </>
  );
};
