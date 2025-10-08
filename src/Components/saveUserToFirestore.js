// utils/saveUserToFirestore.js
import { doc, setDoc } from "firebase/firestore";
import { db } from "../Components/firebase";

export async function saveUserToFirestore(user) {
  if (!user) return;
  const userRef = doc(db, "users", user.uid);
  await setDoc(userRef, {
    uid: user.uid,
    displayName: user.displayName || "",
    email: user.email || "",
    photoURL: user.photoURL || "",
    createdAt: new Date().toISOString(),
  }, { merge: true });
}
