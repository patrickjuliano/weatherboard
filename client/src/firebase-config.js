// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAlHR_kLVtNWJfx_ZE5DRwQjVLX009syEY",
  authDomain: "weatherboard-fcb54.firebaseapp.com",
  projectId: "weatherboard-fcb54",
  storageBucket: "weatherboard-fcb54.appspot.com",
  messagingSenderId: "513588876374",
  appId: "1:513588876374:web:d461f934af63574f3057f7",
  measurementId: "G-MCVHQ74EDT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);