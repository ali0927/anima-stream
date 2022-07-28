import React, { useState } from "react";
import { ethers } from "ethers";
import useWallet from "../../hooks/useWallet";

const SignMessage = "Signin for Donation Demo";

const Donation = () => {
  const [connected, setConnected] = useState(false);
  const [showDonation, setShowDonation] = useState(false);
  const onError = (error) => {
    alert("ERROR!")
  }
  const [provider, chain, signer, address, connectWallet] = useWallet(onError);
  const shortAddr = (addr) => {
    return `${addr.toString().slice(0, 5)}...${addr.toString().slice(-5)}`;
  }

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
      alert(`Successful Signin by ${signerAddr}`);
      setConnected(true);

      return {
        SignMessage,
        signature,
        address
      };
    } catch (err) {
      onError(err);
    }
  }

  return (
    <div className="container mx-auto my-10">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Donation Demo</h1>
        <button
          className="p-2 border"
          onClick={address ? () => { } : handleConnect}
        >
          {address ? shortAddr(address) : `Connect Wallet`}
        </button>
      </div>
      <div className="relative flex flex-col items-center mt-56">
        <div>
          {connected &&
            <div className="relative">
              <button className="p-2 border" onClick={() => setShowDonation(!showDonation)}>Donation</button>
              {showDonation &&
                <div className="absolute border rounded-lg mt-1 transition-all duration-100 w-max">
                  <div className="p-2 cursor-pointer hover:bg-slate-200">call-to-action</div>
                  <div className="p-2 cursor-pointer hover:bg-slate-200">iot</div>
                  <div className="p-2 cursor-pointer hover:bg-slate-200">{`AR(ast sprint manually)`}</div>
                </div>
              }
            </div>
          }
          {!connected &&
            <label className="text-xl text-red-500">
              Connect your wallet to participate in Donation
            </label>
          }
        </div>

      </div>
    </div>
  );
};

export default Donation;
