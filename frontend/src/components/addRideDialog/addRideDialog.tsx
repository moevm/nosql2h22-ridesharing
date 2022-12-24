import { Button, Dialog, TextInput, useToaster } from "@gravity-ui/uikit";
import React, { useContext, useEffect, useState } from "react";
import { TRide } from "../../definitions";
import { UserContext } from "../../root";
import { useNavigate } from "react-router-dom";
import { CREATE_RIDE } from "../../graphql/mutations/ride";
import { useMutation } from "@apollo/client";

const initialFormState = {
  id: "",
  date: "",
  from: "",
  maxPassengers: 0,
  price: 0,
  title: "",
  to: "",
}


export const AddRideDialog: React.FC = () => {
  const { add } = useToaster();

  const { currentUser } = useContext(UserContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser.isAuthorized) {
      navigate("/auth");
    }
  }, []);

  const [open, setOpen] = useState(false);
  const [rideForm, setRideForm] = useState<TRide>(initialFormState);

  const [newRide] = useMutation(CREATE_RIDE);

  const createRide = () => {
    console.log(rideForm);
    newRide({
      variables: {
        input: {
          title: rideForm.title,
          date: rideForm.date,
          from: rideForm.from,
          to: rideForm.to,
          price: rideForm.price,
          maxPassengers: rideForm.maxPassengers,
          username: currentUser.username,
        },
      },
    }).then(({ data }) => {
      if (data.createRide) {
        setOpen(false);
        setRideForm(initialFormState);
      }
    });
  };

  return (
    <div className="add-user-dialog">
      <Button
        className={"add-user-dialog-button"}
        width={"max"}
        view="action"
        size="m"
        onClick={function onClick() {
          return setOpen(!0);
        }}
      >
        Create new ride
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
          caption="Create new ride dialog"
          id="app-confirmation-dialog-title"
        />
        <Dialog.Body>
          <TextInput
            className={"text-input"}
            onUpdate={(newValue) =>
              setRideForm({ ...rideForm, title: newValue })
            }
            value={rideForm.title}
            placeholder="title"
          />
          <TextInput
            className={"text-input"}
            onUpdate={(newValue) =>
              setRideForm({ ...rideForm, date: newValue })
            }
            type={"date"}
            value={rideForm.date}
            placeholder="date"
          />
          <TextInput
            className={"text-input"}
            onUpdate={(newValue) =>
              setRideForm({ ...rideForm, from: newValue })
            }
            value={rideForm.from}
            placeholder="from"
          />
          <TextInput
            className={"text-input"}
            onUpdate={(newValue) => setRideForm({ ...rideForm, to: newValue })}
            value={rideForm.to}
            placeholder="to"
          />
          <TextInput
            className={"text-input"}
            onUpdate={(newValue) =>
              setRideForm({ ...rideForm, price: parseInt(newValue) })
            }
            type={"number"}
            value={rideForm.price.toString()}
            placeholder="price"
          />
          <TextInput
            className={"text-input"}
            onUpdate={(newValue) =>
              setRideForm({ ...rideForm, maxPassengers: parseInt(newValue) })
            }
            type={"number"}
            value={rideForm.maxPassengers.toString()}
            placeholder="max passengers"
          />
        </Dialog.Body>
        <Dialog.Footer
          onClickButtonApply={function onClickButtonApply() {
            createRide();
          }}
          onClickButtonCancel={function onClickButtonCancel() {
            return setOpen(!1);
          }}
          textButtonApply="Create"
          textButtonCancel="Cancel"
        />
      </Dialog>
    </div>
  );
};
