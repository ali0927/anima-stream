import React, { useContext } from "react";
import styles from "./header.module.scss";
import classNames from "classnames";
import { AuthContext, WalletContext } from "src/contexts";

// assets
import MetaMask from "../../../../assets/image/metamask.png";

export const Header = () => {
  const { user } = useContext(AuthContext);
  const { signer } = useContext(WalletContext);
  return (
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
            {`${user.balance} sec`}
          </label>
        </div>
      )}
    </div>
  );
};
