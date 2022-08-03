import { useContext } from "react";
import { shortAddr } from "../lib/utils";
import useWallet from "../hooks/useWallet";
import { WalletContext } from "../contexts";
import { ethers } from "ethers";

const SignMessage = "Signin for Donation Demo";

const Appbar = () => {
  const onError = (error) => {
    alert("ERROR!")
  }
  const [provider, chain, signer, address, connectWallet] = useWallet(onError);
  const { setSigner } = useContext(WalletContext);

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

  return (
    <div className="flex justify-between">
      <h1 className="text-3xl font-bold">Donation Demo</h1>
      <button
        className="p-2 border"
        onClick={address ? () => { } : handleConnect}
      >
        {address ? shortAddr(address) : `Connect Wallet`}
      </button>
    </div>
  )
}

export default Appbar;