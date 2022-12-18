import React from "react";
import { TUser } from "../definitions";
import { User, Card } from "@gravity-ui/uikit";


export const UserCard: (props: TUser) => JSX.Element = (props: TUser) => {
  return (
    <Card className="card-stories">
      <User
        description={props.id}
        imgUrl="https://cataas.com/cat"
        name={props.username}
      />
    </Card>
  )
}