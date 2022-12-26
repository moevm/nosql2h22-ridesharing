import React, { useContext } from "react";
import { UserContext } from "../../root";
import { AddRideDialog } from "../../components/addRideDialog/addRideDialog";

import "./style.scss";

export const RidesPage = () => {
  const { currentUser } = useContext(UserContext);

  return (
    <div className={"rides-page"}>
      <div className={"create-ride-block"}>
        <AddRideDialog />
      </div>
    </div>
  );
};
