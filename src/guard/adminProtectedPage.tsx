"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuth } from "@/context/useContext";

type ProtectedLayoutProps = {
  children: ReactNode;
};

const adminAccessCache = new Map<string, boolean>();

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const { user, loading: authLoading } = useAuth();
  const [checkingRole, setCheckingRole] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAccess = async () => {
      if (authLoading) {
        return;
      }

      if (!user) {
        setAuthorized(false);
        setCheckingRole(false);
        router.replace(`/admin/auth/login?redirect=${encodeURIComponent(router.asPath)}`);
        return;
      }

      const cached = adminAccessCache.get(user.uid);
      if (cached) {
        setAuthorized(true);
        setCheckingRole(false);
        return;
      }

      setCheckingRole(true);

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const isAdmin = userDoc.exists() && userDoc.data()?.role === "admin";

        if (isAdmin) {
          adminAccessCache.set(user.uid, true);
          setAuthorized(true);
        } else {
          setAuthorized(false);
          router.replace(`/admin/auth/login?redirect=${encodeURIComponent(router.asPath)}`);
        }
      } catch (error) {
        console.error("Error checking user role:", error);
        setAuthorized(false);
        router.replace(`/admin/auth/login?redirect=${encodeURIComponent(router.asPath)}`);
      } finally {
        setCheckingRole(false);
      }
    };

    checkAccess();
  }, [authLoading, router, user]);

  if (authLoading || checkingRole) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-stone-50 via-white to-orange-50">
        <div className="rounded-2xl border border-orange-100 bg-white/85 px-6 py-5 shadow-lg backdrop-blur">
          <div className="flex items-center gap-4">
            <div className="h-11 w-11 animate-spin rounded-full border-4 border-orange-100 border-t-orange-500" />
            <div>
              <p className="text-sm font-semibold text-slate-900">Loading dashboard</p>
              <p className="text-sm text-slate-500">Preparing your workspace...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return authorized ? <>{children}</> : null;
}
