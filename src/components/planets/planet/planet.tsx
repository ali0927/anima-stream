import React, { useContext, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import classNames from "classnames";
import { Layout } from "../layout/layout";
import { Btn } from "../common/btn/btn";
import { About } from "./about/about";
import { PlanetImage } from "../common/planet-image/planet-image";
import MetaMask from "../../../assets/image/metamask.png";

import styles from "./planet.module.scss";

/* assets */
import personIcon from "../../../assets/icons/person.svg";
import planetIcon from "../../../assets/icons/planet.svg";
import { Characters } from "./characters/characters";
import { LoginModal } from "../common/login-modal/login-modal";
import { AuthContext, WalletContext } from "src/contexts";

export const Planet = () => {
  const [isLoginModalOpened, setIsLoginModalOpened] = useState(false);
  const { title } = useParams() as { title: string };
  const { push } = useHistory();
  const { user } = useContext(AuthContext);
  const { signer } = useContext(WalletContext);

  const [selectedTab, setSelectedTab] = useState("ABOUT");

  return (
    <Layout>
      <div
        className={classNames(
          "full-height full-width flex row align-center justify-space-between",
          styles.planet
        )}
      >
        <div className={classNames(styles["header"])}>
          <div className={classNames("full-height flex row align-center")}>
            <div className={classNames(styles["tab"], styles["active"])}>
              MAIN PAGE
            </div>
            <div className={classNames(styles["tab"])}>MARKETPLACE</div>
          </div>
          {signer && (
            <div className={classNames("flex align-center")}>
              <img
                src={MetaMask}
                className={classNames(styles["logo"])}
                alt="metamask"
              />
              <label className="liveStreamHeader__balance">
                {`${user.balance * 10} sec`}
              </label>
            </div>
          )}
        </div>
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
              join {title}
            </Btn>
          )}
          {signer && (
            <Btn
              onClick={() => push("/home")}
              className={classNames("full-width", styles["btn-join"])}
            >
              join livestream
            </Btn>
          )}
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

      {isLoginModalOpened && (
        <LoginModal onCloseBtnPress={() => setIsLoginModalOpened(false)} />
      )}
    </Layout>
  );
};
