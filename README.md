# SolTransactions
Web app to send Solana transactions to another wallet.

Visit the app at https://jayleok.github.io/SolTransactions/


##Design doc breakdown

Tools to set up this project: Yarn and vite were used to build and preview
For data storage, I set up a database on firebase to save and access solana transactions.

For the frontend, I used React and Typescript for functionality and components and Emotion for styling management.

I made sure to use a variety of react libraries to demonstrate my ability to learn and use new tools and utilize the latest react features for better performance, readability, and accessibility. Here are some libraries I made sure to utilize:

- react-table by Tanner Linsley for the table component: sorting, filtering, and pagination
- firebase by Google for database types and custom fetching hooks
- react-query by Tanner Linsley for data modeling and fetching
- web3.js and wallet-adapter-react package by solana-labs for solana wallet connection and transaction creation
- Reach UI for accessible modal components and hidden text for screen readers

## Architecture decisions

Using react-query, I made sure to separate the data fetching logic from the components using custom hooks: I wrote SolanaService for creating Solana transfers and fetching the transaction data for storage, and I wrote FirebaseService for inserting and fetching the transaction data from the database.

I found that react-table was a great library for creating a table with enhanced features for sorting, filtering, and pagination. In order to allow for users to sort and filter by date, I followed the docs to create a custom date filter.
