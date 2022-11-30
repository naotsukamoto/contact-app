import { onAuthStateChanged } from "firebase/auth";
import React, { memo, ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { auth } from "../../firebase";

type Props = {
  component: ReactNode;
  redirect: string;
};

export const RouteAuthGuard: React.FC<Props> = memo((props) => {
  console.log("RouteAuthGuardがレンダリングされた");
  const { component, redirect } = props;

  onAuthStateChanged(auth, (user) => {
    if (!user) {
      return <Navigate to={redirect} />;
    } else {
      return <>{component}</>;
    }
  });

  return <>{component}</>;
});
