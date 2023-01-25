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
import { Button, Card, Text, TextInput } from "@gravity-ui/uikit";
import { AddRideDialog } from "../../components/addRideDialog/addRideDialog";

import "./style.scss";
import {RidesTable} from "../../components/ridesTable";

export const RidesPage = () => {
  const { currentUser } = useContext(UserContext);

  const [rideTitleQuery, setRideTitleQuery] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
      if (!currentUser.isAuthorized) {
          navigate("/auth");
      }
  }, []);

  return (
    <div className={"rides-page"}>
        <Card view={"raised"} className="card-profile-rides">
            <Text variant="header-2">Proposed rides</Text>
            <RidesTable
                currentUser={currentUser}
                graphQlMethod={GET_USER_PROPOSED_RIDES}
                extractMethod={"getUserProposedRides"}
                withActions={false}
            />
        </Card>
        <div className={"create-ride-block"}>
        <AddRideDialog />
      </div>
    </div>
  );
};

/*
<Card view={"raised"} className="card-statistics">
            <Text variant="header-2"> All rides</Text>
            <TextInput
                className={"query-text-input"}
                onUpdate={setRideTitleQuery}
                value={rideTitleQuery}
                placeholder="search by ride title"
            />
            <AllEntitiesTable
                graphQlMethod={GET_USER_PROPOSED_RIDES}
                graphQlCountMethod={GET_ALL_RIDES_COUNT}
                extractMethod={"getUserProposedRides"}
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
 */