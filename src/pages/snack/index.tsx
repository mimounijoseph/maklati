"use client";

import { Snack } from "@/interfaces/snack";
import React, { useEffect, useMemo, useState } from "react";
import Layout from "../core/layout";
import { SnackService } from "@/services/snack";
import { Loader } from "@/components/ui/loader";
import { useTranslation } from "react-i18next";
import Link from "next/link";

const snackService = new SnackService();

function Menu() {
  const { t } = useTranslation("common");
  const [query, setQuery] = useState("");
  const [data, setData] = useState<Snack[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchSnacks() {
    try {
      const response = await snackService.getAll();
      setData(response || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSnacks();
  }, []);

  const filteredData = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return data;
    }

    return data.filter((item) => {
      const name = item.name?.toLowerCase?.() || "";
      const address = item.address?.toLowerCase?.() || "";
      const description = item.description?.toLowerCase?.() || "";

      return (
        name.includes(normalizedQuery) ||
        address.includes(normalizedQuery) ||
        description.includes(normalizedQuery)
      );
    });
  }, [data, query]);

  if (loading) {
    return (
      <Layout>
        <div className="flex h-[60vh] items-center justify-center">
          <Loader>
            <span className="text-black dark:text-white">{t("menuPage.loading")}</span>
          </Loader>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div
        className="min-h-screen bg-[radial-gradient(circle_at_top,#fff2e2_0%,#fff7ed_24%,#ffffff_58%,#f5f5f4_100%)]"
        style={{ fontFamily: "Sora, ui-sans-serif, system-ui, sans-serif" }}
      >
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
          <section className="relative overflow-hidden rounded-[34px] border border-white/70 bg-slate-950 text-white shadow-[0_30px_90px_rgba(15,23,42,0.18)]">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(15,23,42,0.96)_0%,rgba(124,45,18,0.84)_56%,rgba(249,115,22,0.64)_100%)]" />
            <div className="relative px-6 py-10 sm:px-8 lg:px-10">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-orange-200">
                Restaurant browser
              </p>
              <h1
                className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl"
                style={{ fontFamily: "Fraunces, Georgia, serif" }}
              >
                {t("menuPage.title")}
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-8 text-orange-50/90 sm:text-base">
                Browse all restaurants, search by name or area, then open the menu of the restaurant you want to order from.
              </p>

              <div className="mt-8 max-w-2xl">
                <div className="flex items-center gap-3 rounded-[24px] border border-white/10 bg-white/12 px-4 py-3 shadow-[0_16px_35px_rgba(15,23,42,0.14)] backdrop-blur-md">
                  <svg
                    className="h-5 w-5 shrink-0 text-orange-200"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder={t("menuPage.search_placeholder")}
                    className="w-full bg-transparent text-sm text-white placeholder:text-orange-100/70 outline-none"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    aria-label={t("menuPage.search_placeholder")}
                  />
                </div>
              </div>
            </div>
          </section>

          <div className="mt-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">
                Available now
              </p>
              <h2
                className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950"
                style={{ fontFamily: "Fraunces, Georgia, serif" }}
              >
                Pick a restaurant
              </h2>
            </div>
            <p className="text-sm text-slate-500">
              {filteredData.length} restaurant{filteredData.length === 1 ? "" : "s"}
            </p>
          </div>

          {filteredData.length === 0 ? (
            <div className="mt-8 rounded-[28px] border border-dashed border-orange-200 bg-white/80 px-6 py-16 text-center shadow-[0_20px_50px_rgba(15,23,42,0.06)] backdrop-blur">
              <p
                className="text-3xl font-semibold tracking-[-0.03em] text-slate-900"
                style={{ fontFamily: "Fraunces, Georgia, serif" }}
              >
                {t("menuPage.empty")}
              </p>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-500">
                Try another restaurant name or location.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredData.map((snack) => (
                <Link
                  key={snack.id}
                  href={`/snack/${snack.id}`}
                  className="group overflow-hidden rounded-[28px] border border-white/70 bg-white/85 shadow-[0_18px_50px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_70px_rgba(15,23,42,0.14)]"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={snack.image || "/images.jpg"}
                      alt={snack.name || "Restaurant"}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.06)_0%,rgba(15,23,42,0.62)_100%)]" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.28em] text-orange-100">
                          Restaurant
                        </p>
                        <h3 className="mt-1 text-2xl font-semibold text-white">
                          {snack.name}
                        </h3>
                      </div>
                      <div className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                        Open menu
                      </div>
                    </div>
                  </div>

                  <div className="p-5">
                    <p className="line-clamp-3 text-sm leading-7 text-slate-600">
                      {snack.description}
                    </p>

                    <div className="mt-5 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.28em] text-orange-500">
                          Address
                        </p>
                        <p className="mt-1 text-sm font-medium text-slate-900">
                          {snack.address || "No address provided"}
                        </p>
                      </div>

                      <span className="inline-flex items-center rounded-full bg-orange-50 px-3 py-2 text-xs font-semibold text-orange-600 transition group-hover:bg-orange-500 group-hover:text-white">
                        View menu
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Menu;
