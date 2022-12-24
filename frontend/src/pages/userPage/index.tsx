import React, {useContext, useEffect} from "react";
import { UserCard } from "../../components/userCard";

import { useNavigate } from "react-router-dom";
import { UserContext } from "../../root";

export const UserPage = () => {
  const { currentUser } = useContext(UserContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser.isAuthorized) {
      navigate("/auth");
    }
  }, []);

  return <UserCard username={currentUser.username} id={currentUser.id} />;
};
