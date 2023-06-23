import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  ParsedInstruction,
  ParsedTransactionWithMeta,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import React from "react";
import { useMutation, useQueryClient } from "react-query";
import { SolTransaction } from "../models/SolTransaction";
import useTransactionService from "./TransactionsService";
import { Timestamp } from "firebase/firestore";

const useSolanaService = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const { addTransaction } = useTransactionService({
    publicKeyAddress: publicKey?.toBase58() || "",
  });
  const submitTransferMutation = useMutation(
    "submitTransfer",
    async ({
      lamports,
      toAddress,
    }: {
      lamports: number;
      toAddress: string;
    }) => {
      if (!publicKey) throw Error("Wallet not connected");
      if (lamports === 0 || isNaN(lamports)) throw Error("Amount is invalid");
      let toPublicKey: PublicKey;
      try {
        toPublicKey = new PublicKey(toAddress);
      } catch (error: any) {
        throw Error(`Problem with wallet given: ${error.message}`);
      }

      let signature: string;
      try {
        //https://github.com/solana-labs/solana/issues/23949
        const recentBlockhash = await connection.getLatestBlockhash(
          "processed"
        );
        let solTransaction = recentBlockhash
          ? new Transaction(recentBlockhash)
          : new Transaction();
        solTransaction.add(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: toPublicKey,
            lamports: lamports,
          })
        );
        solTransaction.feePayer = publicKey;
        signature = await sendTransaction(solTransaction, connection);

        const result = await connection.confirmTransaction({
          ...recentBlockhash,
          signature: signature,
        });

        console.log("transfer confirm result", JSON.stringify(result));
      } catch (error: any) {
        throw Error(`Transfer failed: ${error.message}`);
      }
      return signature;
    },
    {
      onSuccess: async (data) => {
        console.log("success");
        console.log("data", data);
        const details = await connection.getParsedTransaction(
          data,
          "confirmed"
        );
        if (!details) return;
        const parsedInstruction = details.transaction.message.instructions.find(
          (instruction) =>
            instruction?.programId.toBase58() ===
            "11111111111111111111111111111111"
        ) as ParsedInstruction;
        const newTransaction: SolTransaction = {
          signature: data,
          block: details?.slot.toString(),
          fromAddress: parsedInstruction?.parsed?.info?.source,
          toAddress: parsedInstruction?.parsed?.info?.destination,
          amount: parsedInstruction?.parsed?.info?.lamports,
          timestamp: Timestamp.fromDate(new Date()),
          feePayer: parsedInstruction?.parsed?.info?.source,
          feeAmount: details?.meta?.fee ?? 0,
          error: details?.meta?.err?.toString() ?? "",
          lastBlockHash: details?.transaction?.message?.recentBlockhash,
        };
        addTransaction(newTransaction);
      },
    }
  );

  return {
    submitTransfer: submitTransferMutation.mutateAsync,
    submitTransferStatus: submitTransferMutation.status,
    submitTransferError: submitTransferMutation.error as Error,
  };
};

export default useSolanaService;
