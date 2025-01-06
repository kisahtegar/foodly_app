import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDtv_57pGQwkSFOwGijH4fR0uxNerU-dHY",
  authDomain: "kisahdemo.firebaseapp.com",
  databaseURL:
    "https://kisahdemo-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "kisahdemo",
  storageBucket: "kisahdemo.firebasestorage.app",
  messagingSenderId: "695798125068",
  appId: "1:695798125068:web:0dbf24c5b367ee21135429",
  measurementId: "G-7T7QEQPHRH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
