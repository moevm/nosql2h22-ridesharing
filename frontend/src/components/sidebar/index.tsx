import { AsideHeader } from "@gravity-ui/navigation";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import "./style.scss";
import { UserContext } from "../../root";
import { useMutation } from "@apollo/client";
import { LOGOUT_USER } from "../../graphql/mutations/user";
import { MenuItem } from "@gravity-ui/navigation/build/esm/components/types";

export function AsideHeaderShowcase() {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [logoutUser] = useMutation(LOGOUT_USER);

  const [compact, setCompact] = useState(false);
  const [items, setItems] = useState<MenuItem[]>([]);

  const defaultItems = [
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
  ];

  const adminItems = [
    {
      id: "statistics",
      title: "Statistics",
      iconSize: 20,
      onItemClick: () => {
        navigate("/statistics");
      },
    },
  ];

  const navRef = useRef<AsideHeader>(null);

  useEffect(() => {
    let _items: MenuItem[] = [];
    if (currentUser.isAuthorized) {
      _items = defaultItems;
    }
    if (currentUser.isAdmin) {
      _items.unshift(...adminItems);
    }
    _items.push({
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
              setCurrentUser({
                username: "",
                id: "",
                isAuthorized: false,
                isAdmin: false,
              });
              navigate("/auth");
            }
          });
        } else {
          navigate("/auth");
        }
      },
    });
    setItems(_items);
  }, [currentUser]);

  return (
    <div>
      <AsideHeader
        ref={navRef}
        logo={{
          text: "Ridesharing",
          href: "#",
          onClick: () => {},
        }}
        menuItems={items}
        compact={compact}
        renderContent={() => {
          return (
            <div className={"outlet-page"}>
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
