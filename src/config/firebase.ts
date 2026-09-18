import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyDdKvupFrZ_6aA4EXkOQ0D65_pf7q7INo0",
  authDomain: "professional-portfolio-43e91.firebaseapp.com",
  projectId: "professional-portfolio-43e91",
  storageBucket: "professional-portfolio-43e91.firebasestorage.app",
  messagingSenderId: "686721500677",
  appId: "1:686721500677:web:8b29040c912578eeb8be6c",
  measurementId: "G-PL4G8GYWQS"
};

// Initialize Firebase once
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

// Designated admin email from the project metadata & user prompt
export const PRIMARY_ADMIN_EMAIL = "johnnysiele@gmail.com";
