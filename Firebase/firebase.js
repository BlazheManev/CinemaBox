import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
const firebaseConfig = {
  apiKey: "AIzaSyBfbrfrEnfTrA304xaZ98wrAd5qXHT41pQ",
  authDomain: "cinemabox-8c7c6.firebaseapp.com",
  projectId: "cinemabox-8c7c6",
  storageBucket: "cinemabox-8c7c6.appspot.com",
  messagingSenderId: "948996585907",
  appId: "1:948996585907:web:fcbfa291fe41f444ecb3c6",
  measurementId: "G-J0S4YTNK80",
  databaseURL: 'https://cinemabox-8c7c6-default-rtdb.europe-west1.firebasedatabase.app'
};

let app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const analytics = getAnalytics(app);
const db = getDatabase();
export { auth, db };
