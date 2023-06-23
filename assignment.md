# Senior Frontend Take Home Assessment: Solana Transfer History

The following are the guidelines on the app:

1. A user should be able to connect their wallet and send devnet SOL from the connected wallet to another address.

   a. Get Devnet SOL here: https://solfaucet.com/

   b. We recommend solana-wallet-adapter for connecting to wallet extensions

2. There should be an input for the amount of SOL to send from the connected wallet. There should be an input for the recipient wallet address. There should also be a button that sends the transaction.

   a. Here is some boilerplate to help you get started: https://solanacookbook.com/references/basic-transactions.html#how-to-send-sol

3. As the transaction is processing, show a loading state. If the transaction fails, show an error state. If the transaction succeeds, show a success state with a link to the transaction on SolScan.
4. Once a transaction is confirmed, you must record the transaction details in a database of your choice.
5. Once all the transactions are stored a user must be able to search for a transaction through a search box. Preferably with autocomplete suggestions.

   a. We recommend Algolia for an out-of-the-box solution with a generous free tier: https://www.algolia.com/doc/guides/building-search-ui/getting-started/react-hooks/

6. The output should generate a table of the transfers you’ve recorded in your database on step 4. The transfers should be filtered by those that were sent from the connected wallet. Users should be able to click on any table row and see the full transaction details in a modal. Clicking outside the modal must close the modal.
7. For design reference, you can copy SolScan. Only include the components that are relevant to you. https://solscan.io/token/DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263
8. You must build the app’s frontend with TypeScript and React. Feel free to use any CSS or UI library that you’d like, our recommendation is Material UI which is easily accessible. However, you are not bound to it.
9. The submission must be hosted on a live preview link. You can use Vercel, Heroku, GitHub Pages, or free VMs provided by AWS.
10. Technical writing is a big part of our engineering culture, so with the live link and code submission you must submit an Engineering Design Document detailing your architecture decisions. (Approx. 500 words)

Code Practices:

1. In the frontend you must implement state management with any combination of react-query , redux , zustand , jotai , or recoil . The only requirement is that you use
   at least one state management library.
2. The modules/folder structure of your submission app must reflect that you are
   building it for scale.
3. Usage of modern React APIs like Hooks and Context are a must.

> An extensive list of free dev resources:` https://github.com/ripienaar/free-for-dev

A valid submission must contain the following:

- Live link to the project
- GitHub link to source code
- Attachment/link of your Eng design document
- A description on how you would improve upon your design if you had more time
  Feel free to reach out for clarification at tom@parcl.co
