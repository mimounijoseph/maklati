import React from "react";
import Layout from "../core/layout";

function About() {
  return (
    <Layout>
      <section
        className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:px-8"
        style={{ fontFamily: "Sora, ui-sans-serif, system-ui, sans-serif" }}
      >
        <div className="overflow-hidden rounded-[32px] border border-white/70 bg-white/80 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="bg-[linear-gradient(135deg,#0f172a_0%,#7c2d12_55%,#f97316_100%)] px-6 py-10 text-white sm:px-10">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-orange-200">
              About Maklati
            </p>
            <h1
              className="mt-3 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl"
              style={{ fontFamily: "Fraunces, Georgia, serif" }}
            >
              A better way to present and manage restaurant menus
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-8 text-orange-50/90 sm:text-base">
              Maklati helps restaurants move from static menus to a digital experience that feels cleaner, faster, and easier for both customers and staff.
            </p>
          </div>

          <div className="grid gap-6 px-6 py-8 sm:px-10 lg:grid-cols-3">
            <article className="rounded-[26px] border border-orange-100 bg-orange-50/70 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-orange-500">Mission</p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-950">Simple ordering</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Give customers a direct menu flow from scan to order without clutter.
              </p>
            </article>

            <article className="rounded-[26px] border border-slate-200 bg-white p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-orange-500">For admins</p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-950">Fast control</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Update snack details, plats, and categories from one dashboard with minimal friction.
              </p>
            </article>

            <article className="rounded-[26px] border border-slate-200 bg-white p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-orange-500">For guests</p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-950">Modern menu feel</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Mobile-first pages, clear categories, and smoother ordering make the menu easier to browse.
              </p>
            </article>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default About;
