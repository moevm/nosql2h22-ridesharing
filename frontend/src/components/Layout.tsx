import React from "react";
import { AsideHeaderShowcase } from "./sidebar";

import "./sidebar/style.scss";

export const Layout = () => {
  return (
    <div className={"layout"}>
      <AsideHeaderShowcase></AsideHeaderShowcase>
    </div>
  );
};