import { Button, Dialog, TextInput } from "@gravity-ui/uikit";
import React, { useState } from "react";
import { CREATE_USER } from "../graphql/mutations/user";
import { useMutation } from "@apollo/client";

export const AddUserDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [newUser] = useMutation(CREATE_USER);

  const addUser = () => {
    newUser({
      variables: {
        input: {
          username,
          password,
        },
      },
    }).then(({ data }) => {
      console.log(data);
      setUsername("");
      setPassword("");
      setOpen(false);
    });
  };

  return (
    <div className="category-container">
      <Button
        onClick={function onClick() {
          return setOpen(!0);
        }}
        view="normal"
      >
        Create new account
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
          caption="Create new account dialog"
          id="app-confirmation-dialog-title"
        />
        <Dialog.Body>
          <TextInput
            onUpdate={setUsername}
            value={username}
            placeholder="username"
          />
          <TextInput
            onUpdate={setPassword}
            value={password}
            placeholder="password"
          />
        </Dialog.Body>
        <Dialog.Footer
          onClickButtonApply={function onClickButtonApply() {
            addUser();
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
