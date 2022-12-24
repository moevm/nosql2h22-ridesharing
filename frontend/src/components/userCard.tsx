import React from "react";
import { TUser } from "../definitions";
import { Card, User } from "@gravity-ui/uikit";

export const UserCard: (props: Omit<TUser, "isAuthorized">) => JSX.Element = (
  props: Omit<TUser, "isAuthorized">
) => {
  return (
    <Card className="card-stories">
      <User
        description={props.id}
        imgUrl="https://cataas.com/cat"
        name={props.username}
      />
    </Card>
  );
};
