import React from "react";
import { Tooltip } from "react-tooltip";

type Props = {
  mark: string;
};

export const QuestionTooltip: React.FC<Props> = (props) => {
  const { mark } = props;
  return (
    <div>
      <span data-tooltip-id="mark-tooltip" data-tip="React-tooltip">
        {mark}
      </span>
      <Tooltip id="mark-tooltip" place="top" content="Hello!" />
    </div>
  );
};
