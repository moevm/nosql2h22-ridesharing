import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../root";
import { useNavigate } from "react-router-dom";
import { AllEntitiesTable } from "./components/allEntitiesTable";
import { GET_ALL_RIDES, GET_ALL_RIDES_COUNT, GET_ALL_USERS, GET_ALL_USERS_COUNT } from "../../graphql/queries/user";
import { RideStatusHistory } from "../../components/rideStatusHistory";
import { Button, Card, Text, TextInput } from "@gravity-ui/uikit";

import "./style.scss";

export const StatisticPage = () => {
  const { currentUser } = useContext(UserContext);

  const [usernameQuery, setUsernameQuery] = useState("");
  const [rideTitleQuery, setRideTitleQuery] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser.isAuthorized) {
      navigate("/auth");
    }
  }, []);


  return (
    <div className={"stats-page"}>
      <Text className={"page-header"} variant="display-4"> Statistics</Text>
      <Card view={"raised"} className="card-statistics" >
        <Text variant="header-2"> All users</Text>
        <TextInput
          className={"query-text-input"}
          onUpdate={setUsernameQuery}
          value={usernameQuery}
          placeholder="search by username"
        />
        <AllEntitiesTable
          graphQlMethod={GET_ALL_USERS}
          graphQlCountMethod={GET_ALL_USERS_COUNT}
          extractMethod={"getAllUsers"}
          extractCountMethod={"getAllUsersCount"}
          stringQuery={usernameQuery}
          columns={[
            {
              id: "username",
              name: "Username",
            },
            {
              id: "id",
              name: "Id",
            },
          ]}
        ></AllEntitiesTable>
      </Card>

      <Card view={"raised"} className="card-statistics">
        <Text variant="header-2"> All rides</Text>
        <TextInput
          className={"query-text-input"}
          onUpdate={setRideTitleQuery}
          value={rideTitleQuery}
          placeholder="search by ride title"
        />
        <AllEntitiesTable
          graphQlMethod={GET_ALL_RIDES}
          graphQlCountMethod={GET_ALL_RIDES_COUNT}
          extractMethod={"getAllRides"}
          extractCountMethod={"getAllRidesCount"}
          stringQuery={rideTitleQuery}
          columns={[
            {
              id: "title",
              name: "Title",
            },
            {
              id: "from",
              name: "From",
            },
            {
              id: "to",
              name: "to",
            },
            {
              id: "price",
              name: "price",
            },
            {
              id: "maxPassengers",
              name: "maxPassengers",
            },
            {
              id: "id",
              name: "",
              template: (item) => {
                return <RideStatusHistory ride={item} />;
              },
            },
          ]}
        ></AllEntitiesTable>
      </Card>

    </div>
  );
};
