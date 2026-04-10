// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCpim-VDeXunGuOjArbAVTMd0kKeWJ4eM8",
  authDomain: "myapp-e-commerce-822d3.firebaseapp.com",
  projectId: "myapp-e-commerce-822d3",
  storageBucket: "myapp-e-commerce-822d3.firebasestorage.app",
  messagingSenderId: "510743215408",
  appId: "1:510743215408:web:94b5195f30b1519d965cf5",
  measurementId: "G-TQWGL5T6H9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export { app, analytics };
