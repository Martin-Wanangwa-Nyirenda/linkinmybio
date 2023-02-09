import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB8-DJWhp8sUCPRa4-LEeoQDLzaP3TDfYQ",
  authDomain: "link-in-my-bio.firebaseapp.com",
  projectId: "link-in-my-bio",
  storageBucket: "link-in-my-bio.appspot.com",
  messagingSenderId: "71696213989",
  appId: "1:71696213989:web:ff4c63f3e0330f393fb10c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);