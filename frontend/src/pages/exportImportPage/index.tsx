import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../root";
import { useNavigate } from "react-router-dom";

import { Button, Card, TableActionConfig, Text, TextInput } from "@gravity-ui/uikit";

import "./style.scss";

export const ExportImportPage = () => {
  const { currentUser } = useContext(UserContext);

  const [drag, setDrag] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
      if (!currentUser.isAuthorized) {
          navigate("/auth");
      }
  }, []);

    const downloadDb = () => {
        fetch(`http://localhost:5001/download`, {
            method: "GET",
        })
            .then((response) => response.blob())
            .then((blob) => {
                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", `db.json`);

                document.body.appendChild(link);

                link.click();
                link.parentNode!.removeChild(link);
            });
    };

    const uploadDb = () => {
        /*fetch(`http://localhost:5001/download`, {
            method: "GET",
        })
            .then((response) => response.blob())
            .then((blob) => {
                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", `db.json`);

                document.body.appendChild(link);

                link.click();
                link.parentNode!.removeChild(link);
            });*/
    };

    /*const sendInvitationCb = () => {
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
    };*/

    function dragStartHandler(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault()
        setDrag(true)
    }

    function dragLeaveHandler(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault()
        setDrag(false)
    }

    function onDropHandler(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault()

        console.log(event.dataTransfer.files)
        let file = event.dataTransfer.files[0]
        console.log(file)
    }

    return (
        <div className={"export/import-page"}>
            <Card view={"raised"} className={"companions-page-card"}>
                <Button
                    className={"download-button"}
                    view="action"
                    size={"s"}
                    onClick={function onClick() {
                        downloadDb();
                        }
                    }
                >
                    Download DB
                </Button>
                <div className={"app"}>
                    {drag
                        ? <div
                            className={"card-upload"}
                            onDragStart={event => dragStartHandler(event)}
                            onDragLeave={event => dragLeaveHandler(event)}
                            onDragOver={event => dragStartHandler(event)}
                            onDrop={event => onDropHandler(event)}
                        > Release the file </div>
                        : <div
                            className={"card-upload"}
                            onDragStart={event => dragStartHandler(event)}
                            onDragLeave={event => dragLeaveHandler(event)}
                            onDragOver={event => dragStartHandler(event)}
                        > Drag the file </div>
                    }
                </div>
            </Card>
        </div>
  );
};
