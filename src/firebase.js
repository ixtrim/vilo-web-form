import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Vilo Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCU2Stbwha2Me5_nkBHKodriNU1KI6ZseM",
  authDomain: "vilo-ebc86.firebaseapp.com",
  projectId: "vilo-ebc86",
  storageBucket: "vilo-ebc86.appspot.com",
  messagingSenderId: "733089434950",
  appId: "1:733089434950:web:0d0a7cb55e385309686947"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// VILO Products from Firebase
export const db = getFirestore(app);
export const storage = getStorage(app);
