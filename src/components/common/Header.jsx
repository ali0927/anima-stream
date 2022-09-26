/* eslint-disable */

import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import useWallet from "../../hooks/useWallet";
import { AuthContext, WalletContext } from "../../contexts";
import { shortAddr } from "../../lib/utils";
import { ethers } from "ethers";

const SignMessage = "Signin for Donation Demo";

const Header = () => {
  const { user, setUser, cometChat } = useContext(AuthContext);
  const onError = (error) => {
    alert(error)
  }
  const [ connectWallet ] = useWallet(onError);
  const { setSigner, signer, address, setAddress } = useContext(WalletContext);

  const history = useHistory();

  const logout = async () => {
    const isLogout = window.confirm("Do you want to log out ?");
    if (isLogout) {
      history.push("/");
      removeAuthedInfo();
      await cometChat.logout();
    }
  };

  const removeAuthedInfo = () => {
    localStorage.removeItem("auth");
    setUser(null);
  };

  const goRoute = (path) => () => {
    history.push(path);
  };

  const handleConnect = async () => {
    try {
      await connectWallet();
    } catch (err) {
      console.log(err)
    }
    try {
      if (!window.ethereum)
        throw new Error("No crypto wallet found. Please install it.");

      await window.ethereum.send("eth_requestAccounts");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const signature = await signer.signMessage(SignMessage);
      const address = await signer.getAddress();
      setAddress(address);
      const signerAddr = await ethers.utils.verifyMessage(SignMessage, signature);
      setSigner(signer);
      setAddress(address)
      alert(`Successful Signin by ${signerAddr}`);

      return {
        SignMessage,
        signature,
        address
      };
    } catch (err) {
      console.log(err)
      onError(err);
    }
  }

  if (!user) return <React.Fragment></React.Fragment>;

  return (
    <div className="header">
      <div className="header__left">
        <div className="header__option" onClick={goRoute("/home")}>
          Donation Demo
        </div>
        <img src={user.avatar} alt={user.fullname} />
        <span>{user.fullname}</span>
      </div>
      <div className="header__right">
        <div className="header__option" onClick={goRoute("/create-livestream")}>
          Create Livestream
        </div>
        <div
          className="header__option"
          onClick={address ? () => { } : handleConnect}
          >
          {address ? shortAddr(address) : `Connect Wallet`}
        </div>
        <div className="header__option">
          {`${user.balance} Sec`}
        </div>
        <div className="header__option" onClick={goRoute("/charge")}>
          Charge
        </div>
        <div className="header__option" onClick={logout}>
          Logout
        </div>
      </div>
    </div>
  );
};

export default Header;
