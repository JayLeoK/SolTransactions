/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React, { FC } from "react";
import { Dialog } from "@reach/dialog";
import { SolTransaction } from "../models/SolTransaction";
import { VisuallyHidden } from "@reach/visually-hidden";
import "@reach/dialog/styles.css";
type Props = {
  transaction: SolTransaction | null;
  handleClose: () => void;
};
const TransactionDetailDialog: FC<Props> = ({ transaction, handleClose }) => {
  const data = [
    { label: "Amount", value: transaction?.amount },
    { label: "Fee", value: transaction?.feeAmount },
    { label: "Fee Payer", value: transaction?.feePayer },
    { label: "Block", value: transaction?.block },
    { label: "Signature", value: transaction?.signature },
    {
      label: "Timestamp",
      value: transaction?.timestamp.toDate().toLocaleDateString(),
    },
    { label: "From Address", value: transaction?.fromAddress },
    { label: "To Address", value: transaction?.toAddress },
  ];
  return (
    <div>
      <Dialog css={styles.dialog} isOpen={transaction !== null}>
        <button onClick={() => handleClose()}>
          <VisuallyHidden>Close</VisuallyHidden>
          <span aria-hidden>×</span>
        </button>
        <div>
          <h2>Transaction Details</h2>
          <div css={styles.detailBreakdown}>
            {data.map((field) => (
              <>
                <h4>{field.label}</h4>
                <p>{field.value ?? "none"}</p>
              </>
            ))}
          </div>
        </div>
        <div>
          <a
            href={`https://solscan.io/tx/${transaction?.signature}?cluster=devnet`}
          >
            View on SolScan
          </a>
        </div>
      </Dialog>
    </div>
  );
};
export default TransactionDetailDialog;

const styles = {
  dialog: css({
    color: "black",
    position: "relative",
    button: {
      position: "absolute",
      right: "16px",
      top: "16px",
      border: "none",
      background: "none",
      color: "black",
      cursor: "pointer",
      fontSize: "24px",
    },
    a: {
      fontSize: "18px",
      fontWeight: "bold",
    },
  }),
  detailBreakdown: css({
    display: "grid",
    margin: "16px 0",
    gridTemplateColumns: "1fr 2fr",
    gap: "8px 16px",
    p: {
      overflow: "hidden",
    },
  }),
  detailBreakdownItem: css({}),
};
