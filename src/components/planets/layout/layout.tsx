import React from "react";

/* assets */
import "../../../assets/backgrounds/background.png";
import classNames from "classnames";
import styles from "./layout.module.scss";
import { Header } from "./header/header";

export const Layout = ({
  children,
}: {
  children: React.ReactNode[] | React.ReactNode;
}) => {
  return (
    <div
      className={classNames(
        "full-height-norelative full-width-norelative flex column justify-space-between align-center overflow-hidden",
        styles.layout
      )}
    >
      <Header />
      {children}
    </div>
  );
};
