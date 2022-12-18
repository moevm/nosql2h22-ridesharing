import { AsideHeader } from "@gravity-ui/navigation";
import React, { useRef, useState } from "react";

import block from "bem-cn-lite";
import { Outlet, useNavigate } from "react-router-dom";

import "./style.scss";

const b = block("aside-header-showcase");

enum Panel {
  ProjectSettings = "projectSettings",
  Search = "search",
  UserSettings = "userSettings",
}

export function AsideHeaderShowcase() {
  const navigate = useNavigate();

  const [popupVisible, setPopupVisible] = useState(false);
  const [visiblePanel, setVisiblePanel] = useState<Panel>();
  const [compact, setCompact] = useState(false);

  const navRef = useRef<AsideHeader>(null);

  return (
    <div>
      <AsideHeader
        ref={navRef}
        logo={{
          text: "Ridesharing",
          href: "#",
          onClick: () => alert("click on logo"),
        }}
        menuItems={[
          {
            id: "statistics",
            title: "Statistics",
            iconSize: 20,
            onItemClick: () => {
              navigate('/statistics')
            }
          },
          {
            id: "auth",
            title: "Login",
            iconSize: 20,
            onItemClick: () => {
              navigate('/auth')
            }
          },
        ]}
        compact={compact}
        renderContent={() => {
          return (
            <div>
              <Outlet />
            </div>
          );
        }}
        onClosePanel={() => setVisiblePanel(undefined)}
        onChangeCompact={setCompact}
      />
    </div>
  );
}
