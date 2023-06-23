import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCnymgBlx5yirDHXVy23tpDmUX_mXpcAak",
  authDomain: "parclsoltransactions.firebaseapp.com",
  projectId: "parclsoltransactions",
  storageBucket: "parclsoltransactions.appspot.com",
  messagingSenderId: "461076459515",
  appId: "1:461076459515:web:7379c40dbc09666ef3e55e",
  measurementId: "G-WPLZJ87DLV",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
