import React, { useContext, useEffect, useState } from "react";
import { UserCard } from "../../components/userCard/userCard";

import "./style.scss";

import { useNavigate } from "react-router-dom";
import { UserContext } from "../../root";
import { Button, Table, Text } from "@gravity-ui/uikit";
import { GET_USER_RIDES } from "../../graphql/queries/user";
import { useQuery } from "@apollo/client";
import { TRelation, TRide, TRideWithRelation } from "../../definitions";
import { Pagination } from "@mui/material";

export const ProfilePage = () => {
  const { currentUser } = useContext(UserContext);
  const [pageNumber, setPageNumber] = useState(1);

  const { data, loading, error, refetch } = useQuery(GET_USER_RIDES, {
    variables: {
      username: currentUser.username,
      pagenumber: pageNumber,
    },
  });
  const [rides, setRides] = useState<TRideWithRelation[]>([]);

  useEffect(() => {
    if (!loading) {
      const rides: TRideWithRelation[] = data.getUserRides.map(
        ({ ride, relation }: { ride: TRide; relation: TRelation }) => ({
          ...ride,
          ...relation,
        })
      );

      setRides(rides);
    }
  }, [data]);

  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser.isAuthorized) {
      navigate("/auth");
    }
  });

  useEffect(() => {
    refetch({
      username: currentUser.username,
      pagenumber: pageNumber,
    });
  }, [pageNumber]);

  return (
    <div className={"profile-page"}>
      <Text variant="header-2"> Profile</Text>
      <UserCard {...currentUser} />

      <Table
        columns={[
          {
            id: "date",
            name: "Date",
          },
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
            name: "To",
          },
          {
            id: "price",
            name: "Price",
          },
          {
            id: "isDriver",
            name: "I am driver",
            template: (item) => {
              return item.isDriver ? "Yes" : "No";
            },
          },
        ]}
        data={rides}
      />
      <Pagination
        count={10}
        color="primary"
        onChange={(event, page) => {
          setPageNumber(page);
        }}
      />
    </div>
  );
};
