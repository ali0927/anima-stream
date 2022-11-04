import React from "react";
import classNames from "classnames";
import { Btn } from "../../common/btn/btn";
import { useHistory } from "react-router-dom";
import styles from "./planet-carousel-item.module.scss";

// assets
// arrows
import arrowRight from "../../../../assets/icons/arrows/right.svg";
import arrowLeft from "../../../../assets/icons/arrows/left.svg";
import { PlanetImage } from "../../common/planet-image/planet-image";

export const PlanetCarouselItem = ({
  title,
  isActive,
}: {
  title: string;
  isActive: boolean;
}) => {
  const { push } = useHistory();

  return (
    <div className={classNames(styles.planet, !isActive && styles.inactive)}>
      <PlanetImage
        title={title}
        showTitle={isActive}
        className={classNames(styles["planet-image"])}
        rotating={false}
      />

      {/* planet controls overlay */}
      <div
        className={classNames(
          "flex column align-center justify-space-between full-width",
          styles["controls-overlay"]
        )}
      >
        <div
          className={classNames(
            "flex row justify-space-between align-center full-width"
          )}
        >
          <Btn
            onClick={() => {}}
            className={classNames(styles.btn, styles.arrow)}
            disabled={true}
            iconSrc={arrowLeft}
          />

          <Btn
            onClick={() => {}}
            className={classNames(styles.btn, styles.arrow)}
            disabled={true}
            iconSrc={arrowRight}
          />
        </div>
        <div
          className={classNames(
            styles["explore-popup"],
            "flex",
            "column",
            "align-center",
            "justify-space-between"
          )}
        >
          <span className={styles["description"]}>
            Neatis was founded as a first interstellar haven, bringing together
            species and races from all over the universe
          </span>
          <Btn
            onClick={() => push(`/planets/${title}`)}
            className={classNames(styles.btn, "full-width")}
          >
            Explore {title}
          </Btn>
        </div>
      </div>
    </div>
  );
};
