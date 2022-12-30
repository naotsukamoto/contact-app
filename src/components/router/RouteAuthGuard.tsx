import { onAuthStateChanged } from "firebase/auth";
import React, { memo, ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { auth } from "../../firebase";
import { toastFunc } from "../../utils/toastFunc";

type Props = {
  component: ReactNode;
  redirect: string;
};

export const RouteAuthGuard: React.FC<Props> = memo((props) => {
  console.log("RouteAuthGuardがレンダリングされた");
  const { component, redirect } = props;

  const unsubscribe = onAuthStateChanged(auth, (user) => {
    console.log("RouteAuthGuardでonAuthStateChangedがレンダリングされた");
    if (!user) {
      toastFunc("error", "ログインできませんでした");
      return <Navigate to={redirect} />;
    } else {
      return <>{component}</>;
    }
  });

  unsubscribe();
  return <>{component}</>;
});
