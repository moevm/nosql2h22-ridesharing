import React from "react";
import { TUser } from "../../definitions";
import { Card, Label, Text, User } from "@gravity-ui/uikit";

import "./style.scss"

type TUserCardProps = Omit<TUser, "isAuthorized" | "isAdmin">;

export const UserCard: (props: TUser) => JSX.Element = (
  props: TUser
) => {
  return (
    <Card  theme={"info"} className={"user-card"}>
      <Label style={"rounded"}>  Username: </Label> <Text> {props.username} </Text>
    </Card>
  );
};
