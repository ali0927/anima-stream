import styles from "./PopUp.module.scss";
import cn from "classnames";
import React, { useEffect, useState } from "react";

export const PopUp = ({
  openModal,
  children,
}: {
  openModal: boolean;
  children: React.ReactNode[] | React.ReactNode;
}) => {
  return (
    <div className={cn(styles.overlay, { [styles.hidden]: !openModal })}>
      <div className={styles.modalContainer}>{children}</div>
    </div>
  );
};
