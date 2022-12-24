import React from "react";
import { TUser } from "../definitions";
import { Card, User } from "@gravity-ui/uikit";

type TUserCardProps = Omit<TUser, "isAuthorized" | "isAdmin">;

export const UserCard: (props: TUserCardProps) => JSX.Element = (
  props: TUserCardProps
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
