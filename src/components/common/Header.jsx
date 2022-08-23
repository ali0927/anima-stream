import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import useWallet from "../../hooks/useWallet";
import { AuthContext, WalletContext } from "../../contexts";
import { shortAddr } from "../../lib/utils";
import { ethers } from "ethers";

const SignMessage = "Signin for Donation Demo";

const Header = () => {
  const { user, setUser, cometChat } = useContext(AuthContext);
  const onError = (error) => {
    alert("ERROR!")
  }
  const [provider, chain, signer, address, connectWallet] = useWallet(onError);
  const { setSigner } = useContext(WalletContext);

  const history = useHistory();

  const logout = async () => {
    const isLogout = window.confirm("Do you want to log out ?");
    if (isLogout) {
      await cometChat.logout();
      removeAuthedInfo();
      goRoute("/login")();
    }
  };

  const removeAuthedInfo = () => {
    setUser(null);
    localStorage.removeItem("auth");
  };

  const goRoute = (path) => () => {
    history.push(path);
  };

  const handleConnect = async () => {
    try {
      await connectWallet();
      if (!window.ethereum)
        throw new Error("No crypto wallet found. Please install it.");

      await window.ethereum.send("eth_requestAccounts");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const signature = await signer.signMessage(SignMessage);
      const address = await signer.getAddress();
      const signerAddr = await ethers.utils.verifyMessage(SignMessage, signature);
      setSigner(signer);
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
        <div className="header__option" onClick={goRoute("/")}>
          Donation Demo
        </div>
        <img src={user.image} alt={user.fullname} />
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
        <div className="header__option" onClick={logout}>
          Logout
        </div>
      </div>
    </div>
  );
};

export default Header;
