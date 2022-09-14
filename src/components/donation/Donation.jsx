import React, { useState, useContext } from "react";
import { ethers } from "ethers";
import { AuthContext } from "../../contexts";
import Header from "../common/Header";
import { useHistory } from "react-router-dom";
import * as firebaseService from "../../services/firebase";
import "./Donation.css";

const Donation = () => {
  const livestream = JSON.parse(localStorage.getItem("livestream"));
  const [showDonation, setShowDonation] = useState(false);
  const [openClothes, setOpenClothes] = useState(false);
  const [openLovense, setOpenLovense] = useState(false);
  const { user, setUser } = useContext(AuthContext);
  const history = useHistory();

  const handleTransaction = async (amount) => {
    try {
      if (user.balance < amount) {
        alert("Your balance is not enough!");
      }
      else {
        await firebaseService.update({
          key: "users",
          id: user.id,
          payload: {
            balance: user.balance - amount
          },
        });
        await firebaseService.update({
          key: "livestreams",
          id: livestream.id,
          payload: {
            balance: livestream.balance + amount
          },
        });
        livestream.balance = livestream.balance + amount;
        setUser({ ...user, balance: user.balance - amount });
        localStorage.setItem("livestream", JSON.stringify({ ...livestream, balance: livestream.balance + amount}));

        history.push("/livestream");
      }
    } catch (err) {
      console.log(err);
    }
  }

  const changeOpenLovense = () => {
    setOpenLovense(!openLovense);
    setOpenClothes(false);
  }

  const changeOpenClothes = () => {
    setOpenClothes(!openClothes);
    setOpenLovense(false);
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
          {user &&
            <div className="donation__dropdown">
              <button className="donation__button" onClick={() => setShowDonation(!showDonation)}>Donation</button>
              {showDonation &&
                <div className="donation__dropdown__menu">
                  <div className="donation__dropdown__menu__box">
                    <div 
                      className="donation__dropdown__menu__item" 
                      onClick={changeOpenLovense}
                    >
                      <span>Lovense </span>
                      <span>{`>`}</span>
                    </div>
                    <div 
                      className="donation__dropdown__menu__item" 
                      onClick={changeOpenClothes}
                    >
                      <span>Clothes </span>
                      <span>{`>`}</span>
                    </div>
                  </div>
                  {openLovense &&
                    <div className="donation__dropdown__menu__box donation__dropdown__menu__box__child">
                      <div className="donation__dropdown__menu__item" onClick={() => handleTransaction(1)}>{`1 second, 1 coin`}</div>
                      <div className="donation__dropdown__menu__item" onClick={() => handleTransaction(10)}>{`3 seconds, 10 coin`}</div>
                      <div className="donation__dropdown__menu__item" onClick={() => handleTransaction(100)}>{`5 seconds, 100 coins`}</div>
                      <div className="donation__dropdown__menu__item" onClick={() => handleTransaction(500)}>{`15 seconds, 500 coins`}</div>
                      <div className="donation__dropdown__menu__item" onClick={() => handleTransaction(1000)}>{`30 seconds, 1000 coins`}</div>
                      <div className="donation__dropdown__menu__item" onClick={() => handleTransaction(5000)}>{`Death from orgasm, 5000 coins`}</div>
                    </div>
                  }
                  {openClothes &&
                    <div className="donation__dropdown__menu__box donation__dropdown__menu__box__child">
                      <div className="donation__dropdown__menu__item" onClick={() => handleTransaction(500)}>{`Change clothes skin 50, 500 coins`}</div>
                      <div className="donation__dropdown__menu__item" onClick={() => handleTransaction(190)}>{`Remove clothes 10 seconds, 190 coins`}</div>
                      <div className="donation__dropdown__menu__item" onClick={() => handleTransaction(290)}>{`Remove clothes 30 seconds, 290 coins`}</div>
                      <div className="donation__dropdown__menu__item" onClick={() => handleTransaction(490)}>{`Remove clothes 60 seconds, 490 coins`}</div>
                    </div>
                  }
                </div>
              }
            </div>
          }
          {!user &&
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