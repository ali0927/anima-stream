import React, { useState, useContext } from "react";
import { ethers } from "ethers";
import { WalletContext } from "../../contexts";
import { Streamers } from "../../lib/dummy";

const Donation = (props) => {
  const { streamerId } = props;
  const streamer = Streamers[streamerId];
  const [showDonation, setShowDonation] = useState(false);
  const [openCallToAction, setOpenCallToAction] = useState(false);
  const { signer } = useContext(WalletContext);
  const onError = (error) => {
    alert("ERROR!")
  }

  const handleTransaction = async (amount) => {
    try {
      const tx = {
        to: streamer.wallet,
        value: ethers.utils.parseEther(amount.toString())
      }
      await signer.sendTransaction(tx);
    } catch (err) {
      console.log(err)
    }
  }

  return (
      <div className="flex flex-col items-center mt-40 space-y-8">
        {streamer &&
        <div className="space-y-4">
          <h1 className="text-2xl">{streamer.title}</h1>
          <div className="flex flex-col">
            <span>{`Steramer: ${streamer.name}`}</span>
            <span>{`Description: ${streamer.description}`}</span>
          </div>
        </div>
        }
        <div className="relative">
          {signer &&
            <div className="relative">
              <button className="p-2 border" onClick={() => setShowDonation(!showDonation)}>Donation</button>
              {showDonation &&
                <div className="absolute flex space-x-1">
                  <div className="border rounded-lg mt-1 transition-all duration-100 w-max">
                    <div 
                      className="flex justify-between p-2 cursor-pointer hover:bg-slate-200" 
                      onClick={() => setOpenCallToAction(!openCallToAction)}
                    >
                      <span>call-to-action</span>
                      <span>{`>`}</span>
                    </div>
                    <div className="p-2 cursor-pointer hover:bg-slate-200">iot</div>
                    <div className="p-2 cursor-pointer hover:bg-slate-200">{`AR(1st sprint manually)`}</div>
                  </div>
                  {openCallToAction &&
                    <div className="border rounded-lg mt-1 transition-all duration-100 w-max">
                      <div className="p-2 cursor-pointer hover:bg-slate-200" onClick={() => handleTransaction(0.1)}>{`Action1 (10 tokens)`}</div>
                      <div className="p-2 cursor-pointer hover:bg-slate-200" onClick={() => handleTransaction(1)}>{`Action2 (100 tokens)`}</div>
                      <div className="p-2 cursor-pointer hover:bg-slate-200" onClick={() => handleTransaction(1.5)}>{`Action3 (150 tokens)`}</div>
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
  );
};

export default Donation;