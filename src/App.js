import React, { useState, useEffect, useMemo } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import CreateLiveStream from "./components/create-livestream/CreateLiveStream";
import Home from "./components/home/Home";
import LiveStreamDetail from "./components/livestream-detail/LiveStreamDetail";
import Loading from "./components/common/Loading";
import Donation from "./components/donation/Donation";
import WalletConnect from "./components/common/WalletConnect";
import Charge from "./components/charge/Charge";
import { AuthContext, WalletContext } from "./contexts";
import { PlanetsCarousel } from "./components/planets/planets-carousel/planets-carousel";
import { Planet } from "./components/planets/planet/planet";

import "@fontsource/inter";
import "./index.scss";
import "./global.scss";
import { Rooms } from "./components/planets/planet/rooms/rooms";

function App() {
  const authenticatedUser = localStorage.getItem("auth");
  const walletSigner = localStorage.getItem("signer");

  const [signer, setSigner] = useState(walletSigner ? walletSigner : null);
  const [address, setAddress] = useState(null);
  const [user, setUser] = useState(
    authenticatedUser ? JSON.parse(authenticatedUser) : null
  );
  const [cometChat, setCometChat] = useState(null);

  const wallet = useMemo(
    () => ({ signer, setSigner, address, setAddress }),
    [signer, address]
  );

  const auth = {
    user,
    setUser,
    cometChat,
    setCometChat,
  };

  const initCometChat = async () => {
    const { CometChat } = await import("@cometchat-pro/chat");
    const appID = `${process.env.REACT_APP_COMETCHAT_APP_ID}`;
    const region = `${process.env.REACT_APP_COMETCHAT_REGION}`;
    const appSetting = new CometChat.AppSettingsBuilder()
      .subscribePresenceForAllUsers()
      .setRegion(region)
      .build();
    CometChat.init(appID, appSetting).then(
      () => {
        setCometChat(() => CometChat);
      },
      () => {}
    );
  };

  useEffect(() => {
    initCometChat();
  }, []);

  useEffect(() => {
    localStorage.setItem("auth", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem("signer", signer);
  }, [signer]);

  return (
    <AuthContext.Provider value={auth}>
      <WalletContext.Provider value={wallet}>
        <Router>
          <Switch>
            <Route exact path="/home" component={Home} />
            <Route
              exact
              path="/create-livestream"
              component={CreateLiveStream}
            />
            <Route exact path="/livestream/:id" component={LiveStreamDetail} />
            <Route exact path="/donation" component={Donation} />
            <Route exact path="/charge" component={Charge} />
            <Route exact path="/planets" component={PlanetsCarousel} />
            <Route exact path={"/planets/:title"} component={Planet} />
            <Route exact path={"/planets/:title/rooms"} component={Rooms} />

            <Route exact path="/login">
              <WalletConnect />
            </Route>
            <Route exact path="*">
              <Redirect to="/planets" />
            </Route>
          </Switch>
        </Router>
        <Loading />
      </WalletContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;
