import NotificationDropdown from "@/components/adminNotecfication";
import NewOrderAlert from "@/components/alerts/newOrderalert";
import { auth, db } from "@/config/firebase";
import { useAuth } from "@/context/useContext";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { signOut } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { FC, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";

type NavItem = {
  href: string;
  label: string;
  icon: ReactNode;
};

const navItems: NavItem[] = [
  {
    href: "/admin/dashboard",
    label: "Dashboard",
    icon: (
      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6.025A7.5 7.5 0 1 0 17.975 14H10V6.025Z" />
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.5 3c-.169 0-.334.014-.5.025V11h7.975c.011-.166.025-.331.025-.5A7.5 7.5 0 0 0 13.5 3Z" />
      </svg>
    ),
  },
  {
    href: "/admin/dashboard/addPlat",
    label: "Add plat",
    icon: (
      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 17h6m-3 3v-6M4.857 4h4.286c.473 0 .857.384.857.857v4.286a.857.857 0 0 1-.857.857H4.857A.857.857 0 0 1 4 9.143V4.857C4 4.384 4.384 4 4.857 4Zm10 0h4.286c.473 0 .857.384.857.857v4.286a.857.857 0 0 1-.857.857h-4.286A.857.857 0 0 1 14 9.143V4.857c0-.473.384-.857.857-.857Zm-10 10h4.286c.473 0 .857.384.857.857v4.286a.857.857 0 0 1-.857.857H4.857A.857.857 0 0 1 4 19.143v-4.286c0-.473.384-.857.857-.857Z" />
      </svg>
    ),
  },
  {
    href: "/admin/dashboard/plats",
    label: "Plats",
    icon: (
      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.143 4H4.857A.857.857 0 0 0 4 4.857v4.286c0 .473.384.857.857.857h4.286A.857.857 0 0 0 10 9.143V4.857A.857.857 0 0 0 9.143 4Zm10 0h-4.286a.857.857 0 0 0-.857.857v4.286c0 .473.384.857.857.857h4.286A.857.857 0 0 0 20 9.143V4.857A.857.857 0 0 0 19.143 4Zm-10 10H4.857a.857.857 0 0 0-.857.857v4.286c0 .473.384.857.857.857h4.286a.857.857 0 0 0 .857-.857v-4.286A.857.857 0 0 0 9.143 14Zm10 0h-4.286a.857.857 0 0 0-.857.857v4.286c0 .473.384.857.857.857h4.286a.857.857 0 0 0 .857-.857v-4.286a.857.857 0 0 0-.857-.857Z" />
      </svg>
    ),
  },
  {
    href: "/admin/dashboard/orders",
    label: "Orders",
    icon: (
      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 8h6m-6 4h6m-6 4h6M6 3v18l2-2 2 2 2-2 2 2 2-2 2 2V3l-2 2-2-2-2 2-2-2-2 2-2-2Z" />
      </svg>
    ),
  },
  {
    href: "/admin/dashboard/snack",
    label: "Snack details",
    icon: (
      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 12c.263 0 .524-.06.767-.175a2 2 0 0 0 .65-.491c.186-.21.333-.46.433-.734.1-.274.15-.568.15-.864a2.4 2.4 0 0 0 .586 1.591c.375.422.884.659 1.414.659.53 0 1.04-.237 1.414-.659A2.4 2.4 0 0 0 12 9.736a2.4 2.4 0 0 0 .586 1.591c.375.422.884.659 1.414.659.53 0 1.04-.237 1.414-.659A2.4 2.4 0 0 0 16 9.736c0 .295.052.588.152.861s.248.521.434.73a2 2 0 0 0 .649.488 1.809 1.809 0 0 0 1.53 0 2.03 2.03 0 0 0 .65-.488c.185-.209.332-.457.433-.73.1-.273.152-.566.152-.861 0-.974-1.108-3.85-1.618-5.121A.983.983 0 0 0 17.466 4H6.456a.986.986 0 0 0-.93.645C5.045 5.962 4 8.905 4 9.736c.023.59.241 1.148.611 1.567.37.418.865.667 1.389.697Zm0 0c.328 0 .651-.091.94-.266A2.1 2.1 0 0 0 7.66 11h.681a2.1 2.1 0 0 0 .718.734c.29.175.613.266.942.266.328 0 .651-.091.94-.266.29-.174.537-.427.719-.734h.681a2.1 2.1 0 0 0 .719.734c.289.175.612.266.94.266.329 0 .652-.091.942-.266.29-.174.536-.427.718-.734h.681c.183.307.43.56.719.734.29.174.613.266.941.266a1.819 1.819 0 0 0 1.06-.351M6 12a1.766 1.766 0 0 1-1.163-.476M5 12v7a1 1 0 0 0 1 1h2v-5h3v5h7a1 1 0 0 0 1-1v-7m-5 3v2h2v-2h-2Z" />
      </svg>
    ),
  },
  {
    href: "/admin/dashboard/setting",
    label: "Setting",
    icon: (
      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13v-2a1 1 0 0 0-1-1h-.757l-.707-1.707.535-.536a1 1 0 0 0 0-1.414l-1.414-1.414a1 1 0 0 0-1.414 0l-.536.535L14 4.757V4a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v.757l-1.707.707-.536-.535a1 1 0 0 0-1.414 0L4.929 6.343a1 1 0 0 0 0 1.414l.536.536L4.757 10H4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h.757l.707 1.707-.535.536a1 1 0 0 0 0 1.414l1.414 1.414a1 1 0 0 0 1.414 0l.536-.535 1.707.707V20a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-.757l1.707-.708.536.536a1 1 0 0 0 1.414 0l1.414-1.414a1 1 0 0 0 0-1.414l-.535-.536.707-1.707H20a1 1 0 0 0 1-1Z" />
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      </svg>
    ),
  },
];

const Sidebar: FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = router.pathname;
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const alertTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const accountRef = useRef<HTMLDivElement | null>(null);

  const handleNewOrder = useCallback((message: string) => {
    setAlertMessage(message);
    if (alertTimeoutRef.current) {
      clearTimeout(alertTimeoutRef.current);
    }
    alertTimeoutRef.current = setTimeout(() => setAlertMessage(null), 5000);
  }, []);

  useEffect(() => {
    if (!user?.uid) {
      setPendingOrdersCount(0);
      return;
    }

    const pendingOrdersQuery = query(
      collection(db, "orders"),
      where("snackId", "==", user.uid),
      where("status", "==", "Pending")
    );

    const unsubscribe = onSnapshot(
      pendingOrdersQuery,
      (snapshot) => {
        setPendingOrdersCount(snapshot.size);
      },
      (error) => {
        console.error("Failed to watch pending orders:", error);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!accountRef.current?.contains(event.target as Node)) {
        setAccountOpen(false);
      }
    };

    const handleRouteStart = (url: string) => {
      if (url !== router.asPath) {
        setIsNavigating(true);
      }
    };

    const handleRouteDone = () => {
      setIsNavigating(false);
      setSidebarOpen(false);
    };

    router.events.on("routeChangeStart", handleRouteStart);
    router.events.on("routeChangeComplete", handleRouteDone);
    router.events.on("routeChangeError", handleRouteDone);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      router.events.off("routeChangeStart", handleRouteStart);
      router.events.off("routeChangeComplete", handleRouteDone);
      router.events.off("routeChangeError", handleRouteDone);
      document.removeEventListener("mousedown", handleClickOutside);

      if (alertTimeoutRef.current) {
        clearTimeout(alertTimeoutRef.current);
      }
    };
  }, [router]);

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      await signOut(auth);
      router.push("/admin/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
      setLogoutLoading(false);
    }
  };

  const navLinks = useMemo(() => navItems, []);
  const quickLinks = useMemo(
    () =>
      navItems.filter((item) =>
        item.label.toLowerCase().includes(search.trim().toLowerCase())
      ),
    [search]
  );

  return (
    <div className="admin" style={{ fontFamily: "sans-serif" }}>
      <nav className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white/90 backdrop-blur-md dark:border-gray-700 dark:bg-gray-800/90">
        <div className="h-14 px-3 lg:px-5 lg:pl-3">
          <div className="flex h-full items-center justify-between">
            <div className="flex items-center justify-start rtl:justify-end">
              <button
                aria-controls="logo-sidebar"
                type="button"
                onClick={() => setSidebarOpen((prev) => !prev)}
                aria-expanded={sidebarOpen}
                className="inline-flex items-center rounded-lg p-2 text-sm text-gray-700 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 sm:hidden dark:text-gray-200 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              >
                <span className="sr-only">Open sidebar</span>
                <svg className="h-6 w-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z" />
                </svg>
              </button>
              <Link href="/" className="ms-2 flex md:me-24">
                <span className="self-center whitespace-nowrap text-xl font-semibold text-gray-950 sm:text-2xl">
                  Maklati
                </span>
              </Link>
            </div>
            <div className="mx-4 hidden flex-1 max-w-xl lg:block">
              <div className="relative">
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search dashboard pages"
                  className="w-full rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm text-slate-700 shadow-sm outline-none transition focus:border-orange-300"
                />
                {search.trim() && (
                  <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
                    {quickLinks.length > 0 ? (
                      quickLinks.slice(0, 5).map((item) => (
                        <button
                          key={item.href}
                          onClick={() => {
                            setSearch("");
                            router.push(item.href);
                          }}
                          className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-50"
                        >
                          <span className="h-5 w-5 text-slate-500">{item.icon}</span>
                          <span>{item.label}</span>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-slate-500">No matching pages</div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <NotificationDropdown onNewOrder={handleNewOrder} />
              <div className="relative" ref={accountRef}>
                <button
                  onClick={() => setAccountOpen((prev) => !prev)}
                  className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm transition hover:border-orange-200"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-sm font-semibold text-white">
                    A
                  </span>
                  <span className="hidden text-left lg:block">
                    <span className="block text-sm font-semibold text-slate-900">
                      Account
                    </span>
                    <span className="block text-xs text-slate-500">
                      Admin shortcuts
                    </span>
                  </span>
                </button>

                {accountOpen && (
                  <div className="absolute right-0 z-30 mt-3 w-64 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.14)]">
                    <div className="border-b border-slate-100 px-4 py-4">
                      <p className="text-sm font-semibold text-slate-950">Account</p>
                      <p className="mt-1 text-xs text-slate-500">
                        Quick access to your admin pages
                      </p>
                    </div>
                    <div className="py-2">
                      {[
                        { href: "/admin/dashboard/snack", label: "Snack details" },
                        { href: "/admin/dashboard/orders", label: "Orders" },
                        { href: "/admin/dashboard/setting", label: "Settings" },
                      ].map((item) => (
                        <button
                          key={item.href}
                          onClick={() => {
                            setAccountOpen(false);
                            router.push(item.href);
                          }}
                          className="block w-full px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-50"
                        >
                          {item.label}
                        </button>
                      ))}
                      <button
                        onClick={handleLogout}
                        disabled={logoutLoading}
                        className="block w-full px-4 py-3 text-left text-sm text-rose-600 transition hover:bg-rose-50 disabled:opacity-40"
                      >
                        {logoutLoading ? "Signing out..." : "Logout"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div
          className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-orange-400 via-amber-500 to-orange-400 transition-all duration-300 ${
            isNavigating ? "w-full opacity-100" : "w-0 opacity-0"
          }`}
        />

        {alertMessage && (
          <div className="absolute left-0 mt-2 flex w-full justify-center px-4">
            <NewOrderAlert message={alertMessage} />
          </div>
        )}
      </nav>

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 sm:hidden"
        />
      )}

      <aside
        id="logo-sidebar"
        className={`fixed left-0 top-14 z-40 h-[calc(100vh-3.5rem)] w-64 border-r border-gray-200 bg-white/95 pt-3 transition-transform dark:border-gray-700 dark:bg-gray-800/95 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full overflow-y-auto bg-white/80 px-3 pb-4 backdrop-blur-sm dark:bg-gray-800/80">
          <div className="mb-2 flex items-center justify-end sm:hidden">
            <button
              type="button"
              aria-label="Close sidebar"
              onClick={() => setSidebarOpen(false)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-stone-100 text-slate-700 transition hover:bg-stone-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
          <ul className="space-y-2" style={{ fontFamily: "sans-serif" }}>
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              const badge = item.href === "/admin/dashboard/orders" && pendingOrdersCount > 0
                ? String(pendingOrdersCount)
                : null;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    scroll={false}
                    onClick={() => setSidebarOpen(false)}
                    className={`group flex items-center rounded-lg p-2 transition-all duration-200 ${
                      isActive
                        ? "bg-orange-50 text-orange-500 shadow-sm"
                        : "text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                    }`}
                  >
                    <span
                      className={`h-6 w-6 ${
                        isActive
                          ? "text-orange-500"
                          : "text-gray-800 dark:text-white"
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span className="ms-3 flex-1 whitespace-nowrap">{item.label}</span>
                    {badge && (
                      <span className="ms-3 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-blue-100 px-2 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        {badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}

            <li>
              <button
                type="button"
                onClick={handleLogout}
                disabled={logoutLoading}
                className="group flex w-full items-center rounded-lg p-2 text-gray-900 transition-all duration-200 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-white dark:hover:bg-gray-700"
              >
                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" className="h-6 w-6 text-red-600">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 17v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2m-5 5h10m0 0-3-3m3 3-3 3" />
                </svg>
                <span className="ms-3 flex-1 whitespace-nowrap text-left">
                  {logoutLoading ? "Signing out..." : "Logout"}
                </span>
              </button>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
