
// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from 'firebase/app';
import {getFirestore} from 'firebase/firestore';
import {getAuth} from 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyDqzT0Y4GYDv_mSnsRmDv55MzF60iiJpEY",
  authDomain: "prepwise-276d6.firebaseapp.com",
  projectId: "prepwise-276d6",
  storageBucket: "prepwise-276d6.firebasestorage.app",
  messagingSenderId: "237897562004",
  appId: "1:237897562004:web:ee86f78b6d9ac0edac4181",
  measurementId: "G-GYR4HR9Y34"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);