import { onAuthStateChanged, User } from "firebase/auth";
import React, { memo, ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import { auth } from "../../firebase";

type Props = {
  component: ReactNode;
  redirect: string;
};

export const RouteAuthGuard: React.FC<Props> = memo(({ component, redirect }) => {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  if (user === undefined) return null;
  if (!user) return <Navigate to={redirect} />;
  return <>{component}</>;
});
