import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase/firebase'; // your Firebase setup
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: 'student' | 'teacher') => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Static admin credentials
  const staticAdmin = {
    email: 'admin@eduhub.com',
    password: 'admin123',
    user: {
      id: 'admin',
      email: 'admin@eduhub.com',
      name: 'Admin',
      role: 'admin',
      created_at: new Date().toISOString(),
    } as User,
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const docRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(docRef);
        if (userDoc.exists()) {
          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || '',
            role: userDoc.data().role,
            created_at: userDoc.data().createdAt?.toDate().toISOString() || '',
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    if (email === staticAdmin.email && password === staticAdmin.password) {
      setUser(staticAdmin.user);
      localStorage.setItem('user', JSON.stringify(staticAdmin.user));
      return;
    }

    const result = await signInWithEmailAndPassword(auth, email, password);
    const userDoc = await getDoc(doc(db, 'users', result.user.uid));
    if (!userDoc.exists()) throw new Error('User data not found in Firestore');

    setUser({
      id: result.user.uid,
      email: result.user.email || '',
      name: result.user.displayName || '',
      role: userDoc.data().role,
      created_at: userDoc.data().createdAt?.toDate().toISOString() || '',
    });
  };

  const register = async (email: string, password: string, name: string, role: 'student' | 'teacher') => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName: name });

    const userData: User = {
      id: result.user.uid,
      email,
      name,
      role,
      created_at: new Date().toISOString(),
      avatar: '', // Optional: add if available
    };

    await setDoc(doc(db, 'users', result.user.uid), {
      ...userData,
      createdAt: new Date(),
    });

    setUser(userData);
  };

  const logout = async () => {
    await auth.signOut();
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
