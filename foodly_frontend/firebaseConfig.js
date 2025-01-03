// Initialize Firebase
//const app = initializeApp(firebaseConfig);

// firebaseConfig.js
import firebase from "@react-native-firebase/app";

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

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
