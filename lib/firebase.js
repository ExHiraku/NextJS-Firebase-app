import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { getFirestore, collection, query, where, limit, getDocs, orderBy } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCb_y6XJAfKu6vALJbLZTCBk7SJO_SqD8I",
    authDomain: "exfire-app.firebaseapp.com",
    projectId: "exfire-app",
    storageBucket: "exfire-app.appspot.com",
    messagingSenderId: "858894411490",
    appId: "1:858894411490:web:55f1d326b49535965260bb",
    measurementId: "G-2XVB6NEKMY"
};

// Initialise Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const firestore = getFirestore(app);
export const storage = getStorage(app);

// Firestore functions
export async function getUserWithUsername(username) {
    const usersRef = collection(firestore, "users");
    const q = query(usersRef, where("username", "==", username), limit(1));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs[0];
}

export async function getPostsForUser(username) {
    const postsRef = collection(firestore, "posts");
    const q = query(postsRef, where("username", "==", username), where("published", "==", true), orderBy("createdAt", "desc"), limit(5))
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs;
}

export async function getPosts(LIMIT) {
    const postsRef = collection(firestore, "posts");
    const q = query(postsRef, where("published", "==", true), orderBy("createdAt", "desc"), limit(LIMIT));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs;
}

export function postToJSON(doc) {
    const data = doc.data();
    // Since firestore is NOT serialisable, we must convert it to milliseconds
    data.createdAt = data.createdAt.toMillis();
    data.updatedAt = data.updatedAt.toMillis();
    return data;
}
