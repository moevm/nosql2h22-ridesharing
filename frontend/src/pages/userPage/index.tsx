import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_USER } from "../../graphql/queries/user";
import { UserCard } from "../../components/userCard";

import { useParams } from "react-router-dom";

export const UserPage = () => {
  const {id} = useParams();

  const {
    data: oneUser,
    loading: loadingOneUser,
    error,
  } = useQuery(GET_USER, {
    variables: {
      id,
    },
  });
  const [user, setUser] = useState({
    username: "",
    id: "",
  });

  console.log(user);

  useEffect(() => {
    if (!loadingOneUser) {
      console.log(oneUser, "hi");
      setUser(oneUser.getUser);
    }
  }, [oneUser]);

  return <UserCard username={user.username} id={user.id} />;
};
