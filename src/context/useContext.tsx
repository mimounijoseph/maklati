'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../config/firebase";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  selectedProducts:any;
  setSelectedProducts?:any
};

const AuthContext = createContext<AuthContextType>({ user: null, loading: true,selectedProducts:[]});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProducts,setSelectedProducts] = useState<any[]>([])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading,selectedProducts,setSelectedProducts }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
