import { useState } from "react";
import Link from "next/link";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/config/firebase";

export default function AdminResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess("Password reset email sent. Please check your inbox.");
    } catch (err: any) {
      setError(err?.message || "Unable to send reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-orange-100 px-6 py-10">
      <div className="mx-auto w-full max-w-md rounded-3xl border border-white/80 bg-white/85 p-7 shadow-xl backdrop-blur">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-700">Reset Password</p>
        <h1 className="mt-2 text-3xl font-black text-slate-900">Recover admin access</h1>
        <p className="mt-2 text-sm text-slate-600">Enter your admin email to receive reset instructions.</p>

        <form onSubmit={handleReset} className="mt-7 space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-amber-500"
              placeholder="admin@yourrestaurant.com"
            />
          </label>

          {error && <p className="text-sm font-medium text-red-600">{error}</p>}
          {success && <p className="text-sm font-medium text-emerald-600">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-amber-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send Reset Email"}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between text-sm">
          <Link href="/admin/auth/login" className="font-semibold text-amber-700 hover:underline">
            Back to login
          </Link>
          <Link href="/admin/auth/register" className="font-semibold text-slate-700 hover:underline">
            Create admin account
          </Link>
        </div>
      </div>
    </main>
  );
}
