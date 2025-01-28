// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
 import {getFirestore} from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCdCwOkUKx4eVdC-t8elK8iHYTqTqPOkxM",
  authDomain: "guessandgoversiontwo.firebaseapp.com",
  projectId: "guessandgoversiontwo",
  storageBucket: "guessandgoversiontwo.firebasestorage.app",
  messagingSenderId: "827933428607",
  appId: "1:827933428607:web:25a0cb05de905e9b14e84a",
  measurementId: "G-XZN76DCT1N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db= getFirestore(app)