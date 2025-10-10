import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, reload } from "firebase/auth";
import { auth } from "./firebase";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 Listen to Firebase Auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(formatUser(currentUser));
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 🧩 Function to refresh user info (after profile update)
  const refreshUser = async () => {
    try {
      if (auth.currentUser) {
        await reload(auth.currentUser);
        setUser(formatUser(auth.currentUser));
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
    }
  };

  // 🧱 Utility function to standardize user structure
  const formatUser = (firebaseUser) => ({
    uid: firebaseUser.uid,
    displayName: firebaseUser.displayName || "User",
    email: firebaseUser.email || "",
    photoURL:
      firebaseUser.photoURL ||
      "https://cdn-icons-png.flaticon.com/512/847/847969.png", // default avatar
    provider: firebaseUser.providerData[0]?.providerId || "firebase",
  });

  return (
    <UserContext.Provider value={{ user, setUser, refreshUser }}>
      {!loading && children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
