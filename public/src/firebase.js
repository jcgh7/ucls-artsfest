import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } 
  from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getDatabase, ref, set, runTransaction, onValue } 
  from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";

export const firebaseConfig = {
  apiKey: "AIzaSyCjYJc-bhGTIPptXFtBMxsSMK_ZXPCD0tk",
  authDomain: "ucls-artsfest.org",
  databaseURL: "https://ucls-artsfest-default-rtdb.firebaseio.com",
  projectId: "ucls-artsfest"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const provider = new GoogleAuthProvider();