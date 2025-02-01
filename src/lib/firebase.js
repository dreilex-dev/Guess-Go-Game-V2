// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "guessandgov3-8039a.firebaseapp.com",
  projectId: "guessandgov3-8039a",
  storageBucket: "guessandgov3-8039a.firebasestorage.app",
  messagingSenderId: "391837604881",
  appId: "1:391837604881:web:a0560252a2b9cf330525b0",
  measurementId: "G-5VCTX23Y23"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);
