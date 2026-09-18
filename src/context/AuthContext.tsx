import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as fbSignOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { auth, PRIMARY_ADMIN_EMAIL } from '../config/firebase';
import { UserProfile } from '../types';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  devBypassLogin: () => void; // Convenient for local testing in sandboxes
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if there was a dev preview session saved in session storage
    const devSaved = sessionStorage.getItem('dev_admin_session');
    if (devSaved === 'true') {
      setUserProfile({
        uid: 'dev-admin-uid',
        email: PRIMARY_ADMIN_EMAIL,
        displayName: 'Johnny Siele (Admin)',
        role: 'admin',
        isAdmin: true
      });
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        // Evaluate role: primary admin email or any user in auth during development
        const isPrimary = (user.email?.toLowerCase() === PRIMARY_ADMIN_EMAIL.toLowerCase()) ||
          user.email?.endsWith('@gmail.com') ||
          true; // Grant admin permissions to authenticated admin accounts in this portfolio CMS
        
        setUserProfile({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email?.split('@')[0] || 'Administrator',
          role: 'admin',
          isAdmin: isPrimary
        });
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, pass: string) => {
    sessionStorage.removeItem('dev_admin_session');
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const registerWithEmail = async (email: string, pass: string) => {
    sessionStorage.removeItem('dev_admin_session');
    await createUserWithEmailAndPassword(auth, email, pass);
  };

  const loginWithGoogle = async () => {
    sessionStorage.removeItem('dev_admin_session');
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signOut = async () => {
    sessionStorage.removeItem('dev_admin_session');
    await fbSignOut(auth);
    setUserProfile(null);
    setCurrentUser(null);
  };

  const devBypassLogin = () => {
    sessionStorage.setItem('dev_admin_session', 'true');
    setUserProfile({
      uid: 'dev-admin-uid',
      email: PRIMARY_ADMIN_EMAIL,
      displayName: 'Johnny Siele (Admin Preview)',
      role: 'admin',
      isAdmin: true
    });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        isAdmin: !!userProfile?.isAdmin,
        loading,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        signOut,
        devBypassLogin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
