import { db } from "../firebase-config";
import { getDocs, collection, addDoc, query, where } from "firebase/firestore";
import { SolTransaction } from "../models/SolTransaction";
import { useMutation, useQuery, useQueryClient } from "react-query";

// hook for firestore api calls
const useTransactionsService = ({
  publicKeyAddress,
}: {
  publicKeyAddress: string;
}) => {
  const transactionsCollectionRef = collection(db, "transactions");
  const queryClient = useQueryClient();

  const getTransactionsQuery = useQuery("transactions", async () => {
    if (publicKeyAddress === "") {
      return;
    }
    const debitQuery = query(
      transactionsCollectionRef,
      where("fromAddress", "==", publicKeyAddress)
    );
    const debitSnapshot = await getDocs(debitQuery);
    const result: SolTransaction[] = [];

    debitSnapshot.forEach((doc) => {
      const data = doc.data();
      const transaction: SolTransaction = {
        signature: data.signature,
        block: data.block,
        fromAddress: data.fromAddress,
        toAddress: data.toAddress,
        amount: data.amount,
        timestamp: data.timestamp,
        feePayer: data.feePayer,
        feeAmount: data.fee,
        error: data.error,
        lastBlockHash: data.lastBlockHash,
      };
      result.push(transaction);
    });
    return result;
  });
  const addTransactionMutation = useMutation(
    "addTransaction",
    (newTransaction: SolTransaction) => {
      return addDoc(transactionsCollectionRef, newTransaction);
    },
    {
      onSuccess: () => {
        console.log("success");
        queryClient.invalidateQueries("transactions");
      },
      // onError: () => {
    }
  );
  return {
    transactionsData: getTransactionsQuery.data,
    getTransactionsStatus: getTransactionsQuery.status,
    getTransactionsError: getTransactionsQuery.error,

    addTransaction: addTransactionMutation.mutateAsync,
    addTransactionStatus: addTransactionMutation.status,
    addTransactionError: addTransactionMutation.error,
  };
};

export default useTransactionsService;
