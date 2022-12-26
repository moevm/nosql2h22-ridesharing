import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_RIDE } from "../../graphql/queries/ride";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../root";
import { TRideWithRelation, TUser } from "../../definitions";
import { RideStatusHistory } from "../../components/rideStatusHistory";
import { GET_ALL_USERS_IN_RIDE } from "../../graphql/queries/user";
import { UsersTable } from "../../components/usersTable";
import { Card, Text } from "@gravity-ui/uikit";

import "./style.scss";

export const RidePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { currentUser } = useContext(UserContext);

  const [users, setUsers] = useState<TUser[]>([]);

  const [ride, setRide] = useState<TRideWithRelation>({
    date: "",
    from: "",
    id: "",
    isDriver: false,
    isFuture: false,
    isSure: false,
    maxPassengers: 0,
    price: 0,
    statusHistory: [],
    title: "",
    to: "",
  });

  useEffect(() => {
    if (!currentUser.isAuthorized) {
      navigate("/auth");
    }
  });

  const { data, loading, error } = useQuery(GET_RIDE, {
    variables: {
      username: currentUser.username,
      id,
    },
  });

  const { data: passengers, loading: loadingPassengers } = useQuery(
    GET_ALL_USERS_IN_RIDE,
    {
      variables: {
        id,
      },
    }
  );

  useEffect(() => {
    if (!loading && data) {
      // @ts-ignore
      setRide({ ...data.getRide.ride, ...data.getRide.relation });
    }
  }, [loading, data]);

  useEffect(() => {
    if (!loadingPassengers && passengers) {
      setUsers([passengers.getAllUsersInRide]);
    }
  }, [loadingPassengers, passengers]);

  return (
    <div className={"ride-page"}>
      <Card view={"raised"} className="card-ride">
        <Text variant="display-4"> {ride.title} </Text> <br />
        <Text variant="code-inline-3"> From: {ride.from} </Text> <br />
        <Text variant="code-inline-3"> To: {ride.to} </Text> <br />
        <Text variant="code-inline-3"> Price: {ride.price} </Text> <br />
        <Card view={"outlined"} className={"participants-table"}>
          <Text variant="header-2"> Participants:</Text>
          <UsersTable
            graphQlMethod={GET_ALL_USERS_IN_RIDE}
            extractMethod={"getAllUsersInRide"}
            methodProps={{ id: id ? id : "" }}
            withPagination={false}
            tableActions={[]}
          ></UsersTable>
        </Card>

        <div className={"status-history"}>
          <RideStatusHistory ride={ride} />
        </div>
      </Card>
    </div>
  );
};
