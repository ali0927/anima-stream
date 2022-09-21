import React from "react";
import styles from "./characters.module.scss";
import classNames from "classnames";

export const Characters = () => {
  return (
    <div
      className={classNames(
        "full-height full-width flex column align-center justify-center",
        styles["characters"]
      )}
    ></div>
  );
};
