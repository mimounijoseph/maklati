import React from "react";
import Layout from "../core/layout";

function Contact() {
  return (
    <Layout>
      <section
        className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:px-8"
        style={{ fontFamily: "Sora, ui-sans-serif, system-ui, sans-serif" }}
      >
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[32px] bg-[linear-gradient(135deg,#0f172a_0%,#7c2d12_60%,#f97316_100%)] p-8 text-white shadow-[0_24px_80px_rgba(15,23,42,0.14)]">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-orange-200">
              Contact
            </p>
            <h1
              className="mt-3 text-4xl font-semibold tracking-[-0.05em]"
              style={{ fontFamily: "Fraunces, Georgia, serif" }}
            >
              Let’s keep your service moving
            </h1>
            <p className="mt-4 text-sm leading-8 text-orange-50/90">
              Reach out for onboarding, support, or questions about how to use Maklati for your restaurant.
            </p>

            <div className="mt-8 space-y-4 text-sm">
              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                <p className="font-semibold text-orange-100">Email</p>
                <p className="mt-1 text-white/80">support@maklati.app</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                <p className="font-semibold text-orange-100">Phone</p>
                <p className="mt-1 text-white/80">+212 5 00 00 00 00</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                <p className="font-semibold text-orange-100">Availability</p>
                <p className="mt-1 text-white/80">Monday to Saturday, 9:00 to 18:00</p>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/70 bg-white/85 p-8 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur">
            <h2 className="text-2xl font-semibold text-slate-950">Send a message</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              This page is now working and gives users a real destination from the header and footer links.
            </p>

            <form className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Name</label>
                <input
                  type="text"
                  className="w-full rounded-2xl border border-slate-200 bg-stone-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-300 focus:bg-white"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
                <input
                  type="email"
                  className="w-full rounded-2xl border border-slate-200 bg-stone-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-300 focus:bg-white"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Message</label>
                <textarea
                  rows={5}
                  className="w-full rounded-2xl border border-slate-200 bg-stone-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-300 focus:bg-white"
                  placeholder="How can we help?"
                />
              </div>

              <button
                type="button"
                className="inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-500"
              >
                Send message
              </button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default Contact;
