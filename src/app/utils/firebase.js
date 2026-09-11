import { getFirestore, doc, getDoc } from 'firebase/firestore';


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDSQCMFTnuVgG7voH7zfI0xS7cr-1adih4",
  authDomain: "datahara-9f83d.firebaseapp.com",
  projectId: "datahara-9f83d",
  storageBucket: "datahara-9f83d.appspot.com",
  messagingSenderId: "854331466611",
  appId: "1:854331466611:web:a219dcded442df1eed9b06"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };