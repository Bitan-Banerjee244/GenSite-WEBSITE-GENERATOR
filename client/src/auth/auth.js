// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "gensite-72be3.firebaseapp.com",
  projectId: "gensite-72be3",
  storageBucket: "gensite-72be3.firebasestorage.app",
  messagingSenderId: "667010145505",
  appId: "1:667010145505:web:a8d94e41dc62c322362ba0"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
