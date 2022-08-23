import React, { useState, useContext } from "react";
import { ethers } from "ethers";
import { WalletContext } from "../../contexts";
import Header from "../common/Header";
import { useHistory } from "react-router-dom";
import "./Donation.css";

const Donation = () => {
  const livestream = JSON.parse(localStorage.getItem("livestream"));
  const [showDonation, setShowDonation] = useState(false);
  const [openCallToAction, setOpenCallToAction] = useState(false);
  const { signer } = useContext(WalletContext);
  const onError = (error) => {
    alert("ERROR!")
  }

  const history = useHistory();

  const handleTransaction = async (amount) => {
    try {
      const tx = {
        to: "0x0902CB364E49101F4ab5D4fFDE5035973e728D3F",
        value: ethers.utils.parseEther(amount.toString())
      }
      await signer.sendTransaction(tx);
    } catch (err) {
      console.log(err)
    }
    history.push("/livestream");
  }

  return (
    <React.Fragment>
      <Header />
      <div className="donation">
        {livestream &&
        <div className="donation__streamInfo">
          <h1 className="text-2xl">{livestream.name}</h1>
          <div className="donation__streamInfo__detail">
            <label>{`Steramer: ${livestream.date}`}</label>
            <label>{`Description: ${livestream.description}`}</label>
          </div>
        </div>
        }
        <div className="donation__dropdown">
          {signer &&
            <div className="donation__dropdown">
              <button className="donation__button" onClick={() => setShowDonation(!showDonation)}>Donation</button>
              {showDonation &&
                <div className="donation__dropdown__menu">
                  <div className="donation__dropdown__menu__box">
                    <div 
                      className="donation__dropdown__menu__item" 
                      onClick={() => setOpenCallToAction(!openCallToAction)}
                    >
                      <span>call-to-action</span>
                      <span>{`>`}</span>
                    </div>
                    <div className="donation__dropdown__menu__item">iot</div>
                    <div className="donation__dropdown__menu__item">{`AR(1st sprint manually)`}</div>
                  </div>
                  {openCallToAction &&
                    <div className="donation__dropdown__menu__box donation__dropdown__menu__box__child">
                      <div className="donation__dropdown__menu__item" onClick={() => handleTransaction(0.1)}>{`Action1 (10 tokens)`}</div>
                      <div className="donation__dropdown__menu__item" onClick={() => handleTransaction(1)}>{`Action2 (100 tokens)`}</div>
                      <div className="donation__dropdown__menu__item" onClick={() => handleTransaction(1.5)}>{`Action3 (150 tokens)`}</div>
                    </div>
                  }
                </div>
              }
            </div>
          }
          {!signer &&
            <label className="text-xl text-red-500">
              Connect your wallet to participate in Donation
            </label>
          }
        </div>
      </div>
    </React.Fragment>
  );
};

export default Donation;