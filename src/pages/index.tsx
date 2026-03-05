"use client";

import Layout from "./core/layout";
import { MorphoTextFlip } from "@/components/ui/morphotextflip";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import "@/i18n.client";
import Link from "next/link";

const featureCards = [
  {
    title: "Faster table turnover",
    body: "Guests scan, browse, and order with less waiting time, so your service team can focus on delivery instead of repeating the menu.",
    metric: "-32%",
    metricLabel: "waiting friction",
  },
  {
    title: "Cleaner menu operations",
    body: "Update plats, prices, categories, and availability from one admin dashboard without reprinting menus or sending staff to every table.",
    metric: "1 panel",
    metricLabel: "for edits and control",
  },
  {
    title: "Better guest confidence",
    body: "Customers see clear categories, visuals, live order status, and a smooth mobile flow that feels more modern and more trustworthy.",
    metric: "+24%",
    metricLabel: "perceived service quality",
  },
];

const statCards = [
  { label: "Menu updates", value: "Instant", detail: "Change a plat once and every table sees it." },
  { label: "Order visibility", value: "Live", detail: "Track incoming orders and status changes in real time." },
  { label: "Customer access", value: "QR first", detail: "No app install needed for guests to start ordering." },
  { label: "Admin control", value: "Centralized", detail: "Products, snack details, notifications, and analytics in one place." },
];

const comparisonRows = [
  {
    label: "Updating prices and plats",
    oldWay: "Reprint menus or explain changes manually",
    maklatiWay: "Edit once from the dashboard and publish instantly",
  },
  {
    label: "Taking table orders",
    oldWay: "Wait for staff to come back and note items",
    maklatiWay: "Customers scan and order directly from their phones",
  },
  {
    label: "Following service progress",
    oldWay: "Customers ask staff where the order is",
    maklatiWay: "Live status tracking keeps the guest informed",
  },
  {
    label: "Launching a polished digital experience",
    oldWay: "Custom build, multiple tools, unclear workflow",
    maklatiWay: "One system for QR, menu, ordering, and admin control",
  },
];

const executiveNotes = [
  "Reduce repetitive staff questions by making the menu self-explanatory and visual.",
  "Create a more premium perception of the restaurant without adding friction for guests.",
  "Give managers a direct view of orders, status changes, and menu performance in one workflow.",
];

export default function Home() {
  const { t, i18n } = useTranslation("common");

  const words = useMemo(() => {
    const arr = t("hero.words", { returnObjects: true }) as string[];
    return Array.isArray(arr) ? arr : [];
  }, [t, i18n.language]);

  return (
    <Layout>
      <div
        className="min-h-screen bg-[radial-gradient(circle_at_top,#fff2e2_0%,#fff7ed_24%,#ffffff_58%,#f4f4f5_100%)] text-slate-950"
        style={{ fontFamily: "Sora, ui-sans-serif, system-ui, sans-serif" }}
      >
        <section className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8 lg:pb-24 lg:pt-14">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-2xl">
              <div className="mb-6 inline-flex items-center rounded-full border border-orange-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-orange-600 shadow-[0_12px_30px_rgba(249,115,22,0.08)] backdrop-blur">
                Restaurant growth platform
              </div>

              <h1
                className="max-w-3xl text-5xl font-semibold leading-[0.95] tracking-[-0.05em] text-slate-950 sm:text-6xl lg:text-7xl"
                style={{ fontFamily: "Fraunces, Georgia, serif" }}
              >
                {t("hero.title_line1")}
                <span className="block text-orange-500">{t("hero.title_line2")}</span>
              </h1>

              <div className="mt-6">
                <MorphoTextFlip
                  words={words}
                  textClassName="text-2xl sm:text-4xl font-semibold tracking-[-0.04em] text-slate-700"
                  animationType="flipY"
                />
              </div>

              <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
                Maklati helps restaurant leaders deliver a cleaner customer journey, reduce menu friction, and move from static paper menus to a responsive ordering system that feels premium on every table.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/snack"
                  className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-[0_20px_45px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 hover:bg-orange-500"
                >
                  {t("hero.cta")}
                </Link>
                <Link
                  href="/admin/auth/register"
                  className="inline-flex items-center justify-center rounded-full border border-orange-200 bg-white/85 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-orange-300 hover:bg-orange-50"
                >
                  Start your restaurant workspace
                </Link>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="rounded-[24px] border border-white/80 bg-white/75 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.28em] text-orange-500">Experience</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">Modern ordering</p>
                </div>
                <div className="rounded-[24px] border border-white/80 bg-white/75 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.28em] text-orange-500">Control</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">Live admin view</p>
                </div>
                <div className="rounded-[24px] border border-white/80 bg-white/75 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.28em] text-orange-500">Guests</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">Smoother satisfaction</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-10 top-12 hidden h-28 w-28 rounded-full bg-orange-300/25 blur-3xl lg:block" />
              <div className="absolute -right-6 bottom-6 hidden h-36 w-36 rounded-full bg-slate-300/20 blur-3xl lg:block" />

              <div className="grid gap-5">
                <div className="relative overflow-hidden rounded-[34px] border border-white/70 bg-slate-950 shadow-[0_30px_90px_rgba(15,23,42,0.2)]">
                  <img
                    src="https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1200"
                    alt="Restaurant team using digital ordering"
                    className="absolute inset-0 h-full w-full object-cover opacity-35"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(15,23,42,0.94)_0%,rgba(124,45,18,0.8)_56%,rgba(249,115,22,0.58)_100%)]" />
                  <div className="relative p-6 sm:p-8">
                    <div className="rounded-[26px] border border-white/10 bg-white/10 p-5 backdrop-blur-md">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.28em] text-orange-200">Maklati Flow</p>
                          <h2 className="mt-2 text-2xl font-semibold text-white">From scan to fulfilled order</h2>
                        </div>
                        <div className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white">
                          QR + Live updates
                        </div>
                      </div>

                      <div className="mt-6 space-y-4">
                        <div className="rounded-2xl bg-white/10 p-4">
                          <p className="text-sm font-medium text-orange-100">1. Guests scan and open the menu fast</p>
                          <p className="mt-1 text-sm text-white/75">No app installation, no waiting for paper menus, no confusion at the table.</p>
                        </div>
                        <div className="rounded-2xl bg-white/10 p-4">
                          <p className="text-sm font-medium text-orange-100">2. Orders arrive with less friction</p>
                          <p className="mt-1 text-sm text-white/75">Selections, quantities, and order review stay clear on mobile.</p>
                        </div>
                        <div className="rounded-2xl bg-white/10 p-4">
                          <p className="text-sm font-medium text-orange-100">3. The admin dashboard keeps service moving</p>
                          <p className="mt-1 text-sm text-white/75">Notifications, order status, and menu updates stay centralized.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="overflow-hidden rounded-[30px] border border-white/80 bg-white/80 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
                    <img
                      src="https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg?auto=compress&cs=tinysrgb&w=1200"
                      alt="Restaurant manager reviewing performance"
                      className="h-40 w-full object-cover"
                    />
                    <div className="p-5">
                      <p className="text-xs uppercase tracking-[0.28em] text-orange-500">For managers</p>
                      <p className="mt-2 text-lg font-semibold text-slate-950">Sharper operational visibility</p>
                    </div>
                  </div>

                  <div className="rounded-[30px] border border-white/80 bg-white/80 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
                    <p className="text-xs uppercase tracking-[0.28em] text-orange-500">Service pulse</p>
                    <p className="mt-2 text-lg font-semibold text-slate-950">A simple visual snapshot</p>
                    <div className="mt-5 space-y-4">
                      <div>
                        <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                          <span>Order clarity</span>
                          <span>92%</span>
                        </div>
                        <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                          <div className="h-full w-[92%] rounded-full bg-gradient-to-r from-orange-400 to-orange-500" />
                        </div>
                      </div>
                      <div>
                        <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                          <span>Admin control</span>
                          <span>88%</span>
                        </div>
                        <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                          <div className="h-full w-[88%] rounded-full bg-gradient-to-r from-slate-700 to-slate-900" />
                        </div>
                      </div>
                      <div>
                        <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                          <span>Guest satisfaction</span>
                          <span>94%</span>
                        </div>
                        <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                          <div className="h-full w-[94%] rounded-full bg-gradient-to-r from-amber-300 to-orange-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map((item) => (
              <article
                key={item.label}
                className="rounded-[28px] border border-white/80 bg-white/85 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur"
              >
                <p className="text-xs uppercase tracking-[0.26em] text-slate-400">{item.label}</p>
                <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950">{item.value}</p>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">Why restaurant leaders care</p>
            <h2
              className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl"
              style={{ fontFamily: "Fraunces, Georgia, serif" }}
            >
              Built to improve both operations and guest perception
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
              Maklati is not only a menu page. It is a digital service layer that helps restaurants present themselves better, react faster, and reduce the points where customers usually get frustrated.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {featureCards.map((feature) => (
              <article
                key={feature.title}
                className="rounded-[28px] border border-white/80 bg-white/80 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="h-11 w-11 rounded-2xl bg-orange-100" />
                  <div className="rounded-2xl bg-slate-950 px-3 py-2 text-right text-white">
                    <p className="text-lg font-semibold">{feature.metric}</p>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-white/55">{feature.metricLabel}</p>
                  </div>
                </div>
                <h3 className="mt-5 text-xl font-semibold text-slate-950">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{feature.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[34px] border border-white/80 bg-slate-950 p-6 text-white shadow-[0_28px_80px_rgba(15,23,42,0.18)] sm:p-8">
              <p className="text-xs uppercase tracking-[0.28em] text-orange-300">Executive view</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">What restaurant leaders gain</h2>
              <p className="mt-4 text-sm leading-7 text-white/70">
                The best digital guest experience is the one that also reduces operational noise. Maklati gives decision-makers a simpler menu workflow, a cleaner service flow, and a stronger brand impression at the table.
              </p>
              <div className="mt-6 space-y-4">
                {executiveNotes.map((note) => (
                  <div key={note} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm leading-7 text-white/78">
                    {note}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[34px] border border-white/80 bg-white/85 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-6">
              <div className="overflow-hidden rounded-[26px] border border-slate-100">
                <img
                  src="https://images.pexels.com/photos/696218/pexels-photo-696218.jpeg?auto=compress&cs=tinysrgb&w=1400"
                  alt="Guests enjoying a restaurant experience"
                  className="h-64 w-full object-cover sm:h-80"
                />
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[24px] bg-stone-50 p-5">
                  <p className="text-xs uppercase tracking-[0.26em] text-slate-400">Customer impact</p>
                  <p className="mt-2 text-xl font-semibold text-slate-950">Less waiting, more clarity</p>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    Guests see plats, categories, order review, and status tracking without needing staff for every small question.
                  </p>
                </div>
                <div className="rounded-[24px] bg-orange-50 p-5">
                  <p className="text-xs uppercase tracking-[0.26em] text-orange-500">Brand impact</p>
                  <p className="mt-2 text-xl font-semibold text-slate-950">A more premium impression</p>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    A modern digital flow makes the restaurant feel more organized, more current, and more intentional.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="rounded-[36px] border border-white/80 bg-white/88 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-8">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">Comparison</p>
              <h2
                className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl"
                style={{ fontFamily: "Fraunces, Georgia, serif" }}
              >
                Old menu workflow vs Maklati
              </h2>
            </div>

            <div className="grid gap-4">
              {comparisonRows.map((row) => (
                <div
                  key={row.label}
                  className="grid gap-4 rounded-[24px] border border-slate-100 bg-white p-5 md:grid-cols-[0.9fr_1fr_1fr]"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-950">{row.label}</p>
                  </div>
                  <div className="rounded-[20px] bg-rose-50 px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-rose-500">Traditional</p>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{row.oldWay}</p>
                  </div>
                  <div className="rounded-[20px] bg-emerald-50 px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-emerald-600">Maklati</p>
                    <p className="mt-2 text-sm leading-7 text-slate-700">{row.maklatiWay}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
          <div className="grid gap-6 rounded-[36px] border border-white/70 bg-[linear-gradient(135deg,#0f172a_0%,#1f2937_40%,#9a3412_100%)] p-6 text-white shadow-[0_30px_90px_rgba(15,23,42,0.18)] sm:p-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-orange-300">Ready to launch</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">
                Show your guests a better ordering experience and give your team better control.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-8 text-white/75 sm:text-base">
                Maklati helps restaurants move faster, look sharper, and create a more satisfying service journey for every table. Start with your snack page, products, and QR flow, then manage the operation from the dashboard.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/admin/auth/register"
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-orange-50"
                >
                  Create admin account
                </Link>
                <Link
                  href="/snack"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                >
                  Explore restaurants
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[28px] border border-white/10 bg-white/10 p-5 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.24em] text-white/50">Customers</p>
                <p className="mt-2 text-xl font-semibold">Clearer ordering journey</p>
                <p className="mt-3 text-sm leading-7 text-white/72">
                  Browse, select, review, and track the order without confusion.
                </p>
              </div>
              <div className="rounded-[28px] border border-white/10 bg-white/10 p-5 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.24em] text-white/50">Restaurant</p>
                <p className="mt-2 text-xl font-semibold">More controlled operations</p>
                <p className="mt-3 text-sm leading-7 text-white/72">
                  Edit the menu, respond to orders, and keep visibility on service status.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
