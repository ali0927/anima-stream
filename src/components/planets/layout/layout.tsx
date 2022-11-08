import React from "react";

/* assets */
import "../../../assets/backgrounds/background_neatis.png";
import classNames from "classnames";
import styles from "./layout.module.scss";
import { Header } from "./header/header";
import { AdultsPopUp } from "../../popUp/popUps/AdultsPopUp";

export const Layout = ({
  children,
  secondBackground,
}: {
  children: React.ReactNode[] | React.ReactNode;
  secondBackground?: Boolean;
}) => {
  return (
    <div
      className={classNames(
        "full-height-norelative full-width-norelative flex column justify-start align-center overflow-hidden",
        secondBackground ? styles.layout2 : styles.layout
      )}
    >
      <Header />
      <div
        className={classNames(
          "full-height full-width flex column align-center justify-start",
          styles["content-container"]
        )}
      >
        {children}
      </div>
      <AdultsPopUp />
    </div>
  );
};
