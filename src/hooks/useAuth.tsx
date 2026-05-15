import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  setPersistence,
  browserSessionPersistence,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "../lib/firebase";

// The user shape exposed to the rest of the app
export interface AppUser {
  uid: string;
  username: string;
  email: string;
  photoURL: string | null;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  signInEmail: (email: string, password: string) => Promise<void>;
  signUpEmail: (email: string, password: string, username: string) => Promise<void>;
  signInGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Helper: persist user profile to Firestore
async function saveUserToFirestore(firebaseUser: FirebaseUser, username: string) {
  try {
    const userRef = doc(db, "users", firebaseUser.uid);
    await setDoc(userRef, {
      uid: firebaseUser.uid,
      username,
      email: firebaseUser.email,
      photoURL: firebaseUser.photoURL || null,
      updatedAt: Date.now(),
    }, { merge: true });
  } catch (error) {
    console.error("Failed to save user to Firestore:", error);
    // Continue anyway so auth isn't completely blocked
  }
}

// Helper: convert Firebase user → AppUser
async function resolveAppUser(firebaseUser: FirebaseUser): Promise<AppUser> {
  try {
    const userRef = doc(db, "users", firebaseUser.uid);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
      const data = snap.data();
      return {
        uid: firebaseUser.uid,
        username: data.username || firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "USER",
        email: data.email || firebaseUser.email || "",
        photoURL: data.photoURL || firebaseUser.photoURL || null,
      };
    }
  } catch (error) {
    console.error("Failed to fetch user from Firestore:", error);
  }

  // Fallback if doc doesn't exist or fetch failed
  const fallbackName = firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "USER";
  return {
    uid: firebaseUser.uid,
    username: fallbackName,
    email: firebaseUser.email || "",
    photoURL: firebaseUser.photoURL || null,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen to Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const appUser = await resolveAppUser(firebaseUser);
        setUser(appUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Email + Password Sign-In
  const signInEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  // Email + Password Sign-Up (saves username)
  const signUpEmail = async (email: string, password: string, username: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: username });
    await saveUserToFirestore(cred.user, username);
  };

  // Google Sign-In (extracts pfp + name)
  const signInGoogle = async () => {
    const cred = await signInWithPopup(auth, googleProvider);
    const displayName = cred.user.displayName || cred.user.email?.split("@")[0] || "USER";
    await saveUserToFirestore(cred.user, displayName);
  };

  // Logout
  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInEmail, signUpEmail, signInGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
