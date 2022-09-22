import React, { useContext, useState } from "react";
import styles from "./login-modal.module.scss";
import classNames from "classnames";
import { Btn } from "../btn/btn";
import useWallet from "../../../../hooks/useWallet";
import { ethers } from "ethers";
import { WalletContext } from "../../../../contexts";
export const LoginModal = ({
  onCloseBtnPress,
}: {
  onCloseBtnPress: () => void;
}) => {
  const [isWeb3ModalOpened, setIsWeb3ModalOpened] = useState(false);

  const SignMessage = "Signin for Donation Demo";

  const onError = (error) => {
    alert(error);
  };
  const [, , , , connectWallet] = useWallet(onError);

  const { setSigner, setAddress } = useContext(WalletContext);

  const onLoginBtnPress = async () => {
    try {
      setIsWeb3ModalOpened(true);
      await connectWallet();
      if (!window.ethereum)
        throw new Error("No crypto wallet found. Please install it.");

      await window.ethereum.send("eth_requestAccounts");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const signature = await signer.signMessage(SignMessage);
      const address = await signer.getAddress();
      const signerAddr = ethers.utils.verifyMessage(SignMessage, signature);
      setSigner(signer);
      setAddress(address);
      alert(`Successful Signin by ${signerAddr}`);
      onCloseBtnPress();
      return {
        SignMessage,
        signature,
        address,
      };
    } catch (err) {
      console.log(err);
      onError(err);
    } finally {
      setIsWeb3ModalOpened(false);
    }
  };

  return (
    <div
      className={classNames(
        "full-height-norelative full-width-norelative flex column align-center justify-center",
        styles["overlay"],
        { [styles["hidden"]]: isWeb3ModalOpened }
      )}
    >
      <div
        className={classNames(
          "flex column align-start justify-space-between",
          styles["modal"]
        )}
      >
        <div
          className={classNames(
            "full-width flex row align-center justify-space-between",
            styles["header"]
          )}
        >
          <span className={classNames(styles["title"])}>log in</span>
          <Btn
            onClick={onCloseBtnPress}
            className={classNames(styles["btn-close"])}
          >
            ×
          </Btn>
        </div>
        <div className={classNames("full-width", styles["content"])}>
          <Btn
            className={classNames("full-width", styles["btn-login"])}
            onClick={onLoginBtnPress}
          >
            join with metamask
          </Btn>
        </div>
      </div>
    </div>
  );
};
