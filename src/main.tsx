import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import SolWalletAdapter from "./SolWalletAdapter";
import { QueryClient, QueryClientProvider } from "react-query";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={new QueryClient()}>
      <SolWalletAdapter>
        <App />
      </SolWalletAdapter>
    </QueryClientProvider>
  </React.StrictMode>
);
