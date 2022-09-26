/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useContext } from "react";
import { ethers } from "ethers";
import styles from "./marketplace-widget.module.scss";
import { AuthContext, WalletContext } from "src/contexts";
import * as firebaseService from "src/services/firebase";
import classNames from "classnames";
import { Btn } from "../../../common/btn/btn";

/* assets */

import batteryImage from "../../../../../assets/items/battery.png";

const listedItems = [
  {
    imageUrl: batteryImage,
    title: "50 seconds",
    price: 5,
  },
  {
    imageUrl: batteryImage,
    title: "100 seconds",
    price: 10,
  },
  {
    imageUrl: batteryImage,
    title: "200 seconds",
    price: 20,
  },
  {
    imageUrl: batteryImage,
    title: "500 seconds",
    price: 50,
  },
  {
    imageUrl: batteryImage,
    title: "1000 seconds",
    price: 100,
  },
];

export const MarketplaceWidget = () => {
  const { user, setUser } = useContext(AuthContext);
  const { signer } = useContext(WalletContext);

  const purchase = async (amount) => {
    if (!signer) return;
    try {
      const tx = {
        to: "0x0902CB364E49101F4ab5D4fFDE5035973e728D3F",
        value: ethers.utils.parseEther(amount.toString()),
      };

      await signer.sendTransaction(tx);

      await firebaseService.update({
        key: "users",
        id: user.id,
        payload: {
          balance: user.balance + amount,
        },
      });
      setUser({ ...user, balance: user.balance + amount });
    } catch (error) {
      alert("Not Enough Balance!");
    }
  };

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
              onClick={() => purchase(item.price)}
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

              <span className={classNames(styles["price"])}>
                {item.price} USDT
              </span>
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
