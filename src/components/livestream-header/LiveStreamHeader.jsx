/* eslint-disable */ // plz fix linting and remove this comment

import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../contexts";
import MetaMask from "../../assets/image/metamask.png";
import { ReactComponent as Logo } from "../../assets/icons/logo.svg";
import "./LiveStreamHeader.scss";
import { SvgIcon } from "../svgIcon/SvgIcon";

const LiveStreamHeader = ({ livestream }) => {
  const history = useHistory();
  const { user } = useContext(AuthContext);

  const stopLivestream = () => {
    history.push("/home");
  };

  return (
    <div className="liveStreamHeader">
      <div style={{ display: "flex", height: "100%" }}>
        <SvgIcon Icon={Logo} />
        <div className="liveStreamHeader__tab active">MAIN PAGE</div>
        <div className="liveStreamHeader__tab">MARKETPLACE</div>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <img src={MetaMask} className="liveStreamHeader__logo" alt="metamask" />
        <label className="liveStreamHeader__balance">{`${user.balance} sec`}</label>
      </div>
    </div>
  );
};

export default LiveStreamHeader;
