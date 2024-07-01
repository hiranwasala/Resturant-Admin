
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth , GoogleAuthProvider} from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyDjHLY3g_O1WX6S5pLtEPcAb5zRud441E0",
  authDomain: "resturant-app-8b581.firebaseapp.com",
  projectId: "resturant-app-8b581",
  storageBucket: "resturant-app-8b581.appspot.com",
  messagingSenderId: "815509009948",
  appId: "1:815509009948:web:b98d6554b66a27029e91d9",
  measurementId: "G-ERPE2GHP44"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const provider = new  GoogleAuthProvider();
const auth  = getAuth(app) ;
const db = getFirestore(app);
const storage = getStorage(app); 
export{provider,auth, db, storage} ;

