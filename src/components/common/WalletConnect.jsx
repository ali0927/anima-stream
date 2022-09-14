import { useEffect, useContext } from "react";
import useWallet from "../../hooks/useWallet";
import { AuthContext, WalletContext } from "../../contexts";
import { useHistory } from "react-router-dom";
import { shortAddr } from "../../lib/utils";
import { ethers } from "ethers";

const SignMessage = "Signin for Donation Demo";

const WalletConnect = () => {
  const onError = (error) => {
    alert(error)
  }
  const [provider, chain, signer, address, connectWallet] = useWallet(onError);

  const { cometChat, setUser } = useContext(AuthContext);
  const { setSigner, setAddress } = useContext(WalletContext);

  const history = useHistory();

  // useEffect(() => {
  //   const authedUser = JSON.parse(localStorage.getItem("auth"));
  //   if (authedUser) {
  //     history.push("/home");
  //   } else {
  //     setUser(null);
  //   }
  // }, [history, setUser]);

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
      setAddress(address);
      alert(`Successful Signin by ${signerAddr}`);
      history.push("/home");
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
    <div style={{padding: "40px", width: "300px",  margin: "auto"}}>
      <button className="login__submit-btn" onClick={() => handleConnect()}>
          Connect Wallet
        </button>
    </div>
 )   
}

export default WalletConnect;