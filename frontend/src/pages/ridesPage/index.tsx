import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../root";
import { useNavigate } from "react-router-dom";
import { AllEntitiesTable } from "../statisticPage/components/allEntitiesTable";
import {
    /*GET_USER_PROPOSED_RIDES_COUNT,*/
    GET_USER_PROPOSED_RIDES,
    GET_ALL_RIDES_COUNT, GET_USER_PASSED_RIDES
} from "../../graphql/queries/user";
import { RideStatusHistory } from "../../components/rideStatusHistory";
import { Button, Card, TableActionConfig, Text, TextInput } from "@gravity-ui/uikit";
import { AddRideDialog } from "../../components/addRideDialog/addRideDialog";
import { ProfilePageContext } from "../profilePage";

import "./style.scss";
import {RidesTable} from "../../components/ridesTable";
import {TUser} from "../../definitions";

export const RidesPage = () => {
  const { currentUser } = useContext(UserContext);

  const [rideTitleQuery, setRideTitleQuery] = useState("");

  const [shouldUpdate, setShouldUpdate] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
      if (!currentUser.isAuthorized) {
          navigate("/auth");
      }
  }, []);

  return (
      <ProfilePageContext.Provider value={{ shouldUpdate, setShouldUpdate }}>
          <div className={"rides-page"}>
              <Card view={"raised"} className="card-profile-rides">
                  <Text variant="header-2">Proposed rides</Text>
                  <RidesTable
                      currentUser={currentUser}
                      graphQlMethod={GET_USER_PROPOSED_RIDES}
                      extractMethod={"getUserProposedRides"}
                      withActions={true}
                      addProposedRideAction={true}
                  />
              </Card>
              <div className={"create-ride-block"}>
                  <AddRideDialog />
              </div>
          </div>
      </ProfilePageContext.Provider>
  );
};
