import React, { useContext } from "react";
import Link from 'next/link'
import { shortAddr } from "../lib/utils";
import useWallet from "../hooks/useWallet";
import { WalletContext } from "../contexts";
import { ethers } from "ethers";
import { useRouter } from 'next/router';
import { AuthContext } from "../contexts";

const SignMessage = "Signin for Donation Demo";

const Appbar = () => {
  const { user, setUser, cometChat } = useContext(AuthContext);

  const onError = (error) => {
    alert("ERROR!")
  }
  const [provider, chain, signer, address, connectWallet] = useWallet(onError);
  const { setSigner } = useContext(WalletContext);
  const router = useRouter();

  const logout = async () => {
    const isLogout = window.confirm("Do you want to log out ?");
    if (isLogout) {
      await cometChat.logout();
      setUser(null);
      localStorage.removeItem("auth");
      router.push('/login');
    }
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
    <div className="flex justify-between">
      <h1 className="text-3xl font-bold">Donation Demo</h1>
      <div className="flex space-x-4 items-center">
        <img src={user.image} className="w-10 h-10 rounded-full" alt={user.fullname} />
        <span><strong>{user.fullname}</strong></span>
        <Link href={`/create-livestream`}>
          <button className="p-2 border">
            Create Livestream
          </button>
        </Link>
        <button
          className="p-2 border"
          onClick={address ? () => { } : handleConnect}
          >
          {address ? shortAddr(address) : `Connect Wallet`}
        </button>
        <button className="p-2 border" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  )
}

export default Appbar;