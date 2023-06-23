import React, { FC } from "react";
import { Dialog } from "@reach/dialog";
import { SolTransaction } from "../models/SolTransaction";
import { VisuallyHidden } from "@reach/visually-hidden";

type Props = {
  transaction: SolTransaction | null;
  handleClose: () => void;
};
const TransactionDetailDialog: FC<Props> = ({ transaction, handleClose }) => {
  return (
    <div>
      <Dialog isOpen={transaction !== null}>
        <button onClick={() => handleClose()}>
          <VisuallyHidden>Close</VisuallyHidden>
          <span aria-hidden>×</span>
        </button>
        {
          <>
            <div>
              <h2>Transaction Details</h2>
              <div>
                <h4>Amount</h4>
                {transaction?.amount}
              </div>
              <div>
                <h4>Fee</h4>
                {transaction?.feeAmount}
              </div>
              <div>
                <h4>Block</h4>
                {transaction?.block}
              </div>
              <div>
                <h4>Signature</h4>
                {transaction?.signature}
              </div>
            </div>
            <div>
              <a
                href={`https://solscan.io/tx/${transaction?.signature}?cluster=devnet`}
              >
                View on SolScan
              </a>
            </div>
          </>
        }
      </Dialog>
    </div>
  );
};
export default TransactionDetailDialog;
