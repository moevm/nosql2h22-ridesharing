import React, { useContext, useEffect } from "react";
import { UserCard } from "../../components/userCard/userCard";

import "./style.scss";

import { useNavigate } from "react-router-dom";
import { UserContext } from "../../root";
import { Text } from "@gravity-ui/uikit";
import { GET_USER_PASSED_RIDES, GET_USER_RIDES } from "../../graphql/queries/user";
import { RidesTable } from "../../components/ridesTable/index";

export const ProfilePage = () => {
  const { currentUser } = useContext(UserContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser.isAuthorized) {
      navigate("/auth");
    }
  });

  return (
    <div className={"profile-page"}>
      <Text variant="header-2"> Profile</Text>
      <UserCard {...currentUser} />

      <RidesTable
        currentUser={currentUser}
        graphQlMethod={GET_USER_RIDES}
        extractMethod={"getUserRides"}
      />

      <RidesTable
        currentUser={currentUser}
        graphQlMethod={GET_USER_PASSED_RIDES}
        extractMethod={"getUserPassedRides"}
      />
    </div>
  );
};
