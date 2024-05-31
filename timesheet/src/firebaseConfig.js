// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDNk5v_5cnV7f4ITVpJfaqwRKXPqBpLbK8",
  authDomain: "timesheet-b4b9b.firebaseapp.com",
  projectId: "timesheet-b4b9b",
  storageBucket: "timesheet-b4b9b.appspot.com",
  messagingSenderId: "560157972729",
  appId: "1:560157972729:web:523c3d3069e835519f2a28",
  measurementId: "G-H6MTB1YKQ0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };