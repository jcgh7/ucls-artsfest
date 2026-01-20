import { auth, provider, db } from "./firebase.js";
import { signInWithPopup, onAuthStateChanged } from 
  "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { ref, get, runTransaction, onValue } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";

// document.getElementById("login").onclick = async () => {
//   await signInWithPopup(auth, provider);
// };

export let current = null;
const subscribers = new Set();

document.getElementById("auth").onclick = async () => {
  if(current){
    auth.signOut();
    window.location.href = "/";
  }
  else{
    await signInWithPopup(auth, provider);
    window.location.href = "/";
  }
};

onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log("Signed in:", user);
    document.getElementById("auth").innerHTML = "Logout";
    document.getElementById("name").innerHTML = "Signed in as " + user.displayName;
    const userAcc = await staticRead("new/users/"+user.uid);
    await writeLoc("new/users/"+user.uid, "access", "standard");
    await writeLoc("new/users/"+user.uid, "email", user.email);
    await writeLoc("new/users/"+user.uid, "name", user.displayName);
    document.cookie = user.uid;
    subscribers.forEach(cb => cb(user));
    current = user;
  } else {
    console.log("Signed out");
    document.getElementById("name").innerHTML = "Not signed in"
    document.getElementById("auth").innerHTML = "Login";
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

const workshopsRef = ref(db, "workshops");

export async function staticRead(loc){
  const refLoc = ref(db, loc);
  const snap = await get(refLoc);
  console.log(snap.val());
  return snap.val();
}

export async function liveRead(loc, callback){
  const refLoc = ref(db, loc);
  onValue(refLoc, snapshot => {
    callback(snapshot.val());
  });
}

export async function writeLoc(loc, key, value){
  const refLoc = ref(db, loc);
  await runTransaction(refLoc, data => {
    if(!data){
      data = {};
    }
    data[key] = value;
    return data;
  });
}
// // subscribe for live updates
// onValue(workshopsRef, snapshot => {
//   const data = snapshot.val();
//   renderWorkshops(data, user.uid);
// });

// // one-time read
// const snap = await get(workshopsRef);
// console.log(snap.val());

// const signupsRef = ref(db, `workshops/${workshopId}/signups`);
// await runTransaction(signupsRef, signups => {
//   if (!signups) signups = {};
//   if (signups[user.uid]) return;
//   if (Object.keys(signups).length >= CAPACITY) return;
//   signups[user.uid] = true;
//   return signups;
// });