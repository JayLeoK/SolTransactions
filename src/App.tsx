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
        <div css={styles.appContainer}>
          <div css={styles.navBar}>
            <div css={styles.navBarTitle}>My Sol Transactions</div>
            <WalletMultiButton />
          </div>
          <div css={styles.formWrapper}>
            <TransactionForm />
          </div>

          <TransactionsView />
        </div>
      ) : (
        <div css={styles.homeContainer}>
          <div css={styles.homeHeader}>My Sol Transactions</div>
          <p>Welcome. please connect a wallet to begin:</p>
          <div css={styles.multiButtonWrapper}>
            <WalletMultiButton />
          </div>
        </div>
      )}
    </>
  );
}

export default App;

const styles = {
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
  appContainer: css({
    width: "100%",
    backgroundColor: "darkslategray",
    display: "block",
    minHeight: "100%",
  }),
  multiButtonWrapper: css({
    marginTop: "16px",
    display: "flex",
    justifyContent: "right",
  }),
  navBar: css({
    width: "100%",
    height: "20%",
    display: "flex",
    padding: "12px 32px",
    justifyContent: "space-between",
  }),
  navBarTitle: css({
    color: "yellow",
    fontSize: "2rem",
    fontWeight: 700,
  }),
  formWrapper: css({
    display: "flex",
    justifyContent: "center",
  }),
  transactions: css({
    background: "lightGray",
    color: "black",
  }),
};
