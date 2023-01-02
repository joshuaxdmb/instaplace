import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { FIREBASE_API_KEY } from "@env";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: FIREBASE_API_KEY,
    authDomain: "instaplace-c6e04.firebaseapp.com",
    projectId: "instaplace-c6e04",
    storageBucket: "instaplace-c6e04.appspot.com",
    messagingSenderId: "812581881503",
    appId: "1:812581881503:web:311e6de62b58a1eec444aa",
    measurementId: "G-CPNK72QQW5",
  };
  
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app, 'gs://instaplace-c6e04.appspot.com/')

export {db, storage}