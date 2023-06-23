import {
  BlockhashWithExpiryBlockHeight,
  BlockheightBasedTransactionConfirmationStrategy,
  ParsedTransactionWithMeta,
  ParsedInstruction,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
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
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  // idle | loading | success | error
  const [status, setStatus] = React.useState("idle");

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
    <form onSubmit={handleSubmit}>
      <div>
        <div>
          <span id="statusFlashMessage">
            {
              //case statement based on  submitTransferStatus
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
        <div>
          <label htmlFor="wallet-input">Wallet</label>
          <input
            id="wallet-input"
            type="text"
            value={walletAddress}
            placeholder="wallet address"
            onChange={(event) => setWalletAddress(event.target.value)}
            disabled={status === "loading" ? true : false}
            required
          />
        </div>
        <div>
          <SolAmountInput
            solAmount={solAmount}
            setSolAmount={setSolAmount}
            disabled={status === "loading" ? true : false}
          />
        </div>
        {/* <button
          type="button"
          onClick={() => handleFeeEstimate()}
          disabled={status === "loading" ? true : false}
          id="feeEstimateButton"
        >
          Get Fee Estimate
        </button> */}
        <button
          disabled={publicKey && status !== "loading" ? false : true}
          type="submit"
        >
          Send Solana
        </button>
        {submitTransferStatus === "success" && (
          <Modal
            onClose={() => {
              setWalletAddress("");
              setSolAmount("");
            }}
            includeToggle={false}
          >
            <div>
              <h2>Successfully Transfered Solana!</h2>
              <p> to: {walletAddress}</p>
              <p> {solAmount}</p>
            </div>
          </Modal>
        )}
      </div>
    </form>
  );
};
export default TransactionForm;
