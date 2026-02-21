import { memo, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import { Home } from "../pages/Home";
import { Login } from "../pages/Login";
import { Signup } from "../pages/Signup";
import { Title } from "../molecules/Title";
import { RouteAuthGuard } from "./RouteAuthGuard";
import { Settings } from "../pages/Settings";
import { Guide } from "../pages/Guide";
import { TermsOfService } from "../pages/TermsOfService";
import { PrivacyPolicy } from "../pages/PrivacyPolicy";
import { Liff } from "../pages/Liff";

export const Router: React.FC = memo(() => {
  return (
    <>
      <Title />
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="sign_up" element={<Signup />}></Route>
        <Route path="terms" element={<TermsOfService />}></Route>
        <Route path="privacy" element={<PrivacyPolicy />}></Route>
        <Route path="liff" element={<Liff />}></Route>
        <Route
          path="home"
          element={<RouteAuthGuard component={<Home />} redirect="/" />}
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
        <Route
          path="guide"
          element={
            <RouteAuthGuard
              component={
                <Suspense fallback={<p>Loading....</p>}>
                  <Guide />
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
