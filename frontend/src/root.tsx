import React from "react";

import { ThemeProvider } from "@gravity-ui/uikit";
import { Route, Routes } from "react-router-dom";

import ErrorPage from "./error-page";
import { AuthPage } from "./pages/authPage";
import { StatisticPage } from "./pages/statisticPage";
import { Layout } from "./components/Layout";
import { UserPage } from "./pages/userPage";

function Root() {
  return (
    <ThemeProvider theme="light">
      <div className="App">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="statistics" element={<StatisticPage />}></Route>
            <Route path="auth" element={<AuthPage />}></Route>
            <Route path="user/:id" element={<UserPage />}></Route>
            <Route path="*" element={<ErrorPage />}></Route>
          </Route>
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default Root;
