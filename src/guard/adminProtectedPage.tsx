"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase"; // <-- adjust to your firebase config
import { onAuthStateChanged } from "firebase/auth";
import { Loader } from "@/components/ui/loader";

type ProtectedLayoutProps = {
  children: ReactNode;
};

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // not logged in
        router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.role === "admin") {
            setAuthorized(true);
          } else {
            router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
          }
        } else {
          router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
        }
      } catch (error) {
        console.error("Error checking user role:", error);
        router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader />
      </div>
    );
  }

  return authorized ? <>{children}</> : null;
}
