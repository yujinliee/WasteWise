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
        setUser({
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          email: currentUser.email,
          photoURL: currentUser.photoURL,
          provider: currentUser.providerData[0]?.providerId || "firebase",
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 🧩 Function to manually refresh user info (used after saving settings)
  const refreshUser = async () => {
    if (auth.currentUser) {
      await reload(auth.currentUser);
      const refreshedUser = auth.currentUser;
      setUser({
        uid: refreshedUser.uid,
        displayName: refreshedUser.displayName,
        email: refreshedUser.email,
        photoURL: refreshedUser.photoURL,
        provider: refreshedUser.providerData[0]?.providerId || "firebase",
      });
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, refreshUser }}>
      {!loading && children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
