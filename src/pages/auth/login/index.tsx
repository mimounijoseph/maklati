import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { auth, googleProvider } from "../../../config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../../config/firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  User,
} from "firebase/auth";
import Layout from "@/pages/core/layout";

const customerImage =
  "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1200";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();
  const { redirect } = router.query;

  const redirectByRole = (role: string) => {
    if (typeof redirect === "string") {
      router.push(redirect);
    } else if (role === "admin") {
      router.push("/admin/dashboard");
    } else {
      router.push("/client/dashboard");
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setUser(result.user);

      const userRef = doc(db, "users", result.user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const role = userSnap.data().role || "user";
        redirectByRole(role);
      } else {
        await setDoc(userRef, {
          email: result.user.email,
          createdAt: new Date(),
          role: "user",
        });
        redirectByRole("user");
      }
    } catch (err: any) {
      setError(err?.message || "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setGoogleLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);

      const userRef = doc(db, "users", result.user.uid);
      const userSnap = await getDoc(userRef);

      let role = "user";
      if (userSnap.exists()) {
        role = userSnap.data().role || "user";
      } else {
        await setDoc(userRef, {
          email: result.user.email,
          createdAt: new Date(),
          role: "user",
        });
      }

      localStorage.setItem("uid", result.user.uid);
      redirectByRole(role);
    } catch (err: any) {
      setError(err?.message || "Unable to sign in with Google.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <Layout>
      <main className="min-h-screen bg-[linear-gradient(135deg,#fff7ed_0%,#ffffff_45%,#f8fafc_100%)] p-4 sm:p-6">
        <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-[36px] border border-white/70 bg-white shadow-[0_30px_120px_rgba(15,23,42,0.12)] lg:grid-cols-2">
          <section className="order-2 flex items-center px-6 py-10 sm:px-10 lg:order-1 lg:px-14">
            <div className="w-full max-w-md">
              <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-orange-500">
                Customer login
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-[-0.06em] text-slate-950">
                Welcome back
              </h1>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Sign in to continue ordering, track your latest orders, and access your customer space.
              </p>

              {!user ? (
                <>
                  <form onSubmit={handleLogin} className="mt-8 space-y-4">
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-300"
                        placeholder="your@email.com"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-300"
                        placeholder="Enter your password"
                      />
                    </label>

                    {error && <p className="text-sm font-medium text-rose-600">{error}</p>}

                    <button
                      type="submit"
                      disabled={loading || googleLoading}
                      className="w-full rounded-2xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading ? "Signing in..." : "Sign in"}
                    </button>
                  </form>

                  <div className="my-6 flex items-center gap-3">
                    <div className="h-px flex-1 bg-slate-200" />
                    <span className="text-xs uppercase tracking-[0.24em] text-slate-400">or</span>
                    <div className="h-px flex-1 bg-slate-200" />
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={loading || googleLoading}
                    className="inline-flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-orange-200 hover:text-orange-600 disabled:opacity-60"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                      <path fill="#EA4335" d="M12 10.2v3.9h5.4c-.2 1.3-1.5 3.9-5.4 3.9-3.2 0-5.9-2.7-5.9-6s2.7-6 5.9-6c1.8 0 3 .8 3.7 1.5l2.5-2.4C16.6 3.5 14.5 2.5 12 2.5 6.8 2.5 2.5 6.8 2.5 12s4.3 9.5 9.5 9.5c5.5 0 9.1-3.8 9.1-9.2 0-.6-.1-1.1-.1-1.6H12Z" />
                    </svg>
                    {googleLoading ? "Signing in with Google..." : "Continue with Google"}
                  </button>
                </>
              ) : (
                <div className="mt-8 text-center">
                  <p className="text-lg font-medium text-slate-900">
                    Welcome back, {user.displayName || user.email}
                  </p>
                  {user.photoURL && (
                    <img
                      src={user.photoURL}
                      alt="profile"
                      className="mx-auto mt-4 h-16 w-16 rounded-full"
                    />
                  )}
                </div>
              )}

              <p className="mt-6 text-sm text-slate-600">
                Don't have an account?{" "}
                <Link href="/auth/register" className="font-semibold text-orange-600 hover:underline">
                  Create one
                </Link>
              </p>
            </div>
          </section>

          <section className="order-1 relative min-h-[320px] overflow-hidden bg-slate-950 lg:order-2">
            <img src={customerImage} alt="Restaurant customers" className="absolute inset-0 h-full w-full object-cover opacity-80" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.25),rgba(15,23,42,0.82))]" />
            <div className="relative flex h-full flex-col justify-end p-8 text-white sm:p-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-orange-300">
                Customer space
              </p>
              <h2 className="mt-3 max-w-md text-3xl font-semibold tracking-[-0.05em]">
                Browse restaurants, order faster, and track your order status live.
              </h2>
              <div className="mt-6 grid max-w-md gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/60">Ordering</p>
                  <p className="mt-2 text-lg font-semibold">Smooth flow</p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/60">Status</p>
                  <p className="mt-2 text-lg font-semibold">Live updates</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </Layout>
  );
}
