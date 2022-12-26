import React, { useContext, useEffect, useState } from "react";
import { UserCard } from "../../components/userCard/userCard";

import "./style.scss";

import { useNavigate } from "react-router-dom";
import { UserContext } from "../../root";
import { Card, Text } from "@gravity-ui/uikit";
import {
  GET_USER_INVITED_RIDES,
  GET_USER_PASSED_RIDES,
  GET_USER_RIDES,
} from "../../graphql/queries/user";
import { RidesTable } from "../../components/ridesTable/index";

export const ProfilePageContext = React.createContext({
  shouldUpdate: true,
  setShouldUpdate: (newValue: boolean) => {},
});

export const ProfilePage = () => {
  const { currentUser } = useContext(UserContext);

  const [shouldUpdate, setShouldUpdate] = useState(true);

  function _setShouldUpdate(newValue: boolean) {
    setShouldUpdate(newValue);
  }

  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser.isAuthorized) {
      navigate("/auth");
    }
  });

  return (
    <ProfilePageContext.Provider value={{ shouldUpdate, setShouldUpdate }}>
      <div className={"profile-page"}>
        <Text className={"page-header"} variant="header-2">
          Profile of {currentUser.username}
        </Text>

        <div className={"tables"}>
          <Card view={"raised"} className="card-profile-rides">
            <Text variant="header-2"> My future rides</Text>
            <RidesTable
              currentUser={currentUser}
              graphQlMethod={GET_USER_RIDES}
              extractMethod={"getUserRides"}
              withActions={true}
            />
          </Card>

          <Card view={"raised"} className="card-profile-rides">
            <Text variant="header-2">Passed rides</Text>
            <RidesTable
              currentUser={currentUser}
              graphQlMethod={GET_USER_PASSED_RIDES}
              extractMethod={"getUserPassedRides"}
              withActions={false}
            />
          </Card>

          <Card view={"raised"} className="card-profile-rides">
            <Text variant="header-2">Invitations</Text>
            <RidesTable
              currentUser={currentUser}
              graphQlMethod={GET_USER_INVITED_RIDES}
              extractMethod={"getUserInvitations"}
              withActions={true}
            />
          </Card>
        </div>
      </div>
    </ProfilePageContext.Provider>
  );
};
