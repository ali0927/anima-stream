import React, { useState } from "react";
import styles from "./rooms.module.scss";
import { Layout } from "../../layout/layout";
import classNames from "classnames";
import { useHistory, useParams } from "react-router-dom";
import { Btn } from "../../common/btn/btn";

// assets

// room cover images
import luinelImage from "../../../../assets/rooms/luinel.png";
import irel2Image from "../../../../assets/rooms/irel2.png";
import alvinImage from "../../../../assets/rooms/alvin.png";
import alvin2Image from "../../../../assets/rooms/alvin2.png";
import lunielImage from "../../../../assets/rooms/luniel.png";
import miuImage from "../../../../assets/rooms/miu.png";

// icons
import lightningIcon from "../../../../assets/icons/lightning.png";

export const Rooms = () => {
  const [rooms] = useState([
    {
      title: "LUINEL",
      image: luinelImage,
      premiumAccessIsRequired: false,
      isLive: true,
      id: "5b56256b-3aa9-4d43-912a-21c545b2f6cf",
    },
    {
      title: "Alvin",
      image: alvinImage,
      premiumAccessIsRequired: false,
      isLive: true,
      id: "3f5b706c-d810-4182-8164-1f1b4a67289c",
    },
    {
      title: "Miu",
      image: miuImage,
      premiumAccessIsRequired: true,
      isLive: true,
    },
    {
      title: "Luniel",
      image: lunielImage,
      premiumAccessIsRequired: true,
      isLive: true,
    },
    {
      title: "Irel2",
      image: irel2Image,
      premiumAccessIsRequired: true,
      isLive: true,
    },
    {
      title: "Alvin2",
      image: alvin2Image,
      premiumAccessIsRequired: true,
      isLive: true,
    },
  ]);

  const [accessRestrictedPopUpOnRoomWidget, setAccessRestrictedPopUpOnRoom] =
    useState(null);

  const { title } = useParams() as { title: string };
  const { push } = useHistory();
  return (
    <Layout>
      <div
        className={classNames(
          "full-width full-height flex column justify-start",
          styles["rooms"]
        )}
      >
        <div
          className={classNames(
            "full-width flex row align-center justify-space-between",
            styles["header"]
          )}
        >
          <div className={classNames("full-height flex row align-center")}>
            <Btn
              onClick={() => {
                push(`/planets/${title}`);
              }}
              className={classNames(styles["btn-back"])}
            />
            <span className={classNames(styles["title"])}>{title}</span>
          </div>
          <div className={classNames("flex row align-start", styles["tabs"])}>
            <div
              className={classNames(
                "flex row align-center",
                styles["tab"],
                styles["tab-active"]
              )}
            >
              <span className={classNames(styles["tab-title"])}>rooms</span>
            </div>

            <div
              className={classNames(
                "flex row align-center",
                styles["tab"],
                styles["tab-disabled"]
              )}
            >
              {" "}
              <span className={classNames(styles["tab-title"])}>metaverse</span>
              <img
                className={classNames(styles["tab-icon"])}
                src={lightningIcon}
                alt={"icon"}
              />
            </div>
          </div>
        </div>

        <div
          className={classNames(
            "full-width flex row wrap align-start justify-flex-start",
            styles["room-widgets-list"]
          )}
        >
          {rooms.map((room, index) => (
            <section
              key={room.title + index}
              className={classNames(
                "flex column align-start justify-space-between",
                styles["room-widget"]
              )}
              onClick={() => {
                setAccessRestrictedPopUpOnRoom(null);

                if (room.premiumAccessIsRequired) {
                  setAccessRestrictedPopUpOnRoom(room);
                  return;
                }

                if (room.id) push(`/livestream/${room.id}`);
              }}
            >
              <div className={classNames(styles["image-wrapper"])}>
                <img
                  className={classNames(
                    "full-width full-height",
                    styles["image"]
                  )}
                  src={room.image}
                  alt={"room"}
                />
                <i className={classNames(styles["corner-dot"])} />
                <i className={classNames(styles["corner-dot"])} />
                <i className={classNames(styles["corner-dot"])} />
                <i className={classNames(styles["corner-dot"])} />
                {room.isLive && (
                  <span
                    className={classNames(
                      "flex align-center justify-center",
                      styles["live-label"]
                    )}
                  >
                    live
                  </span>
                )}
              </div>
              <div
                className={classNames(
                  "full-width flex row align-center justify-start"
                )}
              >
                <span className={classNames(styles["room-widget-title"])}>
                  {room.title}
                </span>
                {room.premiumAccessIsRequired && (
                  <div className={classNames(styles["room-widget-lock-icon"])}>
                    {accessRestrictedPopUpOnRoomWidget === room && (
                      <div
                        className={classNames(
                          "flex column justify-space-between",
                          styles["access-restricted-popup"]
                        )}
                      >
                        Metaverse available only for premium members
                        <Btn
                          stopPropagation={true}
                          onClick={() => {
                            setAccessRestrictedPopUpOnRoom(null);
                          }}
                          className={classNames(
                            "full-width",
                            styles["upgrade-btn"]
                          )}
                        >
                          upgrade for premium
                        </Btn>
                        <i className={classNames(styles["arrow-bottom"])} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>
      </div>
    </Layout>
  );
};
