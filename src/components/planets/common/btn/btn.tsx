import React, { MouseEventHandler } from "react";
import classNames from "classnames";
import styles from "./btn.module.scss";

export const Btn = ({
  children,
  onClick,
  disabled,
  className,
  rounded,
  iconSrc,
  stopPropagation,
}: {
  children?: any;
  onClick: MouseEventHandler;
  disabled?: boolean;
  className?: string;
  rounded?: boolean;
  iconSrc?: string;
  stopPropagation?: boolean;
}) => {
  return (
    <button
      onClick={(event) => {
        if (stopPropagation) {
          event.stopPropagation();
        }
        onClick(event);
      }}
      className={classNames(
        "flex column align-center justify-center",
        styles.btn,
        className,
        rounded && styles.rounded
      )}
      disabled={disabled}
    >
      {children}
      {iconSrc && (
        <img src={iconSrc} alt="" className={classNames(styles.icon)} />
      )}
    </button>
  );
};
