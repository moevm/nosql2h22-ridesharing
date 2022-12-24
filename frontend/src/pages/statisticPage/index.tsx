import React, { useContext, useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_ALL_USERS } from "../../graphql/queries/user";
import { Button, Table } from "@gravity-ui/uikit";
import { UserContext } from "../../root";
import { useNavigate } from "react-router-dom";

export const StatisticPage = () => {
  const { data, loading, error, refetch } = useQuery(GET_ALL_USERS);
  const [users, setUsers] = useState([]);

  const { currentUser } = useContext(UserContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser.isAuthorized) {
      navigate("/auth");
    }
  }, []);

  useEffect(() => {
    if (!loading) {
      setUsers(data.getAllUsers);
    }
  }, [data]);

  return (
    <>
      <Table
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
        data={users}
      />

      <Button
        onClick={function onClick() {
          refetch();
        }}
        view="normal"
      >
        Load users
      </Button>
    </>
  );
};
