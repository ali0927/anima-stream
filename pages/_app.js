import { useState, useMemo } from "react";
import Appbar from '../components/Appbar';
import { WalletContext } from '../contexts';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const [signer, setSigner] = useState();
  const val = useMemo(
    () => ({ signer, setSigner }), 
    [signer]
  );

  return (
    <WalletContext.Provider value={val}>
    <div className="container mx-auto my-10">
      <Appbar />
      <Component {...pageProps} />
    </div>
    </WalletContext.Provider>
  )
}

export default MyApp
