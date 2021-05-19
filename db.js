import firebase from "firebase/app";
import "firebase/firestore";

 const firebaseConfig = {
    apiKey: "AIzaSyDWos6YkrCVXqqnn0jbfpZVNJNmcyy_SpU",
    authDomain: "parking-bf553.firebaseapp.com",
    databaseURL: "https://parking-bf553-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "parking-bf553",
    storageBucket: "parking-bf553.appspot.com",
    messagingSenderId: "407394943830",
    appId: "1:407394943830:web:5e06eff6b8179958c14cf7"
  };

  firebase.initializeApp(firebaseConfig);

export default firebase.firestore();