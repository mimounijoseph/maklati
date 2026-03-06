import { useState } from "react";
import Link from "next/link";
import { createUserWithEmailAndPassword, signInWithPopup, User } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import Layout from "@/pages/core/layout";
import { auth, googleProvider } from "../../../config/firebase";
import { db } from "../../../config/firebase";

const customerImage =
  "https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg?auto=compress&cs=tinysrgb&w=1200";

export default function Register() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const createdUser = result.user;
      setUser(createdUser);

      await setDoc(doc(db, "users", createdUser.uid), {
        email: createdUser.email,
        createdAt: new Date(),
        role: "user",
      });
    } catch (err: any) {
      setError(err?.message || "Unable to create account.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setError("");
    setGoogleLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const createdUser = result.user;
      setUser(createdUser);

      await setDoc(doc(db, "users", createdUser.uid), {
        email: createdUser.email,
        createdAt: new Date(),
        role: "user",
      });
    } catch (err: any) {
      setError(err?.message || "Unable to continue with Google.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <Layout>
      <main className="min-h-screen bg-[linear-gradient(135deg,#fff7ed_0%,#ffffff_45%,#f8fafc_100%)] p-4 sm:p-6">
        <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-[36px] border border-white/70 bg-white shadow-[0_30px_120px_rgba(15,23,42,0.12)] lg:grid-cols-2">
          <section className="flex items-center px-6 py-10 sm:px-10 lg:px-14">
            <div className="w-full max-w-md">
              <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-orange-500">
                Customer register
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-[-0.06em] text-slate-950">
                Create your account
              </h1>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Sign up to order faster, save your progress, and track your orders with live updates.
              </p>

              {!user ? (
                <>
                  <form onSubmit={handleRegister} className="mt-8 space-y-4">
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
                        minLength={6}
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-300"
                        placeholder="Minimum 6 characters"
                      />
                    </label>

                    {error && <p className="text-sm font-medium text-rose-600">{error}</p>}

                    <button
                      type="submit"
                      disabled={loading || googleLoading}
                      className="w-full rounded-2xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading ? "Creating..." : "Create account"}
                    </button>
                  </form>

                  <div className="my-6 flex items-center gap-3">
                    <div className="h-px flex-1 bg-slate-200" />
                    <span className="text-xs uppercase tracking-[0.24em] text-slate-400">or</span>
                    <div className="h-px flex-1 bg-slate-200" />
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogleRegister}
                    disabled={loading || googleLoading}
                    className="inline-flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-orange-200 hover:text-orange-600 disabled:opacity-60"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                      <path fill="#EA4335" d="M12 10.2v3.9h5.4c-.2 1.3-1.5 3.9-5.4 3.9-3.2 0-5.9-2.7-5.9-6s2.7-6 5.9-6c1.8 0 3 .8 3.7 1.5l2.5-2.4C16.6 3.5 14.5 2.5 12 2.5 6.8 2.5 2.5 6.8 2.5 12s4.3 9.5 9.5 9.5c5.5 0 9.1-3.8 9.1-9.2 0-.6-.1-1.1-.1-1.6H12Z" />
                    </svg>
                    {googleLoading ? "Creating with Google..." : "Continue with Google"}
                  </button>
                </>
              ) : (
                <div className="mt-8 text-center">
                  <p className="text-lg font-medium text-slate-900">
                    Welcome, {user.displayName || user.email}
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
                Already have an account?{" "}
                <Link href="/auth/login" className="font-semibold text-orange-600 hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </section>

          <section className="relative hidden overflow-hidden bg-slate-950 lg:block">
            <img src={customerImage} alt="Customer experience" className="absolute inset-0 h-full w-full object-cover opacity-80" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.22),rgba(15,23,42,0.82))]" />
            <div className="relative flex h-full flex-col justify-end p-10 text-white">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-orange-300">
                Join Maklati
              </p>
              <h2 className="mt-3 max-w-md text-3xl font-semibold tracking-[-0.05em]">
                Access restaurant menus instantly and keep every order under control.
              </h2>
              <div className="mt-6 grid max-w-md gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/60">Menu</p>
                  <p className="mt-2 text-lg font-semibold">Quick browsing</p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/60">Orders</p>
                  <p className="mt-2 text-lg font-semibold">Track live status</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </Layout>
  );
}
