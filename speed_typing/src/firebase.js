import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDhZR84rhk15ANThF3Kw-Vhg_v1HuQx5bM",
    authDomain: "typemaster3.firebaseapp.com",
    projectId: "typemaster3",
    storageBucket: "typemaster3.firebasestorage.app",
    messagingSenderId: "802476159016",
    appId: "1:802476159016:web:65215f035ebc99fc73451d"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app); 

export default app;