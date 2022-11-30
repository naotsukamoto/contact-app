import React, { memo } from "react";

type Props = {
  name: string;
  onClick: () => void;
};

export const Button: React.FC<Props> = memo((props) => {
  const { name, onClick } = props;
  return (
    <div>
      <button type="button" onClick={onClick}>
        {name}
      </button>
    </div>
  );
});
