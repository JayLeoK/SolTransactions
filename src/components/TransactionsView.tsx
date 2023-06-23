import React from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { SolTransaction } from "../models/SolTransaction";
import useTransactionsService from "../hooks/TransactionsService";
import SolTransactionTable from "./SolTransactionTable";
import TransactionDetailDialog from "./TransactionDetailDialog";
type Props = {};
const TransactionsTable: React.FC<Props> = () => {
  const { publicKey } = useWallet();
  const [transactionForDetails, setTransactionForDetails] = React.useState(
    null as SolTransaction | null
  );
  const close = () => setTransactionForDetails(null);
  const handleRowClick = (transaction: SolTransaction) => {
    setTransactionForDetails(transaction);
  };

  const {
    transactionsData: transactions,
    getTransactionsError: error,
    getTransactionsStatus: status,
  } = useTransactionsService({ publicKeyAddress: publicKey?.toString() ?? "" });

  const rerender = React.useReducer(() => ({}), {})[1];

  React.useEffect(() => {
    const transactionsStatus = document.getElementById("transactionsStatus");
    if (status === "loading") {
      transactionsStatus!.innerHTML = "Loading transactions...";
    } else if (status === "error") {
      transactionsStatus!.innerHTML = "Error loading data";
    } else {
      transactionsStatus!.innerHTML = "";
    }
  }, [status]);

  return (
    <div id="transactionsTableView">
      <div>
        <span id="transactionsStatus"></span>
      </div>
      <button onClick={() => rerender()}>Refresh</button>
      {transactions && (
        <SolTransactionTable
          data={transactions}
          handleRowClick={handleRowClick}
        ></SolTransactionTable>
      )}
      <TransactionDetailDialog
        transaction={transactionForDetails}
        handleClose={close}
      />
    </div>
  );
};

export default TransactionsTable;
