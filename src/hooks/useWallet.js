/* eslint-disable */

import { ethers } from "ethers";
import { useEffect, useState, useContext } from "react";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";
import { v4 as uuidv4 } from "uuid";

import * as cometChatService from "../services/cometchat";
import { AuthContext } from "../contexts";
import { shortAddr } from "../lib/utils";
import * as firebaseService from "../services/firebase";
import firebase from "firebase";
import {CometChat} from '@cometchat-pro/chat';

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: "cbeb3c15311a4fa6b7f374c92e07c524",
    },
  },
};

export default function useWallet(onError) {
  const [web3Provider, setWeb3Provider] = useState();
  const [provider, setProvider] = useState();
  const [chain, setChain] = useState();
  const [signer, setSigner] = useState();
  const [address, setAddress] = useState();

  const { cometChat, setUser } = useContext(AuthContext);

  async function connectWallet(overrideProviderOptions) {
    if (!provider) {
      const web3Modal = new Web3Modal({
        providerOptions: overrideProviderOptions || providerOptions,
      });
      await web3Modal
        .connect()
        .then((p) => {
          setWeb3Provider(p);
          const _provider = new ethers.providers.Web3Provider(p);
          setProvider(_provider);
          _provider.getNetwork().then(({ chainId }) => setChain(chainId));
          _provider.listAccounts().then((addresses) => {
            if (addresses.length > 0) {
              setAddress(addresses[0]);
              setSigner(_provider.getSigner());
              registerCometChat(addresses[0]);
            }
          });
        })
        .catch((error) => {
          onError({
            title: "Error connecting to wallet",
            message: "Please try again.",
          });
          console.log(error);
        });
    }
  }

  function onAccountsChanged(addresses) {
    if (addresses.length > 0) {
      setAddress(addresses[0]);
      setSigner(provider?.getSigner());
    }
  }

  async function registerCometChat(address) {
    let user = await firebaseService.getSingleDataWithQuery({
      key: "users",
      query: "address",
      criteria: address,
    });
    if (user) {
      await cometChatService.login(cometChat, user);
    } else {
      const userId = uuidv4();
      await firebaseService.insert({
        key: "users",
        id: userId,
        payload: {
          id: userId,
          fullname: shortAddr(address),
          address: address,
          balance: 0,
          avatar:
            "https://gravatar.com/avatar/50d165d7326d3526ffd409b694a63ada?s=400&d=mp&r=x",
        },
      });

      user = await firebaseService.getSingleDataWithQuery({
        key: "users",
        query: "address",
        criteria: address,
      });

      await cometChatService.createAccount({
        cometChat,
        id: userId,
        fullname: shortAddr(address),
        avatar:
          "https://gravatar.com/avatar/50d165d7326d3526ffd409b694a63ada?s=400&d=mp&r=x",
      });
    }
    setUser(user);
    await cometChatService.login(cometChat, user);

    // console.log('2. Received FCM Token');

    // const messaging = firebase.messaging();
    // FCM_TOKEN = await messaging.getToken();
    // console.log('2. Received FCM Token', FCM_TOKEN);

    // // Register the FCM Token
    // await CometChat.registerTokenForPushNotification(FCM_TOKEN);
    // console.log('3. Registered FCM Token');

  }

  useEffect(() => {
    if (web3Provider) {
      const _provider = new ethers.providers.Web3Provider(web3Provider);
      setProvider(_provider);
      _provider.getNetwork().then(({ chainId }) => setChain(chainId));
      _provider.listAccounts().then((addresses) => {
        if (addresses.length > 0) {
          setAddress(addresses[0]);
          setSigner(_provider.getSigner());
          registerCometChat(addresses[0]);
        }
      });
      web3Provider.on("chainChanged", () => {
        window.location.reload();
      });
      web3Provider.on("accountsChanged", onAccountsChanged);
      return () => {
        web3Provider.removeAllListeners("chainChanged");
        web3Provider.removeAllListeners("accountsChanged");
      };
    }
  }, [web3Provider]);

  return [provider, chain, signer, address, connectWallet];
}
