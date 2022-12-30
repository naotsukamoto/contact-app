import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const UserName: React.FC<Props> = (props) => {
  const { children } = props;
  return (
    <>
      <p>{children}</p>
    </>
  );
};
