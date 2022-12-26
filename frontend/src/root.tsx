import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";

import ErrorPage from "./error-page";
import { AuthPage } from "./pages/authPage";
import { StatisticPage } from "./pages/statisticPage";
import { Layout } from "./components/Layout";
import { ProfilePage } from "./pages/profilePage";
import { TUser } from "./definitions";
import { RidesPage } from "./pages/ridesPage";
import { RidePage } from "./pages/ridePage";

export const UserContext = React.createContext({
  currentUser: {
    isAuthorized: false,
    isAdmin: false,
    username: "",
    id: "",
  },
  setCurrentUser: (newValue: TUser) => {},
});

function Root() {
  const [currentUser, setUser] = useState({
    isAuthorized: false,
    username: "",
    isAdmin: false,
    id: "",
  });

  function setCurrentUser(newValue: TUser) {
    setUser(newValue);
  }

  return (
    <div className="App">
      <UserContext.Provider value={{ currentUser, setCurrentUser }}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="*" element={<ErrorPage />}></Route>
            <Route path="auth" element={<AuthPage />}></Route>
            <Route path="statistics" element={<StatisticPage />}></Route>
            <Route path="profile" element={<ProfilePage />}></Route>
            <Route path="rides" element={<RidesPage />}></Route>
            <Route path="ride/:id" element={<RidePage />}></Route>
          </Route>
        </Routes>
      </UserContext.Provider>
    </div>
  );
}

export default Root;
