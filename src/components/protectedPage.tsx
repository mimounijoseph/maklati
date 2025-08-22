'use client';
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";
import useAuth from "../hooks/useAuth";

type ProtectedPageProps = {
  children: ReactNode;
};

const ProtectedPage = ({ children }: ProtectedPageProps) => {
  const user = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && user === null) {
      // ✅ Ajoute la route actuelle dans le paramètre de redirection
      const redirectPath = router.asPath;
      router.push(`/auth/login?redirect=${encodeURIComponent(redirectPath)}`);
    }
  }, [isClient, user, router]);

  if (!isClient || user === null) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default ProtectedPage;
