// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getStorage, ref } from "firebase/storage";
import { getFirestore } from "firebase/firestore";



// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyANyA_MhiiDcznu9xDQw8iUVLGLonASOiE",
    authDomain: "chatie-52e48.firebaseapp.com",
    projectId: "chatie-52e48",
    storageBucket: "chatie-52e48.appspot.com",
    messagingSenderId: "441184476050",
    appId: "1:441184476050:web:b031d002195ab1253abf4b"
  };
  
// Initialize Firebase
export const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);

export const auth = getAuth();

export const storage = getStorage();

export const db = getFirestore();