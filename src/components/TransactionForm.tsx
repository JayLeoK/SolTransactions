/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React from "react";
import SolAmountInput from "./SolAmountInput";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { SolTransaction } from "../models/SolTransaction";
import useTransactionsService from "../hooks/TransactionsService";
import useSolanaService from "../hooks/SolanaService";
import Modal from "./ui/Modal";
import { Alert } from "@reach/alert";

type Props = {};
const TransactionForm: React.FC<Props> = () => {
  const [walletAddress, setWalletAddress] = React.useState("");
  const [solAmount, setSolAmount] = React.useState("");
  const { publicKey } = useWallet();

  const { submitTransfer, submitTransferStatus, submitTransferError } =
    useSolanaService();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    if (!publicKey) return;
    event.preventDefault();
    const lamports = solAmount ? Number(solAmount) * 1e9 : 0;
    const signature = await submitTransfer({
      lamports,
      toAddress: walletAddress,
    });
    //reset form
    setWalletAddress("");
    setSolAmount("");
  };
  return (
    <form css={styles.transactionForm} onSubmit={handleSubmit}>
      <div css={styles.formInfo}>
        <h2> Transfer Solana</h2>
        <p> Enter the address and amount you'd like to transfer.</p>
      </div>
      <div css={styles.formElements}>
        <div css={styles.formInputWrapper}>
          <label htmlFor="wallet-input">Wallet</label>
          <input
            id="wallet-input"
            type="text"
            value={walletAddress}
            placeholder="wallet address"
            onChange={(event) => setWalletAddress(event.target.value)}
            disabled={submitTransferStatus === "loading" ? true : false}
            required
          />
        </div>

        <div css={styles.submitWrapper}>
          <div css={styles.formInputWrapper}>
            <SolAmountInput
              solAmount={solAmount}
              setSolAmount={setSolAmount}
              disabled={submitTransferStatus === "loading" ? true : false}
            />
          </div>
          <button
            disabled={
              publicKey && submitTransferStatus !== "loading" ? false : true
            }
            type="submit"
          >
            Send Solana
          </button>
        </div>
        <span css={styles.statusFlashMessage}>
          {
            //case statement based on submitTransferStatus
            submitTransferStatus === "loading" ? (
              <span>Submitting transaction...</span>
            ) : submitTransferStatus === "success" ? (
              <span>Transaction submitted successfully!</span>
            ) : submitTransferStatus === "error" ? (
              <Alert type="assertive">{submitTransferError?.message}</Alert>
            ) : (
              ""
            )
          }
        </span>
      </div>
    </form>
  );
};
export default TransactionForm;

const styles = {
  transactionForm: css({
    display: "flex",
    width: "60%",
    background: "#512da8",
    padding: "20px",
    justifyContent: "space-between",
    borderRadius: "6px",
  }),
  formInfo: css({
    width: "35%",
  }),
  formElements: css({
    display: "flex",
    width: "50%",
    flexDirection: "column",
    justifyContent: "space-between",
    button: {
      width: "150px",
      alignContent: "center",
      height: "30px",
      marginLeft: "16px",
      marginTop: "auto",
      whiteSpace: "nowrap",
    },
  }),
  formInputWrapper: css({
    width: "100%",
    label: {
      display: "block",
      marginBottom: "6px",
    },
    input: {
      width: "100%",
    },

    marginTop: "12px",
  }),
  submitWrapper: css({
    display: "flex",
    justifyContent: "flex-end",
  }),
  statusFlashMessage: css({
    marginTop: "8px",
    minWidth: "250px",
  }),
};
