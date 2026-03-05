import Link from "next/link";

export default function AdminLanding() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-100 text-slate-900">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-16 md:px-10">
        <div className="mb-6 inline-flex w-fit items-center rounded-full border border-amber-200 bg-white px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
          Admin Space
        </div>

        <h1 className="max-w-3xl text-4xl font-black leading-tight sm:text-5xl md:text-6xl">
          Control your menu, orders, and performance in one place.
        </h1>

        <p className="mt-6 max-w-2xl text-base text-slate-600 sm:text-lg">
          Access the Maklati admin dashboard to manage products, monitor incoming orders, and keep
          your restaurant data up to date.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Link
            href="/admin/auth/login"
            className="rounded-xl bg-amber-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-200 transition hover:bg-amber-600"
          >
            Admin Login
          </Link>
          <Link
            href="/admin/auth/register"
            className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
          >
            Create Admin Account
          </Link>
          <Link href="/admin/auth/reset" className="text-sm font-semibold text-amber-700 hover:underline">
            Forgot password?
          </Link>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/70 bg-white/70 p-5 shadow-sm backdrop-blur">
            <p className="text-sm font-semibold text-slate-800">Products</p>
            <p className="mt-2 text-sm text-slate-600">Create, edit, and manage your menu items quickly.</p>
          </div>
          <div className="rounded-2xl border border-white/70 bg-white/70 p-5 shadow-sm backdrop-blur">
            <p className="text-sm font-semibold text-slate-800">Orders</p>
            <p className="mt-2 text-sm text-slate-600">Track and process only your restaurant orders.</p>
          </div>
          <div className="rounded-2xl border border-white/70 bg-white/70 p-5 shadow-sm backdrop-blur">
            <p className="text-sm font-semibold text-slate-800">Insights</p>
            <p className="mt-2 text-sm text-slate-600">Follow daily revenue and order trends for your account.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
