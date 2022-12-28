import { TRide } from "../../definitions";
import { Button } from "@gravity-ui/uikit";
import { ChangelogDialog } from "@gravity-ui/uikit/build/esm/components/ChangelogDialog";
import { useState } from "react";

export const RideStatusHistory = (props: { ride: TRide, open?: boolean }) => {
  const [visible, setVisible] = useState(props.open ?? false);

  return (
    <>
      <div>
        <Button
          view="normal"
          size={"s"}
          onClick={function onClick() {
            setVisible(true);
          }}
        >
          Status history
        </Button>
      </div>
      <ChangelogDialog
        title={props.ride.title}
        items={
          props.ride?.statusHistory?.map((entry) => {
            const [status, date] = entry.split(":");
            return {
              date: new Date(+date).toTimeString(),
              title: status,
              description: status,
            };
          }) ?? []
        }
        onClose={function onClose() {
          setVisible(!1);
        }}
        open={visible}
      />
    </>
  );
};

