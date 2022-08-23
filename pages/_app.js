import React, { useState, useMemo, useEffect } from "react";
import { WalletContext, AuthContext } from '../contexts';
import "@fortawesome/fontawesome-svg-core/styles.css"; // import Font Awesome CSS
import { config } from "@fortawesome/fontawesome-svg-core";
import '../styles/globals.scss';

config.autoAddCss = false;

function MyApp({ Component, pageProps }) {
  const [signer, setSigner] = useState();
  const [user, setUser] = useState(null);
  const [cometChat, setCometChat] = useState(null);

  const wallet = useMemo(
    () => ({ signer, setSigner }), 
    [signer]
  );

  const auth = {
    user,
    setUser,
    cometChat,
    setCometChat,
  }

  const initAuthUser = () => {
    const authenticatedUser = localStorage.getItem("auth");
    if (authenticatedUser) {
      setUser(JSON.parse(authenticatedUser));
    }
  };

  const initCometChat = async () => {
    const { CometChat } = await import("@cometchat-pro/chat");
    const appID = `${process.env.NEXT_PUBLIC_COMETCHAT_APP_ID}`;
    const region = `${process.env.NEXT_PUBLIC_COMETCHAT_REGION}`;
    const appSetting = new CometChat.AppSettingsBuilder()
      .subscribePresenceForAllUsers()
      .setRegion(region)
      .build();
    CometChat.init(appID, appSetting).then(
      () => {
        setCometChat(() => CometChat);
      },
      (error) => {}
    );
  };

  useEffect(() => {
    initAuthUser();
    initCometChat();
  }, []);

  return (
    <WalletContext.Provider value={wallet}>
      <AuthContext.Provider value={auth}>
        <Component {...pageProps} />
      </AuthContext.Provider>
    </WalletContext.Provider>
  )
}

export default MyApp