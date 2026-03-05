import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { addDoc, collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { auth, db, googleProvider } from "@/config/firebase";

const adminImage =
  "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=1200";

const defaultSnackPayload = (ownerUID: string) => ({
  address: "berkane centre ville",
  description: "menu variable avec plein de categori la'dans , pizza, tacos, boissons et beaucoup plus",
  image:
    "https://images.pexels.com/photos/33129/popcorn-movie-party-entertainment.jpg?_gl=1*1nhik1*_ga*OTM4MjU4MzA3LjE3NTYzNjc5OTI.*_ga_8JE65Q40S6*czE3NTYzNzIxMjUkbzMkZzEkdDE3NTYzNzIxNDMkajQyJGwwJGgw",
  name: "snack abderrahim",
  ownerUID,
  phone: "0532323232",
});

export default function AdminRegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const ensureSnackDocument = async (uid: string) => {
    const existingSnack = await getDocs(query(collection(db, "snacks"), where("ownerUID", "==", uid)));
    if (existingSnack.empty) {
      await addDoc(collection(db, "snacks"), defaultSnackPayload(uid));
    }
  };

  const saveAdminProfile = async (uid: string, adminEmail: string | null, displayName: string) => {
    await setDoc(
      doc(db, "users", uid),
      {
        email: adminEmail,
        displayName: displayName || "",
        role: "admin",
        createdAt: new Date(),
      },
      { merge: true }
    );

    await ensureSnackDocument(uid);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const displayName = name.trim();

      if (displayName) {
        await updateProfile(result.user, { displayName });
      }

      await saveAdminProfile(result.user.uid, result.user.email, displayName);
      router.push("/admin/dashboard");
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
      await saveAdminProfile(
        result.user.uid,
        result.user.email,
        result.user.displayName || ""
      );
      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err?.message || "Unable to continue with Google.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#fff7ed_0%,#ffffff_45%,#f8fafc_100%)] p-4 sm:p-6">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-[36px] border border-white/70 bg-white shadow-[0_30px_120px_rgba(15,23,42,0.12)] lg:grid-cols-2">
        <section className="flex items-center px-6 py-10 sm:px-10 lg:px-14">
          <div className="w-full max-w-md">
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-orange-500">
              Admin register
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.06em] text-slate-950">
              Create your restaurant workspace
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Set up the admin account, start your snack profile, and manage orders from the dashboard.
            </p>

            <form onSubmit={handleRegister} className="mt-8 space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Name</span>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-300" placeholder="Your name" />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-300" placeholder="admin@yourrestaurant.com" />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-300" placeholder="Minimum 6 characters" />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Confirm password</span>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-300" placeholder="Repeat password" />
              </label>

              {error && <p className="text-sm font-medium text-rose-600">{error}</p>}

              <button type="submit" disabled={loading || googleLoading} className="w-full rounded-2xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? "Creating..." : "Create admin account"}
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

            <p className="mt-6 text-sm text-slate-600">
              Already have an account?{" "}
              <Link href="/admin/auth/login" className="font-semibold text-orange-600 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </section>

        <section className="relative hidden overflow-hidden bg-slate-950 lg:block">
          <img src={adminImage} alt="Restaurant operations" className="absolute inset-0 h-full w-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.22),rgba(15,23,42,0.82))]" />
          <div className="relative flex h-full flex-col justify-end p-10 text-white">
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-orange-300">
              Start smart
            </p>
            <h2 className="mt-3 max-w-md text-3xl font-semibold tracking-[-0.05em]">
              Launch your snack profile with menu, QR access, and admin tools ready.
            </h2>
            <div className="mt-6 grid max-w-md gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.2em] text-white/60">Profile</p>
                <p className="mt-2 text-lg font-semibold">Snack details</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.2em] text-white/60">Orders</p>
                <p className="mt-2 text-lg font-semibold">Live tracking</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
