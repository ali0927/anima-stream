import React from "react";
import classNames from "classnames";
import styles from "./about.module.scss";
import { MarketplaceWidget } from "./marketplace-widget/marketplace-widget";

export const About = ({ title }: { title: string }) => {
  console.log("Title:", title);
  return (
    <div
      className={classNames(
        "full-height full-width flex column align-center justify-start",
        styles.about
      )}
    >
      <div
        className={classNames(
          "flex row align-center justify-start full-width",
          styles["info-blocks-row"]
        )}
      >
        <div className={classNames("flex column", styles["info-block"])}>
          <span className={styles["title"]}>location</span>
          <span className={styles["content"]}>
            The Canis Major Dwarf Galaxy
          </span>
        </div>
        <div className={classNames("flex column", styles["info-block"])}>
          <span className={styles.title}>population</span>
          <span className={styles.content}>20M</span>
        </div>
      </div>
      <span className={classNames(styles["description-block"])}>
        Nexus was founded as a first interstellar haven, bringing together
        species and races from all over the universe. This planet has became a
        second home for those, searching for a better life. Offering equal
        opportunities to every new citizen it has quickly became a widely
        discussed point of attraction, where anyone can satisfy his most darest
        fantasies.
      </span>
      <MarketplaceWidget />
    </div>
  );
};
