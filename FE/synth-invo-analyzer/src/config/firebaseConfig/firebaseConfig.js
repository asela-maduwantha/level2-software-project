// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCOVo84zydyyDxOqkObvyuxctEdl9hIeCA",
  authDomain: "synthinvoanalyzer-e9baa.firebaseapp.com",
  projectId: "synthinvoanalyzer-e9baa",
  storageBucket: "synthinvoanalyzer-e9baa.appspot.com",
  messagingSenderId: "138717870621",
  appId: "1:138717870621:web:e67888e34a282bd7a9e4f4",
  measurementId: "G-56SZ2J5JB1"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };

export default firebaseConfig; 
