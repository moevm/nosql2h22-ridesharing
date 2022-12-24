import React, { useContext } from "react";
import { UserContext } from "../../root";
import { AddRideDialog } from "../../components/addRideDialog/addRideDialog";

export const RidesPage = () => {
  const { currentUser } = useContext(UserContext);

  return (
    <div className={"rides-page"}>
      <AddRideDialog />
    </div>
  );
};
