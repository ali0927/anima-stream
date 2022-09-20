/* eslint-disable */

import React, { useEffect, useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { WalletContext } from "../../contexts";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { signer } = useContext(WalletContext);

  return (
    <Route
      {...rest}
      render={(props) =>
        localStorage.getItem("auth")  ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

export default PrivateRoute;
