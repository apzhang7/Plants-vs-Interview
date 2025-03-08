// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_KEY,
  authDomain: "plantvsinterview.firebaseapp.com",
  databaseURL: "https://plantvsinterview-default-rtdb.firebaseio.com",
  projectId: "plantvsinterview",
  storageBucket: "plantvsinterview.firebasestorage.app",
  messagingSenderId: "102525160951",
  appId: "1:102525160951:web:787736d2df1b2c439c32f2",
  measurementId: "G-KXP06RSWQV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };