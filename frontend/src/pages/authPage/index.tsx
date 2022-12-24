import React, { useContext, useState } from "react";
import { AddUserDialog } from "../../components/addUserDialog/addUserDialog";
import { Button, Card, Text, TextInput, useToaster } from "@gravity-ui/uikit";

import "./style.scss";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../../graphql/mutations/user";
import { UserContext } from "../../root";
import { useNavigate } from "react-router-dom";

export const AuthPage = () => {
  const { add } = useToaster();

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
    })
      .then(({ data }) => {
        if (data.loginUser.isAuthorized) {
          setCurrentUser(data.loginUser);
          navigate("/profile");
        } else {
          add({
            name: "Error",
            title: "Failed to authorize",
            type: "error",
            allowAutoHiding: true,
            timeout: 5000,
          });
        }

        setIsLoading(false);
      })
      .catch((errors) => {
        console.log(errors);
        add({
          name: "Error",
          title: "Failed to authorize",
          content: errors?.message,
          type: "error",
          allowAutoHiding: true,
          timeout: 5000,
        });
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
        <Text variant="header-2"> Ridesharing authorization</Text>
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
        <Button
          view="action"
          size="m"
          onClick={onLogin}
          loading={isLoading}
          className={"login-button"}
        >
          Login
        </Button>
        <br />
        <div className={"new-entry-block"}>
          <AddUserDialog></AddUserDialog>
        </div>
      </Card>
    </div>
  );
};
