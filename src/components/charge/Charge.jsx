/* eslint-disable */

import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { ethers } from "ethers";
import Header from "../common/Header";
import { AuthContext, WalletContext } from "../../contexts";
import * as firebaseService from "../../services/firebase";
import * as uiService from "../../services/ui";

const Charge = () => {
  const [amount, setAmount] = useState(0);
  const history = useHistory();
  const { user, setUser } = useContext(AuthContext);
  const { signer } = useContext(WalletContext);

  const purchase = async () => {
    try {
      uiService.showLoading();
      const tx = {
        to: "0x0902CB364E49101F4ab5D4fFDE5035973e728D3F",
        value: ethers.utils.parseEther(amount.toString())
      }
      await signer.sendTransaction(tx);

      await firebaseService.update({
        key: "users",
        id: user.id,
        payload: {
          balance: user.balance + amount * 10
        },
      });

      setAmount(0);
      setUser({...user, balance: user.balance + amount * 10});
      uiService.alert(`Your balance was charged successfully`);
    } catch (error) {
      uiService.alert(`Failure to charge your balance, please try again`);
    }
    uiService.hideLoading();
  };

  useEffect(() => {
    if (!user) history.push("/login");
  }, [user]);

  if (!user) return <></>

  return (
    <React.Fragment>
      <Header />
      <div className="create-livestream">
        <div className="create-livestream__content">
          <div className="create-livestream__container">
            <div className="create-livestream__title">Charge Your Balance by Crypto</div>
          </div>
          <div className="create-livestream__form">
            <div className="create-livestream__info">
              <label>Current Balance : </label>
              <label>{`$${user.balance}`}</label>
            </div>
            <div className="create-livestream__info">
              <label>1 USDT = 10 Seconds </label>
              <label>{`You will get $${amount}`}</label>
            </div>
            <input
              type="number"
              placeholder="Input Amount"
              step={0.01}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <button
              className="create-livestream__btn"
              onClick={purchase}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Charge;
