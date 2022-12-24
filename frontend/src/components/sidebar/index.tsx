import { AsideHeader } from "@gravity-ui/navigation";
import React, { useContext, useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import "./style.scss";
import { UserContext } from "../../root";
import { useMutation } from "@apollo/client";
import { LOGOUT_USER } from "../../graphql/mutations/user";

export function AsideHeaderShowcase() {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [logoutUser] = useMutation(LOGOUT_USER);

  const [compact, setCompact] = useState(false);

  const navRef = useRef<AsideHeader>(null);

  const items = [
    {
      id: "statistics",
      title: "Statistics",
      iconSize: 20,
      onItemClick: () => {
        navigate("/statistics");
      },
    },
    {
      id: "profile",
      title: "Profile",
      iconSize: 20,
      onItemClick: () => {
        navigate("/profile");
      },
    },
    {
      id: "rides",
      title: "Rides",
      iconSize: 20,
      onItemClick: () => {
        navigate("/rides");
      },
    },
    {
      id: "companions",
      title: "Companions",
      iconSize: 20,
      onItemClick: () => {
        navigate("/companions");
      },
    },
    {
      id: "auth",
      title: currentUser.isAuthorized ? "Logout" : "Login",
      iconSize: 20,
      onItemClick: () => {
        if (currentUser.isAuthorized) {
          logoutUser({
            variables: {
              input: {
                username: currentUser.username,
              },
            },
          }).then(({ data }) => {
            if (data.logoutUser) {
              setCurrentUser({ username: "", id: "", isAuthorized: false });
              navigate("/auth");
            }
          });
          // todo run mutation logout
        } else {
          navigate("/auth");
        }
      },
    },
  ];

  return (
    <div>
      <AsideHeader
        ref={navRef}
        logo={{
          text: "Ridesharing",
          href: "#",
          onClick: () => {},
        }}
        menuItems={currentUser.isAuthorized ? items : [items[items.length - 1]]}
        compact={compact}
        renderContent={() => {
          return (
            <div>
              <Outlet />
            </div>
          );
        }}
        onClosePanel={() => {}}
        onChangeCompact={setCompact}
      />
    </div>
  );
}
