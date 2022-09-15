import { initializeApp } from 'firebase/app';
import { getFirestore} from 'firebase/firestore';
import { getDatabase } from "firebase/database";


const firebaseConfig = {
  apiKey: "AIzaSyAamH26A3J_hCyraFvRGV2c2b7nB0FzWuo",
  authDomain: "registro-calorias-8f4e1.firebaseapp.com",
  databaseURL: "https://registro-calorias-8f4e1-default-rtdb.firebaseio.com",
  projectId: "registro-calorias-8f4e1",
  storageBucket: "registro-calorias-8f4e1.appspot.com",
  messagingSenderId: "772056695868",
  appId: "1:772056695868:web:94e747ca9c3ee3a32baf39"
};

  const app= initializeApp(firebaseConfig);
  export const db = getFirestore(app)
  export const dbcat = getDatabase(app)