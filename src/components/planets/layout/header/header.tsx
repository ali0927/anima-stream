import React, { useContext } from "react";
import styles from "./header.module.scss";
import classNames from "classnames";
import { AuthContext, WalletContext } from "src/contexts";
import { useHistory } from "react-router-dom";

// assets
import MetaMask from "../../../../assets/image/metamask.png";
import { ReactComponent as Logo } from "../../../../assets/icons/logo.svg";
import { SvgIcon } from "../../../svgIcon/SvgIcon";
// import LogoIcon from "../../../svgIcon/logoIcon/logoIcon";

export const Header = () => {
  const { user } = useContext(AuthContext);
  const { signer } = useContext(WalletContext);
  const { push } = useHistory();

  return (
    <div className={classNames(styles["header"])}>
      <div className={classNames("full-height flex row align-center")}>
        <SvgIcon
          Icon={Logo}
          // style={{ margin: "auto 20px", width: "36px", height: "32px" }}
        />
        <div
          className={classNames(styles["tab"], styles["active"])}
          onClick={() => push("/planets")}
        >
          MAIN PAGE
        </div>
        <div className={classNames(styles["tab"])}>MARKETPLACE</div>
      </div>
      {user && signer && (
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
