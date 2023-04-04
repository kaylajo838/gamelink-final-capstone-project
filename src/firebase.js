// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCUzkoF2SrGyW-rqnQBajZbOmzhKZAd7XY",
    authDomain: "gamelink-capstone-final.firebaseapp.com",
    projectId: "gamelink-capstone-final",
    storageBucket: "gamelink-capstone-final.appspot.com",
    messagingSenderId: "512765319771",
    appId: "1:512765319771:web:c7d80c0504ec89280abd7e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);