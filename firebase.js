// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDIPF-p348gVAhMYO14tPd6Z0gbpyo6DSk",
  authDomain: "fast-docs.firebaseapp.com",
  projectId: "fast-docs",
  storageBucket: "fast-docs.appspot.com",
  messagingSenderId: "1043926023151",
  appId: "1:1043926023151:web:4b3416772efb54d60cd41a",
  measurementId: "G-4LVX5RGFY9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);