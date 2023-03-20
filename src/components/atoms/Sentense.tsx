import React, { memo } from "react";

type Props = {
  title: string;
  sentense: string;
};

export const Sentense: React.FC<Props> = memo((props) => {
  const { title, sentense } = props;
  return (
    <>
      <h3>{title}</h3>
      <p>{sentense}</p>
    </>
  );
});
