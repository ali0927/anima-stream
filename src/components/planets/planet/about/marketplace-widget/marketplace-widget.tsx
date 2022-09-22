import React from "react";
import styles from "./marketplace-widget.module.scss";
import classNames from "classnames";
import { Btn } from "../../../common/btn/btn";

/* assets */

import batteryImage from "../../../../../assets/items/battery.png";

const listedItems = [
  {
    imageUrl: batteryImage,
    title: "50 tokens",
    price: "5 USDT",
  },
  {
    imageUrl: batteryImage,
    title: "100 tokens",
    price: "10 USDT",
  },
  {
    imageUrl: batteryImage,
    title: "200 tokens",
    price: "20 USDT",
  },
  {
    imageUrl: batteryImage,
    title: "500 tokens",
    price: "50 USDT",
  },
  {
    imageUrl: batteryImage,
    title: "1000 tokens",
    price: "100 USDT",
  },
];

export const MarketplaceWidget = () => {
  return (
    <div
      className={classNames(
        "full-width flex column justify-space-between align-start",
        styles["marketplace-widget"]
      )}
    >
      <div
        className={classNames(
          "full-width flex row align-center justify-start",
          styles["header"]
        )}
      >
        <span className={classNames(styles["title"])}>Marketplace</span>
        <Btn className={classNames(styles["info-btn"])} onClick={() => {}}>
          i
        </Btn>
      </div>
      <div
        className={classNames(
          "full-width flex row justify-start overflow-hidden",
          styles["carousel"]
        )}
      >
        {listedItems.map((item, index) => {
          return (
            <div
              className={classNames(
                "full-height flex column align-start justify-space-between",
                styles["carousel-item"]
              )}
              key={item.title + index}
            >
              <div
                className={classNames(
                  "full-height full-width",
                  styles["carousel-item-overlay"]
                )}
              >
                <div className={classNames(styles["dot"])} />
                <div className={classNames(styles["dot"])} />
                <div className={classNames(styles["dot"])} />
                <div className={classNames(styles["dot"])} />
              </div>

              <img
                className={classNames(styles["image"])}
                src={item.imageUrl}
                alt={item.title}
              />

              <span className={classNames(styles["title"])}>{item.title}</span>

              <span className={classNames("full-width", styles["spacer"])} />

              <span className={classNames(styles["price"])}>{item.price}</span>
            </div>
          );
        })}

        <div
          className={classNames("full-height full-width", styles["overlay"])}
        />
      </div>
    </div>
  );
};
