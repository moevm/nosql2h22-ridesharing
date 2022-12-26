import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../root";
import { useMutation, useQuery } from "@apollo/client";
import { GET_USER_RIDES } from "../../graphql/queries/user";
import { Button, Dialog, Select, useToaster } from "@gravity-ui/uikit";
import { TRide, TRideWithRelationComplex } from "../../definitions";

import "./style.scss";
import { SEND_RIDE_INVITATION } from "../../graphql/mutations/ride";

export const RideInvitationDialog = (props: { userId: string }) => {
  const { currentUser } = useContext(UserContext);
  const { add } = useToaster();

  const [open, setOpen] = useState(false);
  const [selectValue, setSelectValue] = React.useState<string[]>([]);

  const [rides, setRides] = useState<TRide[]>([]);

  const { data, loading, error, refetch } = useQuery(GET_USER_RIDES, {
    variables: {
      pagenumber: 0,
      username: currentUser.username,
    },
  });

  const [sendRideInvitation] = useMutation(SEND_RIDE_INVITATION);

  const sendInvitationCb = () => {
    sendRideInvitation({
      variables: {
        input: {
          userId: props.userId,
          rideId: selectValue[0],
        },
      },
    })
      .then((response) => {
        add({
          name: "invitation sent",
          title: "Invitation sent",
          type: "success",
          allowAutoHiding: true,
          timeout: 5000,
        });
      })
      .catch((error) => {
        add({
          name: "fail",
          title: "Failed to send",
          type: "error",
          allowAutoHiding: true,
          timeout: 5000,
        });
      });
  };

  useEffect(() => {
    if (!loading && data) {
      const rides = data.getUserRides.map(
        (entry: TRideWithRelationComplex) => entry.ride
      );
      setRides(rides);
    }
  }, [loading, data]);

  return (
    <div className="add-user-dialog">
      <Button
        className={"add-user-dialog-button"}
        width={"max"}
        view="normal"
        size="m"
        onClick={function onClick() {
          return setOpen(!0);
        }}
      >
        Add user to your ride
      </Button>
      <Dialog
        aria-labelledby="app-confirmation-dialog-title"
        open={open}
        onClose={function onClose() {
          return setOpen(!1);
        }}
        onEnterKeyDown={function onEnterKeyDown() {
          alert("onEnterKeyDown");
        }}
      >
        <Dialog.Header
          caption="Invite user to your ride"
          id="app-confirmation-dialog-title"
        />
        <Dialog.Body>
          <Select
            className={"ride-selector"}
            value={selectValue}
            placeholder="Values"
            options={rides.map((ride) => ({
              value: ride.id,
              content: `${ride.title}  ${ride.date} from ${ride.from} to ${ride.to}`,
            }))}
            onUpdate={(nextValue) => setSelectValue(nextValue)}
          />
        </Dialog.Body>
        <Dialog.Footer
          onClickButtonApply={function onClickButtonApply() {
            sendInvitationCb();
          }}
          onClickButtonCancel={function onClickButtonCancel() {
            return setOpen(!1);
          }}
          textButtonApply="Invite"
          textButtonCancel="Cancel"
        />
      </Dialog>
    </div>
  );
};
