import React from "react";
import classNames from "classnames";
import styles from "./planet-image.module.scss";

// assets
// planet images
import Anima from "../../../../assets/planets/anima.png";
import Nexus from "../../../../assets/planets/nexus.png";
import Sataru from "../../../../assets/planets/sataru.png";
import { Btn } from "../btn/btn";

const planetImages = {
  Anima,
  Nexus,
  Sataru,
};

export type OrbitButton = {
  onClick: () => any;
  disabled?: boolean;
  text: string;
  iconSrc: string;
};

export const PlanetImage = ({
  title,
  className = "",
  rotating = false,
  showTitle = false,
  showOrbits = false,
  orbitalButtons,
  activeImage,
}: {
  title: string;
  showTitle?: boolean;
  className?: string;
  rotating?: boolean;
  showOrbits?: boolean;
  orbitalButtons?: OrbitButton[];
  activeImage?: boolean;
}) => {
  return (
    <div
      className={classNames(
        "flex column align-center justify-center",
        styles["planet-image"],
        className,
        rotating && styles["rotating"],
        showTitle && styles["with-title"]
      )}
    >
      {/* basic planet data: title & image */}
      {showTitle && <span className={classNames(styles.title)}>{title}</span>}
      <div className={classNames(styles["image-wrapper"])}>
        <img
          className={classNames(styles["image"], {
            [styles.active]: activeImage,
          })}
          src={planetImages[title]}
          alt={title}
        />

        {showOrbits && (
          <>
            <div
              className={classNames(styles["orbit"], styles["circle"])}
            ></div>
            <div
              className={classNames(styles["orbit"], styles["horizontal"])}
            ></div>
            <div
              className={classNames(
                styles["orbit"],
                styles["horizontal"],
                styles["left-part"]
              )}
            ></div>
            <div
              className={classNames(
                styles["orbit"],
                styles["horizontal"],
                styles["central-part"]
              )}
            ></div>
            <div
              className={classNames(
                styles["orbit"],
                styles["horizontal"],
                styles["right-part"]
              )}
            ></div>
          </>
        )}

        {orbitalButtons &&
          orbitalButtons.map((btn, index) => (
            <section
              className={classNames(
                "flex column align-center",
                styles["orbital-button-container"]
              )}
              key={btn.text + index}
            >
              <Btn
                className={classNames(styles["orbital-button"])}
                onClick={btn.onClick}
                disabled={btn.disabled}
              >
                <img
                  src={btn.iconSrc}
                  alt={btn.text}
                  className={classNames(styles["orbital-button-icon"])}
                />
              </Btn>
              <span className={classNames(styles["orbital-button-text"])}>
                {btn.text}
              </span>
            </section>
          ))}
      </div>
    </div>
  );
};
