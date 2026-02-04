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
  if (current) {
    document.cookie.split(";").forEach(cookie => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.slice(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    });
    auth.signOut();
    window.location.href = "/";
  }
  else {
    await signInWithPopup(auth, provider);
    window.location.href = "/";
  }
};

const unsubscribe = onAuthStateChanged(auth, async (user) => {
  if (user) {
    if (user.email.indexOf("@ucls.uchicago.edu") == -1) {
      alert("Please sign in using your @ucls.uchicago.edu email");
      unsubscribe();
      await auth.signOut();
      window.location.replace("/");
    }
    else {
      setCookie("uid", user.uid);
      document.getElementById("auth").innerHTML = "Logout";
      document.getElementById("name").innerHTML = "Signed in as " + user.displayName;
      const userAcc = await staticRead("new/users/" + user.uid);
      if (true) {
        const names = [ // holy jank
          "Brown",
          "Podszus",
          "Halbach",
          "Greenstone",
          "Neves",
          "Carter",
          "Lu",
          "Schopin",
          "Lichtenbaum",
          "Purcell",
          "Baker",
          "Ellis",
          "Brown",
          "Morton",
          "Daugherty",
          "Calegari",
          "Koyner",
          "Bhatoey-Bertrand",
          "Vicknair",
          "Chung",
          "Woods",
          "Ikem",
          "Spiotto",
          "Rentz",
          "Dumitrescu",
          "Wilson",
          "Sachdev",
          "Wreden",
          "Livni",
          "Wu",
          "Nicolai",
          "Mrizek",
          "Khan",
          "Danahey",
          "Callard",
          "Palmer",
          "Richards",
          "Diamond",
          "Brooks",
          "Ruiz de Luzuriaga",
          "Garrido",
          "Henger",
          "Johnson",
          "Ybarra",
          "Moultrie",
          "Chandran",
          "Lazar",
          "Tapper",
          "Andes",
          "Huang",
          "Novak",
          "Douglas",
          "Waterstraat",
          "Flowers",
          "Smith",
          "Tian",
          "Werdyani",
          "Khan",
          "Koss",
          "El Bissati",
          "Dennis",
          "Zheng",
          "Alenghat",
          "Romero",
          "Chitneni",
          "Nguyen",
          "Hillenbrand",
          "Schneider",
          "Gunning",
          "Wyers",
          "LaCroix-Birdthistle",
          "Byrnes",
          "Hillenbrand",
          "Jackson",
          "Labelle",
          "Benton",
          "Dong",
          "LaCroix-Birdthistle",
          "Payne",
          "Dohrn",
          "Byrnes",
          "Czarnecki-Lichstein",
          "Rossi",
          "Holt",
          "Shah",
          "Jonas",
          "Tart",
          "Golley",
          "Dearing",
          "Raudenbush",
          "Patel",
          "El Bissati",
          "Monterola",
          "Guo",
          "Nehme",
          "Khan",
          "Sufi",
          "Ardati",
          "Qureshi",
          "Peek Taylor",
          "Neater-Debow",
          "Mustafa",
          "Dutta",
          "Vegna-Spofford",
          "Stainton-Simmons",
          "Hu",
          "Bravo",
          "Alphonse",
          "Teklu",
          "Summers",
          "Robinson",
          "Woodson",
          "Hans",
          "Li",
          "Yim",
          "Gulyayev",
          "Sperone",
          "Duda",
          "Yu",
          "Murphy",
          "Yberra",
          "Vegna-Spofford",
          "Vogel",
          "Anitescu",
          "Reynolds",
          "Ofori-Mante",
          "Sharma",
          "Nieto",
          "Hurley",
          "Lichtenbaum",
          "Lukas",
          "Xiang",
          "Reyes",
          "Arias",
          "Mattiello",
          "Cobb",
          "Gao",
          "Callanta",
          "Purcell",
          "Pinc",
          "Yagen",
          "Vaughan",
          "Oyler",
          "Lindau",
          "Yu", 
          "Hubbard",
          "Shirrell"
        ];
        let set = false;
        for (const lastName of names) {
          if (user.displayName.split(" ")[user.displayName.split(" ").length - 1] == lastName) {
            await writeLoc(`new/users/${user.uid}`, "access", "early");
            set = true;
          }
        }
        if(!set){
          await writeLoc("new/users/" + user.uid, "access", "standard");
        }
      }
      
      await writeLoc("new/users/" + user.uid, "email", user.email);
      await writeLoc("new/users/" + user.uid, "name", user.displayName);
      subscribers.forEach(cb => cb(user));
      current = user;
    }
  } else {
    document.getElementById("name").innerHTML = "Not signed in"
    document.getElementById("auth").innerHTML = "Login";
  }
});

export function getUserIdFromName(name){
  let users = staticRead("new/users");
  console.log(users);
}

export function getUser() {
  return current;
}

export function getCookie(name) {
  return document.cookie
    .split("; ")
    .find(row => row.startsWith(name + "="))
    ?.split("=")[1] ?? null;
}


export function getCurrentUser() {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
}

export function onUserChanged(callback) {
  subscribers.add(callback);

  if (current !== null) {
    callback(current);
  }

  return () => subscribers.delete(callback);
}

export function logout() {
  document.cookie.split(";").forEach(cookie => {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.slice(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
  });
  auth.signOut();
}

export function setCookie(name, value, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie =
    `${encodeURIComponent(name)}=${encodeURIComponent(value)}; ` +
    `expires=${expires}; path=/; SameSite=Lax`;
}


const workshopsRef = ref(db, "workshops");

export async function staticRead(loc) {
  const refLoc = ref(db, loc);
  const snap = await get(refLoc);
  return snap.val();
}

export async function liveRead(loc, callback) {
  const refLoc = ref(db, loc);
  onValue(refLoc, snapshot => {
    callback(snapshot.val());
  });
}

export async function writeLoc(loc, key, value) {
  const refLoc = ref(db, loc);
  await runTransaction(refLoc, data => {
    if (!data) {
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