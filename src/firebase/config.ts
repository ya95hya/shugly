import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCExL-MtKKG3_SND8-qjH2M-MI5Vv2V-dY",
    authDomain: "shugly.firebaseapp.com",
    projectId: "shugly",
    storageBucket: "shugly.firebasestorage.app",
    messagingSenderId: "71844095703",
    appId: "1:71844095703:web:85f731fb10e8dc8604f292",
    measurementId: "G-699XGN7K81"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
