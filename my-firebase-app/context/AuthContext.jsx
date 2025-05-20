import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../lib/firebase'; // Import db
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore'; // Firestore functions

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [authUser, setAuthUser] = useState(null); // Firebase auth user object
  const [firestoreUser, setFirestoreUser] = useState(null); // Custom user data from Firestore
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        setAuthUser(user);
        // Fetch user data from Firestore
        const userDocRef = doc(db, "users", user.uid);
        // Use onSnapshot to listen for real-time updates to user data (e.g., role changes by admin)
        const unsubscribeSnapshot = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            setFirestoreUser({ uid: docSnap.id, ...docSnap.data() });
          } else {
            // This case might happen if Firestore doc creation failed or was delayed
            // Or if a user exists in Auth but not in Firestore (e.g. imported users)
            console.warn("User document not found in Firestore for UID:", user.uid);
            setFirestoreUser(null); // Or handle as an error/incomplete profile
          }
          setLoading(false);
        }, (error) => {
          console.error("Error fetching user document from Firestore:", error);
          setFirestoreUser(null);
          setLoading(false);
        });
        // Store snapshot unsubscribe function to call it on cleanup
        return () => {
            unsubscribeSnapshot();
            setLoading(false);
        }
      } else {
        setAuthUser(null);
        setFirestoreUser(null);
        setLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return () => {
        unsubscribeAuth();
        setLoading(false); // Ensure loading is false on unmount
    }
  }, []);

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      // Auth state change will be caught by onAuthStateChanged, which will clear users
    } catch (error) {
      console.error("Failed to log out:", error);
    } finally {
        // No need to setLoading(false) here if onAuthStateChanged handles it.
        // However, if there's an error before signOut completes, onAuthStateChanged might not trigger immediately.
        // For safety, or if you want immediate UI feedback for logout button.
        // but onAuthStateChanged is preferred for consistency.
    }
  };

  const value = {
    authUser,       // The raw Firebase Auth user object (contains email, uid, emailVerified, etc.)
    firestoreUser,  // Custom data from Firestore (firstName, lastName, role, workId, etc.)
    user: authUser ? { ...authUser, ...firestoreUser } : null, // A combined user object for convenience
    loading,
    logout,
  };

  // Only render children when initial loading is complete to avoid flashes of incorrect content
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}