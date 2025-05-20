import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../lib/firebase'; // Import db
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore'; // Firestore functions

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [authUser, setAuthUser] = useState(null); // Firebase auth user object
  const [firestoreUser, setFirestoreUser] = useState(null); // Custom user data from Firestore
  const [loading, setLoading] = useState(true); // Start with loading true for initial auth check

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setLoading(true); // Set loading true at the start of an auth state change
      let userSnapshotUnsubscribe = () => {}; // To store Firestore listener unsubscribe function

      if (user) {
        setAuthUser(user);
        const userDocRef = doc(db, "users", user.uid);
        userSnapshotUnsubscribe = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            setFirestoreUser({ uid: docSnap.id, ...docSnap.data() });
          } else {
            console.warn("User document not found in Firestore for UID:", user.uid);
            setFirestoreUser(null); // Explicitly set to null if not found
          }
          setLoading(false); // setLoading(false) *after* Firestore attempt
        }, (error) => {
          console.error("Error fetching user document from Firestore:", error);
          setFirestoreUser(null);
          setLoading(false); // setLoading(false) on Firestore error
        });
      } else {
        setAuthUser(null);
        setFirestoreUser(null);
        setLoading(false); // setLoading(false) when user is logged out
      }

      // This cleanup function is for the effect triggered by onAuthStateChanged.
      // It will call the Firestore listener's unsubscribe function for the *previous* state.
      return () => {
        userSnapshotUnsubscribe();
      };
    });

    // This cleans up the onAuthStateChanged listener when AuthProvider unmounts
    return () => {
      unsubscribeAuth();
    };
  }, []); // Empty dependency array ensures this effect runs once on mount and cleans up on unmount

  const logout = async () => {
    try {
      await signOut(auth);
      // onAuthStateChanged will handle setting authUser, firestoreUser to null and loading to false.
    } catch (error) {
      console.error("Failed to log out:", error);
      // If signOut fails, the auth state likely hasn't changed, so onAuthStateChanged won't fire.
      // Consider if specific error handling or UI feedback is needed here.
    }
  };

  const value = {
    authUser,
    firestoreUser,
    user: authUser ? { ...authUser, ...firestoreUser } : null,
    loading,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}