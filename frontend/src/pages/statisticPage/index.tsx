import React, { useContext, useEffect } from "react";
import { UserContext } from "../../root";
import { useNavigate } from "react-router-dom";
import { AllEntitiesTable } from "./components/allEntitiesTable";
import {
  GET_ALL_RIDES,
  GET_ALL_RIDES_COUNT,
  GET_ALL_USERS,
  GET_ALL_USERS_COUNT,
} from "../../graphql/queries/user";
import { RideStatusHistory } from "../../components/rideStatusHistory";

export const StatisticPage = () => {
  const { currentUser } = useContext(UserContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser.isAuthorized) {
      navigate("/auth");
    }
  }, []);

  return (
    <div>
      <AllEntitiesTable
        graphQlMethod={GET_ALL_USERS}
        graphQlCountMethod={GET_ALL_USERS_COUNT}
        extractMethod={"getAllUsers"}
        extractCountMethod={"getAllUsersCount"}
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
      <AllEntitiesTable
        graphQlMethod={GET_ALL_RIDES}
        graphQlCountMethod={GET_ALL_RIDES_COUNT}
        extractMethod={"getAllRides"}
        extractCountMethod={"getAllRidesCount"}
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
    </div>
  );
};
