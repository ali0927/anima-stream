import React from "react";
import classNames from "classnames";
import styles from "./btn.module.scss";

export const Btn = ({
  children,
  onClick,
  disabled,
  className,
  rounded,
  iconSrc,
}: {
  children?: any;
  onClick: () => any;
  disabled?: boolean;
  className?: string;
  rounded?: boolean;
  iconSrc?: string;
}) => {
  return (
    <button
      onClick={onClick}
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
