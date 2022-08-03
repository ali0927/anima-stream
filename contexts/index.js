import { useState, createContext, useContext } from "react";

export const WalletContext = createContext({
  signer: {},
  setSigner: () => {}
});
