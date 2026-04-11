import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDIDUWCPLnfKemoQsTcRve5R-EjBmRLDtg",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "assetlink-ce2a9.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "assetlink-ce2a9",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "assetlink-ce2a9.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1064314606810",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1064314606810:web:d13841bc51bcffe81fc1e3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
