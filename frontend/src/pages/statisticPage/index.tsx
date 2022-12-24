import React, { useContext, useEffect } from "react";
import { UserContext } from "../../root";
import { useNavigate } from "react-router-dom";
import { AllEntitiesTable } from "./components/allEntitiesTable";
import { GET_ALL_RIDES, GET_ALL_USERS } from "../../graphql/queries/user";

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
        extractMethod={"getAllUsers"}
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
        extractMethod={"getAllRides"}
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
            id: "statusHistory",
            name: "statusHistory",
            template: (item) => item.statusHistory.join(";"),
          },
        ]}
      ></AllEntitiesTable>
    </div>
  );
};
