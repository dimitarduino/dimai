// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_APIKEY,
  authDomain: "aishort-43df4.firebaseapp.com",
  projectId: "aishort-43df4",
  storageBucket: "aishort-43df4.firebasestorage.app",
  messagingSenderId: "390608933056",
  appId: "1:390608933056:web:a578ea9e38233c12321d25",
  measurementId: "G-D5ZEL0R7P6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);