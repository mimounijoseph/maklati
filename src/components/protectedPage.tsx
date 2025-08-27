"use client";
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/useContext";
import { Loader } from "@/components/ui/loader";
type ProtectedPageProps = {
  children: ReactNode;
};

const ProtectedPage = ({ children }: ProtectedPageProps) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      if (!loading && user === null) {
        console.log(loading, user);

        const redirectPath = router.asPath;
        router.push(`/auth/login?redirect=${encodeURIComponent(redirectPath)}`);
      }
    }, 2000);
  }, [loading, user, router]);

  if (loading || (!loading && !user)) {
    return (
      <div className="h-[60vh] flex justify-center items-center">
        <Loader>
          <span className="text-black dark:text-white">
            Getting things ready…
          </span>
        </Loader>
      </div>
    );
  }
  return <>{children}</>;
};

export default ProtectedPage;
