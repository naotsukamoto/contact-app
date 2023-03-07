import React from "react";
import { ToastContainer } from "react-toastify";
import { BrowserRouter } from "react-router-dom";
import "react-toastify/dist/ReactToastify.min.css";
import styled from "styled-components";
import { RecoilRoot } from "recoil";

import { Router } from "./components/router/Router";

const SMain = styled.div`
  background: #fafafa;
  font-family: -apple-system, BlinkMacSystemFont, Helvetica Neue, Segoe UI,
    Hiragino Kaku Gothic ProN, Hiragino Sans, ヒラギノ角ゴ ProN W3, Arial,
    メイリオ, Meiryo, sans-serif;
  color: #333333;
`;

function App() {
  return (
    <SMain>
      <RecoilRoot>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
        <ToastContainer />
      </RecoilRoot>
    </SMain>
  );
}

export default App;
