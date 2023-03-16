import { memo, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import { Home } from "../pages/Home";
import { Home2 } from "../pages/Home2";
import { Login } from "../pages/Login";
import { Signup } from "../pages/Signup";
import { Title } from "../molecules/Title";
import { RouteAuthGuard } from "./RouteAuthGuard";
import { Settings } from "../pages/Settings";

export const Router: React.FC = memo(() => {
  return (
    <>
      <Title />
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="sign_up" element={<Signup />}></Route>
        <Route
          path="home"
          element={<RouteAuthGuard component={<Home />} redirect="/" />}
        ></Route>
        <Route
          path="home2"
          element={<RouteAuthGuard component={<Home2 />} redirect="/" />}
        ></Route>
        <Route
          path="settings"
          element={
            <RouteAuthGuard
              component={
                <Suspense fallback={<p>Loading....</p>}>
                  <Settings />
                </Suspense>
              }
              redirect="/"
            />
          }
        ></Route>
      </Routes>
    </>
  );
});
