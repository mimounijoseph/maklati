"use client";

import ThemeSwitchIcon from "@/components/theme-switch-icon";
import React, { useEffect } from "react";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "../../../context/useContext";
import { signOut } from "firebase/auth";
import { auth } from "../../../config/firebase";
import { useTranslation } from "react-i18next";
import dynamic from "next/dynamic";

function Header() {
  const { t, i18n } = useTranslation("common");
  const { toast } = useToast();
  const { user, loading } = useAuth();

  function showToast(
    title: string,
    message: string,
    variant: "success" | "default" | "destructive" | "warning" | "info" | undefined
  ) {
    toast({
      title,
      description: message,
      variant,
      duration: 2000
    });
  }

const LanguageSelect = dynamic(
  () => import("@/components/languag-select"),
  { ssr: false, loading: () => null } 
);



  const logout = async () => {
    await signOut(auth);
    showToast(t("logout_success_title"), t("logout_success_msg"), "success");
  };

  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  return (
    <div>
      <nav className="border-gray-200 bg-transparent">
        <div className="flex flex-wrap items-center justify-between flex-shrink-0 max-w-screen-xl mx-auto p-4">
          <a
            href="/"
            className="text-3xl font-bold"
            style={{ color: "#FF9B00", fontFamily: "Sacramento" }}
            aria-label={t("brand")}
            title={t("brand")}
            suppressHydrationWarning
          >
            {t("brand")}
          </a>

          <div className="flex items-center md:order-2 space-x-1 md:space-x-2 rtl:space-x-reverse">
            <button
              data-collapse-toggle="mega-menu"
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-white rounded-lg md:hidden hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600"
              aria-controls="mega-menu"
              aria-expanded="false"
              aria-label="Open main menu"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          </div>

          <div
            id="mega-menu"
            className="items-center hidden w-full md:flex md:w-auto md:order-2"
          >
            <ul className="flex flex-col md:items-center mt-4 font-medium md:flex-row md:mt-0 md:space-x-8 rtl:space-x-reverse">
              <li>
                <a
                  href="/"
                  className="block py-2 px-3 text-white border-b border-gray-100 hover:text-amber-600 md:border-0 md:p-0"
                  aria-current="page"
                  suppressHydrationWarning
                >
                  {t("menu")}
                </a>
              </li>

              <li>
                <a
                  href="/snack"
                  className="block py-2 px-3 text-white border-b border-gray-100 hover:text-amber-600 md:border-0 md:p-0"
                  suppressHydrationWarning
                >
                  {t("snacks")}
                </a>
              </li>

              <li>
                <a
                  href="/about"
                  className="block py-2 px-3 text-white border-b border-gray-100 hover:text-amber-600 md:border-0 md:p-0"
                  suppressHydrationWarning
                >
                  {t("about")}
                </a>
              </li>

              <li>
                <a
                  href="/contact"
                  className="block py-2 px-3 text-white border-b border-gray-100 hover:text-amber-600 md:border-0 md:p-0"
                  suppressHydrationWarning
                >
                  {t("contact")}
                </a>
              </li>

              {user ? (
                <>
                  <li className="text-center mt-10 mb-5 md:ms-24 md:mb-0 md:mt-0">
                    <a
                      href="/auth/login"
                      className="text-white bg-amber-600 md:bg-transparent hover:bg-amber-600 focus:ring-4 font-medium rounded-lg text-sm px-14 py-2 md:px-5 md:py-2.5 focus:outline-none"
                      onClick={logout}
                      suppressHydrationWarning
                    >
                      {t("logout")}
                    </a>
                  </li>
                  <li>
                    <div className="flex justify-center gap-2 items-center w-fit m-auto md:mt-2">
                      <p className="font-normal text-sm text-amber-600">
                        {user.displayName}
                      </p>
                      <img
                        src={user?.photoURL as string}
                        alt="profile"
                        className="w-10 h-10 rounded-full mx-auto"
                      />
                    </div>
                  </li>
                </>
              ) : (
                <>
                  <li className="md:ms-24">
                    <a
                      href="/auth/login"
                      className="text-white hover:bg-amber-600 focus:ring-4 font-medium rounded-lg text-sm px-4 py-2 md:px-5 md:py-2.5 focus:outline-none"
                      suppressHydrationWarning
                    >
                      {t("login")}
                    </a>
                  </li>
                  <li>
                    <a
                      href="/auth/register"
                      className="text-white hover:bg-amber-600 focus:ring-4 font-medium rounded-lg text-sm px-4 py-2 md:px-5 md:py-2.5 focus:outline-none"
                      suppressHydrationWarning
                    >
                      {t("signup")}
                    </a>
                  </li>
                </>
              )}
              <LanguageSelect />
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}


export default Header;
