import React, { ReactNode, memo } from "react";

type Props = {
  children: ReactNode;
};

export const UserName: React.FC<Props> = memo((props) => {
  const { children } = props;

  return (
    <>
      <p>{children}</p>
    </>
  );
});
