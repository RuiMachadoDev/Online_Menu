import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDLk_wcH40OKlV_5kPKrvDal5m8nBlX6Fg",
    authDomain: "hrcsonlinemenu.firebaseapp.com",
    projectId: "hrcsonlinemenu",
    storageBucket: "hrcsonlinemenu.appspot.com",
    messagingSenderId: "148845543687",
    appId: "1:148845543687:web:e0618fdd56906f177d45a2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
