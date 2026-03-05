"use client";

import { useToast } from "@/components/ui/toast";
import { useAuth } from "../../../context/useContext";
import { signOut } from "firebase/auth";
import { auth } from "../../../config/firebase";
import { useTranslation } from "react-i18next";
import dynamic from "next/dynamic";
import { useCurrency } from "@/context/currencyContext";
import Select from "react-select";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";

const LanguageSelect = dynamic(() => import("@/components/languag-select"), {
  ssr: false,
  loading: () => null,
});

const options = [
  {
    value: "USD",
    label: "USD - $",
    flag: "https://flagcdn.com/us.svg",
  },
  {
    value: "EUR",
    label: "EUR - EUR",
    flag: "https://flagcdn.com/eu.svg",
  },
  {
    value: "MAD",
    label: "MAD - DH",
    flag: "https://flagcdn.com/ma.svg",
  },
];

function Header() {
  const { t, i18n } = useTranslation("common");
  const { toast } = useToast();
  const { user } = useAuth();
  const { currency, setCurrency } = useCurrency();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);

  function showToast(
    title: string,
    message: string,
    variant: "success" | "default" | "destructive" | "warning" | "info" | undefined
  ) {
    toast({
      title,
      description: message,
      variant,
      duration: 2000,
    });
  }

  const navItems = useMemo(
    () => [
      { href: "/", label: "Home" },
      { href: "/snack", label: t("snacks") },
      { href: "/about", label: t("about") },
      { href: "/contact", label: t("contact") },
    ],
    [t]
  );

  const logout = async () => {
    await signOut(auth);
    showToast(t("logout_success_title"), t("logout_success_msg"), "success");
    setProfileOpen(false);
    router.push("/");
  };

  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
  }, [router.asPath]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!profileRef.current?.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const profileLabel = user?.displayName || user?.email || "Settings";

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-6">
      <div className="mx-auto max-w-7xl overflow-visible rounded-[28px] border border-white/70 bg-white/78 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-2xl font-semibold tracking-[-0.06em] text-slate-950 sm:text-3xl"
              style={{ fontFamily: "Fraunces, Georgia, serif" }}
              aria-label={t("brand")}
              title={t("brand")}
              suppressHydrationWarning
            >
              {t("brand")}
            </Link>

            <nav className="hidden items-center gap-1 lg:flex">
              {navItems.map((item) => {
                const active = router.pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      active
                        ? "bg-orange-500 text-white shadow-[0_10px_25px_rgba(249,115,22,0.24)]"
                        : "text-slate-600 hover:bg-orange-50 hover:text-orange-600"
                    }`}
                    suppressHydrationWarning
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative z-50 hidden lg:block" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileOpen((prev) => !prev)}
                className="inline-flex items-center gap-3 rounded-full border border-orange-100 bg-white/90 px-3 py-2 text-sm text-slate-700 shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition hover:border-orange-200 hover:bg-orange-50"
                aria-expanded={profileOpen}
                aria-label="Open account settings"
              >
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="profile"
                    className="h-9 w-9 rounded-full border border-orange-100 object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-sm font-semibold text-orange-600">
                    {profileLabel.slice(0, 1).toUpperCase()}
                  </div>
                )}
                <div className="hidden text-left xl:block">
                  <p className="text-xs uppercase tracking-[0.22em] text-orange-500">
                    Preferences
                  </p>
                  <p className="max-w-[160px] truncate text-sm font-medium text-slate-900">
                    {profileLabel}
                  </p>
                </div>
                <svg
                  className={`h-4 w-4 text-slate-500 transition-transform ${profileOpen ? "rotate-180" : ""}`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
                </svg>
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full z-[90] mt-3 w-[320px] overflow-hidden rounded-[24px] border border-orange-100 bg-white/95 p-4 shadow-[0_24px_70px_rgba(15,23,42,0.12)] backdrop-blur-xl">
                  <div className="rounded-[18px] bg-stone-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-500">
                      Account
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">{profileLabel}</p>
                    {user?.email && (
                      <p className="mt-1 text-xs text-slate-500">{user.email}</p>
                    )}
                  </div>

                  <div className="mt-4 space-y-4">
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                        Language
                      </p>
                      <LanguageSelect />
                    </div>

                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                        Currency
                      </p>
                      <Select
                        value={options.find((o) => o.value === currency)}
                        onChange={(opt: any) => setCurrency(opt?.value)}
                        options={options}
                        isSearchable={false}
                        formatOptionLabel={(option: any) => (
                          <div className="flex items-center gap-2 text-slate-900">
                            <img src={option.flag} alt={option.value} className="h-4 w-5 rounded-sm object-cover" />
                            <span className="text-sm">{option.label}</span>
                          </div>
                        )}
                        styles={{
                          control: (base: any, state: any) => ({
                            ...base,
                            minHeight: 44,
                            borderRadius: 18,
                            borderColor: state.isFocused ? "#fb923c" : "#fed7aa",
                            boxShadow: "none",
                            backgroundColor: "rgba(255,255,255,0.96)",
                          }),
                          menu: (base: any) => ({
                            ...base,
                            borderRadius: 18,
                            overflow: "hidden",
                          }),
                        }}
                      />
                    </div>

                    {user ? (
                      <button
                        type="button"
                        onClick={logout}
                        className="w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-500"
                        suppressHydrationWarning
                      >
                        {t("logout")}
                      </button>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          href="/auth/login"
                          className="rounded-2xl bg-stone-100 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-orange-50 hover:text-orange-600"
                          suppressHydrationWarning
                        >
                          {t("login")}
                        </Link>
                        <Link
                          href="/auth/register"
                          className="rounded-2xl bg-orange-500 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-orange-600"
                          suppressHydrationWarning
                        >
                          {t("signup")}
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-orange-100 bg-orange-50 text-orange-600 transition hover:bg-orange-100 lg:hidden"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Open main menu"
            >
              <svg
                className="h-5 w-5"
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
        </div>

        {menuOpen && (
          <div className="border-t border-orange-100/70 bg-white/88 px-4 py-4 lg:hidden">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const active = router.pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-2xl px-4 py-3 text-sm font-medium transition ${
                      active
                        ? "bg-orange-500 text-white"
                        : "bg-stone-50 text-slate-700 hover:bg-orange-50 hover:text-orange-600"
                    }`}
                    suppressHydrationWarning
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="mt-4 rounded-[24px] border border-orange-100 bg-white/90 p-4 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
              <div className="flex items-center gap-3">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="profile"
                    className="h-10 w-10 rounded-full border border-orange-100 object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-sm font-semibold text-orange-600">
                    {profileLabel.slice(0, 1).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-orange-500">
                    Preferences
                  </p>
                  <p className="text-sm font-medium text-slate-900">{profileLabel}</p>
                </div>
              </div>

              <div className="mt-4 grid gap-3">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                    Language
                  </p>
                  <LanguageSelect />
                </div>

                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                    Currency
                  </p>
                  <Select
                    value={options.find((o) => o.value === currency)}
                    onChange={(opt: any) => setCurrency(opt?.value)}
                    options={options}
                    isSearchable={false}
                    formatOptionLabel={(option: any) => (
                      <div className="flex items-center gap-2 text-slate-900">
                        <img src={option.flag} alt={option.value} className="h-4 w-5 rounded-sm object-cover" />
                        <span className="text-sm">{option.label}</span>
                      </div>
                    )}
                    styles={{
                      control: (base: any) => ({
                        ...base,
                        minHeight: 46,
                        borderRadius: 18,
                        borderColor: "#fed7aa",
                        boxShadow: "none",
                      }),
                    }}
                  />
                </div>

                {user ? (
                  <button
                    type="button"
                    onClick={logout}
                    className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white"
                    suppressHydrationWarning
                  >
                    {t("logout")}
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/auth/login"
                      className="rounded-2xl bg-stone-100 px-4 py-3 text-center text-sm font-semibold text-slate-700"
                      suppressHydrationWarning
                    >
                      {t("login")}
                    </Link>
                    <Link
                      href="/auth/register"
                      className="rounded-2xl bg-orange-500 px-4 py-3 text-center text-sm font-semibold text-white"
                      suppressHydrationWarning
                    >
                      {t("signup")}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
