import React, { useContext, useState, useEffect } from "react";
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
import { LoginModal } from "../common/login-modal/login-modal";
import { WalletContext } from "src/contexts";

export const Planet = () => {
  const [isLoginModalOpened, setIsLoginModalOpened] = useState(false);
  const { title } = useParams() as { title: string };
  const { push } = useHistory();
  const { signer } = useContext(WalletContext);

  const [selectedTab, setSelectedTab] = useState("ABOUT");

  useEffect(() => {
    setSelectedTab("ABOUT");
    document.title = "Nexus | ANIMA | 18+ Metaverse";
  }, []);

  return (
    <Layout secondBackground={true}>
      <div
        className={classNames(
          "full-height full-width flex row align-start justify-space-between",
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
          {!signer && (
            <Btn
              onClick={() => setIsLoginModalOpened(true)}
              className={classNames("full-width", styles["btn-join"])}
            >
              connect wallet
            </Btn>
          )}
          {signer && (
            <Btn
              onClick={() => push(`/planets/${title}/rooms`)}
              className={classNames("full-width", styles["btn-join"])}
            >
              join {title}
            </Btn>
          )}
        </div>

        <div
          className={classNames(
            "full-height full-width flex column justify-start align-center",
            styles["planet-widget"]
          )}
        >
          <PlanetImage
            title={title}
            showTitle={true}
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
            rotating={false}
            showOrbits={false}
          />
        </div>
      </div>

      {isLoginModalOpened && (
        <LoginModal onCloseBtnPress={() => setIsLoginModalOpened(false)} />
      )}
    </Layout>
  );
};
