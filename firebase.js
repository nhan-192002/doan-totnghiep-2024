// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';


// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
 
  apiKey: "AIzaSyBz3LFapIajLud_ctVTaP9wSvZZ8E2Yjh4",
  authDomain: "doan-danentang.firebaseapp.com",
  databaseURL: "https://doan-danentang-default-rtdb.firebaseio.com",
  projectId: "doan-danentang",
  storageBucket: "doan-danentang.appspot.com",
  messagingSenderId: "577435190168",
  appId: "1:577435190168:web:87cd585cdb62bb807b21ed",
  measurementId: "G-3QYJNF67J5"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const auth = getAuth(app);
if (!firebase.apps.length){
  firebase.initializeApp(firebaseConfig);
}

export {firebase};
