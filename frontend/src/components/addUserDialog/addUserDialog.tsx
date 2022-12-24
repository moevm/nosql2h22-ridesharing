import { Button, Dialog, TextInput, useToaster } from "@gravity-ui/uikit";
import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_USER } from "../../graphql/mutations/user";

export const AddUserDialog: React.FC = () => {
  const { add } = useToaster();

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
      if (data.createUser.error) {
        add({
          name: "Error",
          title: "Failed to create user",
          content: data.createUser.error.errorMessage,
          type: "error",
          allowAutoHiding: true,
          timeout: 5000,
        });
      } else {
        setUsername("");
        setPassword("");
        setOpen(false);
        add({
          name: "user created",
          title: "User created",
          type: "success",
          allowAutoHiding: true,
          timeout: 5000,
        });
      }
    });
  };

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
            className={"text-input"}
            onUpdate={setUsername}
            value={username}
            placeholder="username"
          />
          <TextInput
            className={"text-input"}
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