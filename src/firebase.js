// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore
} from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCP_20IL2pjlh5QieU9-kiua1uICLdqnRQ",
  authDomain: "production-b48bb.firebaseapp.com",
  projectId: "production-b48bb",
  storageBucket: "production-b48bb.appspot.com",
  messagingSenderId: "878205560810",
  appId: "1:878205560810:web:be33a9c25d5d5abe0af493"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
export { auth, provider, db};
