// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB-mEpMqKYkpBXGmwijwASzu9kM8rW3Grw",
  authDomain: "dzen-code.firebaseapp.com",
  projectId: "dzen-code",
  storageBucket: "dzen-code.appspot.com",
  messagingSenderId: "899842844609",
  appId: "1:899842844609:web:854eba1ad1629ec7627140",
  measurementId: "G-29BR2RS4MF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)