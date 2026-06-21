// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "gensite-f76fe.firebaseapp.com",
  projectId: "gensite-f76fe",
  storageBucket: "gensite-f76fe.firebasestorage.app",
  messagingSenderId: "870983918375",
  appId: "1:870983918375:web:0c04fd74aa20efe7e2bf02",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
