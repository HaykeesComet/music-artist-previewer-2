// Firebase configuration and initialization
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyAQp_WPnsua00p-x2IS9PeQP7GP916td8E",
  authDomain: "music-artist-previewer-267bd.firebaseapp.com",
  projectId: "music-artist-previewer-267bd",
  storageBucket: "music-artist-previewer-267bd.appspot.com",
  messagingSenderId: "517867615502",
  appId: "1:517867615502:web:865dad6d1ca512434a935f",
  measurementId: "G-X6R1LJTQV8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase Authentication and Firestore database
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };