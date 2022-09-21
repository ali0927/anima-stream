import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import classNames from "classnames";
import { Layout } from "../layout/layout";
import { Btn } from "../common/btn/btn";
import { About } from "./about/about";
import { PlanetImage } from "../common/planet-image/planet-image";

import styles from "./planet.module.scss";

/* assets */
import personIcon from "../../../assets/icons/person.svg";
import planetIcon from "../../../assets/icons/planet.svg";
import { Characters } from "./characters/characters";

export const Planet = () => {
  const { title } = useParams() as { title: string };
  const { push } = useHistory();

  const [selectedTab, setSelectedTab] = useState("ABOUT");

  return (
    <Layout>
      <div
        className={classNames(
          "full-height full-width flex row align-center justify-space-between",
          styles.planet
        )}
      >
        <div
          className={classNames(
            "full-height flex column align-center justify-center",
            styles["content-container"]
          )}
        >
          <div
            className={classNames(
              "flex row align-center justify-flex-start full-width"
            )}
          >
            <Btn
              onClick={() => push("/planets")}
              className={classNames(styles["btn-back"])}
            ></Btn>
            <span className={classNames(styles["title"])}>
              {selectedTab === "ABOUT" ? `about ${title}` : "Characters"}
            </span>
          </div>

          {selectedTab === "ABOUT" && <About title={title} />}
          {selectedTab === "CHARACTERS" && <Characters />}

          <Btn
            onClick={() => {}}
            className={classNames("full-width", styles["btn-join"])}
          >
            join {title}
          </Btn>
        </div>

        <div
          className={classNames(
            "full-height full-width flex column justify-center align-center",
            styles["planet-widget"]
          )}
        >
          <PlanetImage
            title={title}
            showTitle={true}
            rotating={true}
            showOrbits={true}
            orbitalButtons={[
              {
                text: "about",
                iconSrc: planetIcon,
                onClick: () => setSelectedTab("ABOUT"),
                disabled: selectedTab === "ABOUT",
              },
              {
                text: "characters",
                iconSrc: personIcon,
                onClick: () => setSelectedTab("CHARACTERS"),
                disabled: selectedTab === "CHARACTERS",
              },
            ]}
          />
        </div>
      </div>
    </Layout>
  );
};