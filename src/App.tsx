import React from "react";
import { ToastContainer } from "react-toastify";
import { BrowserRouter } from "react-router-dom";
import "react-toastify/dist/ReactToastify.min.css";
import styled from "styled-components";
import { QueryClient, QueryClientProvider } from "react-query";

import { Router } from "./components/router/Router";

const SMain = styled.div`
  background: #ffffff;
  font-family: 'Inter', 'Noto Sans JP', -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color: #1c2b36;
  min-height: 100vh;

  * {
    box-sizing: border-box;
  }
`;

const queryClient = new QueryClient();

function App() {
  return (
    <SMain>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
        <ToastContainer />
      </QueryClientProvider>
    </SMain>
  );
}

export default App;
