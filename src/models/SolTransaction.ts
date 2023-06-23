import { Timestamp } from "firebase/firestore";

//model for transaction
export interface SolTransaction {
  signature: string;
  block: string;
  fromAddress: string;
  toAddress: string;
  amount: number;
  timestamp: Timestamp;
  feePayer: string;
  feeAmount: number;
  error: string;
  lastBlockHash: string;
}
