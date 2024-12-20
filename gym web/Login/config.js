const firebase = require('firebase/compat/app');
require('firebase/compat/firestore');

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCNpW92qh2IGMueHK62UASfEB5-x1VlkIQ",
  authDomain: "fitness-app-223d9.firebaseapp.com",
  databaseURL: "https://fitness-app-223d9-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "fitness-app-223d9",
  storageBucket: "fitness-app-223d9.appspot.com",
  messagingSenderId: "1090716037735",
  appId: "1:1090716037735:web:cb4f5a004f16d64f511ac2",
  measurementId: "G-646BVNBHNK"
};
 
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const User = db.collection('Users');

module.exports = User;
