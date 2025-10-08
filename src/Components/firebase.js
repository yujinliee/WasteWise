// src/Components/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; 
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBffyHahsNJzjBWHl1hooyGIR6FiezHzJ8",
  authDomain: "wastewise-8e034.firebaseapp.com",
  projectId: "wastewise-8e034",
  storageBucket: "wastewise-8e034.appspot.com",
  messagingSenderId: "554717310113",
  appId: "1:554717310113:web:8cf537678e26165f85d4e0",
  measurementId: "G-ETDC40WKQH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);
const auth = getAuth(app); 
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider(); 

export { auth, db, storage, analytics, googleProvider };