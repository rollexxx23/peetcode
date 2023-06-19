// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCzx_au-ohnpIN1OGLJYNxqq5wrkrxWzNc",
  authDomain: "peetcoe-b8eee.firebaseapp.com",
  projectId: "peetcoe-b8eee",
  storageBucket: "peetcoe-b8eee.appspot.com",
  messagingSenderId: "233681321374",
  appId: "1:233681321374:web:30f03f0e12eb4c57272a8f"
};

// Initialize Firebase

const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore, app };