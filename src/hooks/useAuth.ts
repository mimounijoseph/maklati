import { getAuth, onAuthStateChanged,User } from "firebase/auth";
import { useEffect, useState } from "react";
import { app } from '../config/firebase';

const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  return user;
};

export default useAuth;
