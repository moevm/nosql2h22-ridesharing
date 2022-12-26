import { GET_ALL_USERS, GET_ALL_USERS_COUNT } from "../../graphql/queries/user";
import React, { useContext, useEffect } from "react";
import { UserContext } from "../../root";
import { useNavigate } from "react-router-dom";
import { AllEntitiesTable } from "../statisticPage/components/allEntitiesTable";
import { TUser } from "../../definitions";
import { TableActionConfig } from "@gravity-ui/uikit";
import { RideInvitationDialog } from "../../components/rideInvitationDialog";

export const CompanionsPage = () => {
  const { currentUser } = useContext(UserContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser.isAuthorized) {
      navigate("/auth");
    }
  }, []);

  const setupTableActions = (item: TUser): TableActionConfig<TUser>[] => {
    // if (!props.withActions) return [];
    if (item.username) {
      return [
        // {
        //   text: "Invite in ride",
        //   handler: function handler() {
        //     // deleteRideCb(item.id);
        //   },
        // },
      ];
    } else return [];
  };

  return (
    <AllEntitiesTable
      graphQlMethod={GET_ALL_USERS}
      graphQlCountMethod={GET_ALL_USERS_COUNT}
      extractMethod={"getAllUsers"}
      extractCountMethod={"getAllUsersCount"}
      setupTableActions={setupTableActions}
      columns={[
        {
          id: "username",
          name: "Username",
        },
        {
          id: "id",
          name: "Id",
        },
        {
          id: "action",
          name: "Action",
          template: (item) => {
            return <RideInvitationDialog userId={item.id} />;
          },
        },
      ]}
    ></AllEntitiesTable>
  );
};
