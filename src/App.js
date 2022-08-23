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

import { AuthContext, WalletContext } from "./contexts";

import "./index.css";

function App() {
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
            <PrivateRoute exact path="/" component={Home} />
            <PrivateRoute
              exact
              path="/create-livestream"
              component={CreateLiveStream}
            />
            <PrivateRoute
              exact
              path="/livestream-detail"
              component={LiveStreamDetail}
            />
            <Route exact path="/login">
              <Login />
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
