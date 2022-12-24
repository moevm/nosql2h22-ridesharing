import React, { useContext, useState } from "react";
import { AddUserDialog } from "../../components/addUserDialog";
import { Button, Card, Text, TextInput } from "@gravity-ui/uikit";

import "./style.scss";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../../graphql/mutations/user";
import { UserContext } from "../../root";
import { useNavigate } from "react-router-dom";

export const AuthPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { setCurrentUser } = useContext(UserContext);

  const navigate = useNavigate();

  const [loginUserMutation] = useMutation(LOGIN_USER);

  const loginUser = () => {
    setUsername("");
    setPassword("");

    loginUserMutation({
      variables: {
        input: {
          username,
          password,
        },
      },
    }).then(({ data }) => {
      if (data.loginUser.isAuthorized) {
        setCurrentUser(data.loginUser);
        navigate("/profile");
      }

      setIsLoading(false);
    });
  };

  const onLogin = () => {
    loginUser();
    setIsLoading(true);
  };

  return (
    <div className={"auth-page"}>
      <Card view={"raised"} className="card-login">
        <Text>Ridesharing authorization</Text>
        <TextInput
          disabled={isLoading}
          className={"text-input"}
          onUpdate={setUsername}
          value={username}
          placeholder="username"
        />
        <TextInput
          disabled={isLoading}
          className={"text-input"}
          onUpdate={setPassword}
          value={password}
          placeholder="password"
        />
        <Button view="action" size="m" onClick={onLogin} loading={isLoading}>
          Login
        </Button>
        <br />
        Or create new entry
        <AddUserDialog></AddUserDialog>
      </Card>
    </div>
  );
};
