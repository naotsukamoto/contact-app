import React, { memo } from "react";
import { Outlet } from "react-router-dom";

export const Layout: React.FC = memo(() => {
  return (
    <div>
      {/* <Header /> */}
      <Outlet />
    </div>
  );
});
