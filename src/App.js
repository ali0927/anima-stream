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
import Login from "./components/login/Login";
import PrivateRoute from "./components/common/PrivateRoute";
import Donation from "./components/donation/Donation";
import WalletConnect from "./components/common/WalletConnect";
import Charge from "./components/charge/Charge";

import { AuthContext, WalletContext } from "./contexts";

import "./index.css";

function App() {
  const [signer, setSigner] = useState();
  const [address, setAddress] = useState();
  const [user, setUser] = useState(null);
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

  const initAuthUser = () => {
    const authenticatedUser = localStorage.getItem("auth");
    if (authenticatedUser) {
      setUser(JSON.parse(authenticatedUser));
    }
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
      (error) => {}
    );
  };

  useEffect(() => {
    initAuthUser();
    initCometChat();
  }, []);

  return (
    <AuthContext.Provider value={auth}>
      <WalletContext.Provider value={wallet}>
        <Router>
          <Switch>
            <Route exact path="/">
              <WalletConnect />
            </Route>
            <Route exact path="/home" component={Home} />
            <Route
              exact
              path="/create-livestream"
              component={CreateLiveStream}
            />
            <Route exact path="/livestream" component={LiveStreamDetail} />
            <Route exact path="/donation" component={Donation} />
            <Route exact path="/charge" component={Charge} />
            <Route exact path="/login">
              <WalletConnect />
            </Route>
            <Route exact path="*">
              <Redirect to="/" />
            </Route>
          </Switch>
        </Router>
        <Loading />
      </WalletContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;
