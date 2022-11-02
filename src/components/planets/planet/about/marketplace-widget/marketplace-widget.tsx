/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useContext } from "react";
import { ethers } from "ethers";
import styles from "./marketplace-widget.module.scss";
import { AuthContext, WalletContext } from "src/contexts";
import * as firebaseService from "src/services/firebase";
import * as uiService from "src/services/ui";
import TUSDT from "src/lib/TUSDT.json";
import classNames from "classnames";
import { Btn } from "../../../common/btn/btn";

/* assets */
import AniTimeCoin1 from "../../../../../assets/items/anima_timecoin_01.mp4";
import AniTimeCoin2 from "../../../../../assets/items/anima_timecoin_02.mp4";
import AniTimeCoin3 from "../../../../../assets/items/anima_timecoin_03.mp4";

const listedItems = [
  {
    imageUrl: AniTimeCoin1,
    title: "50 seconds",
    price: 5,
  },
  {
    imageUrl: AniTimeCoin2,
    title: "100 seconds",
    price: 10,
  },
  {
    imageUrl: AniTimeCoin3,
    title: "200 seconds",
    price: 20,
  },
  {
    imageUrl: AniTimeCoin1,
    title: "500 seconds",
    price: 50,
  },
  {
    imageUrl: AniTimeCoin2,
    title: "1000 seconds",
    price: 100,
  },
];

export const MarketplaceWidget = () => {
  const { user, setUser } = useContext(AuthContext);
  const { signer } = useContext(WalletContext);

  const purchase = async (amount) => {
    if (!signer) {
      uiService.alert(`You need to connect wallet!`);
      return;
    }
    uiService.showLoading();
    try {
      const TUSDTContract = new ethers.Contract(
        TUSDT.address,
        TUSDT.abi,
        signer
      );

      const tx = await TUSDTContract.transfer(
        "0x0902CB364E49101F4ab5D4fFDE5035973e728D3F",
        ethers.utils.parseEther(amount.toString())
      );

      await tx.wait();

      await firebaseService.update({
        key: "users",
        id: user.id,
        payload: {
          balance: user.balance + amount * 10,
        },
      });
      setUser({ ...user, balance: user.balance + amount * 10 });
    } catch (error) {
      console.log(error);
      uiService.alert(`Failure to charge your balance, please try again`);
    }
    uiService.hideLoading();
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

              {/* <img
                className={classNames(styles["image"])}
                src={item.imageUrl}
                alt={item.title}
              /> */}
              <div
                className={classNames(
                  "full-width full-height flex justify-center"
                )}
              >
                <video
                  className={classNames(styles["video"])}
                  autoPlay={true}
                  loop={true}
                >
                  <source src={item.imageUrl} type="video/mp4" />
                </video>
              </div>

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
