import { PopUp } from "../PopUp";
import styles from "./PopUps.module.scss";
import React, { useEffect, useState } from "react";
import cn from "classnames";

export const AdultsPopUp = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (
      window.sessionStorage.getItem("isAdult") &&
      JSON.parse(window.sessionStorage.getItem("isAdult"))
    )
      return setIsModalOpen(false);
    else setIsModalOpen(true);
  }, []);

  const handleClick = (isAdult: boolean) => {
    setIsModalOpen(false);
    if (isAdult) window.sessionStorage.setItem("isAdult", JSON.stringify(true));
    else window.sessionStorage.setItem("isAdult", JSON.stringify(false));
  };

  return (
    <PopUp openModal={isModalOpen}>
      <div className={styles.adultsModal}>
        <div className={styles.adultsModalHeader}>
          <h3>Adults only</h3>
          <span className={styles.adultsModalBadge}>18+</span>
        </div>
        <div className={styles.modalBody}>
          <p>
            This site contents adult material. You might be at least 18 years
            pld to view this content. Are you 18 and willing to see adult
            content?
          </p>
        </div>
        <div className={styles.modalFooter}>
          <button className={cn(styles.btn)} onClick={() => handleClick(false)}>
            no, i’m younger
          </button>
          <button
            className={cn(styles.btn, styles.btnFilled)}
            onClick={() => handleClick(true)}
          >
            Yes, i’m 18 years old
          </button>
        </div>
      </div>
    </PopUp>
  );
};
