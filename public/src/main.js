import { auth, provider, db } from "./firebase.js";
import { signInWithPopup, onAuthStateChanged } from 
  "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { ref, get, runTransaction, onValue } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";

document.getElementById("login").onclick = async () => {
  await signInWithPopup(auth, provider);
};

let current = null;
const subscribers = new Set();

onAuthStateChanged(auth, user => {
  if (user) {
    console.log("Signed in:", user);
    subscribers.forEach(cb => cb(user));
    current = user;
  } else {
    console.log("Signed out");
  }
});

export function getUser(){
  return current;
}

export function onUserChanged(callback) {
  subscribers.add(callback);

  if (current !== null) {
    callback(current);
  }

  return () => subscribers.delete(callback);
}

export function logout(){
  auth.signOut();
}

/* interface db notes 

const workshopsRef = ref(db, "workshops");

// subscribe for live updates
onValue(workshopsRef, snapshot => {
  const data = snapshot.val();
  renderWorkshops(data, user.uid);
});

// one-time read
const snap = await get(workshopsRef);
console.log(snap.val());

const signupsRef = ref(db, `workshops/${workshopId}/signups`);
await runTransaction(signupsRef, signups => {
  if (!signups) signups = {};
  if (signups[user.uid]) return;
  if (Object.keys(signups).length >= CAPACITY) return;
  signups[user.uid] = true;
  return signups;
});
*/ 