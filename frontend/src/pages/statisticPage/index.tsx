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
import { Button } from "@gravity-ui/uikit";

export const StatisticPage = () => {
  const { currentUser } = useContext(UserContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser.isAuthorized) {
      navigate("/auth");
    }
  }, []);

  const downloadDb = () => {
    fetch(`http://localhost:5001/download`, {
      method: "GET",
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `db.json`);

        document.body.appendChild(link);

        link.click();
        link.parentNode!.removeChild(link);
      });
  };

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

      <Button
        view="outlined-info"
        size={"s"}
        onClick={function onClick() {
          downloadDb();
        }}
      >
        Download DB
      </Button>
    </div>
  );
};
