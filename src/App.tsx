/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import { initializeApp } from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  User,
} from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

import { useWallet } from "@solana/wallet-adapter-react";
import {
  WalletConnectButton,
  WalletDisconnectButton,
  WalletModalButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";

import React from "react";
import Modal from "./components/ui/Modal";
import { Buffer } from "buffer";

import "@solana/wallet-adapter-react-ui/styles.css";
import TransactionForm from "./components/TransactionForm";
import TransactionsView from "./components/TransactionsView";

function App() {
  const { publicKey } = useWallet();
  //fix buffer dependency issue
  window.Buffer = window.Buffer || Buffer;

  React.useEffect(() => {
    console.log("publicKey", publicKey);
  }, [publicKey]);

  return (
    <>
      {publicKey ? (
        <div css={appCss.container}>
          <div css={appCss.navBar}>
            <p>new page</p>
            <WalletMultiButton />
          </div>
          <TransactionForm />
          <div css={appCss.transactions}>transactions</div>
          <TransactionsView />
        </div>
      ) : (
        <div css={appCss.homeContainer}>
          <div css={appCss.homeHeader}>My Sol Transactions</div>
          <section>
            <p>Welcome. please connect a wallet to begin:</p>
            <div>
              <WalletMultiButton />
            </div>
          </section>
        </div>
      )}
    </>
  );
}

export default App;

const appCss = {
  homeContainer: css({
    width: "100%",
    height: "100%",
    backgroundColor: "darkslategray",
    display: "grid",
    placeContent: "center",
  }),
  homeHeader: css({
    fontSize: "3rem",
    fontWeight: 700,
    color: "yellow",
  }),
  container: css({
    width: "100%",
    height: "100%",
    backgroundColor: "darkslategray",
    display: "block",
  }),
  navBar: css({
    width: "100%",
    height: "20%",
  }),
  transactions: css({
    background: "lightGray",
    color: "black",
  }),
};
