"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";

function Footer() {
  const { t } = useTranslation("common");

  return (
    <footer
      className="mt-16 bg-[linear-gradient(180deg,#0f172a_0%,#1c1917_100%)] text-white"
      style={{ fontFamily: "Sora, ui-sans-serif, system-ui, sans-serif" }}
    >
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-8 rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur sm:p-10 lg:grid-cols-[1.3fr_0.8fr_0.9fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-orange-300">
              Digital menu experience
            </p>
            <h2
              className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-white"
              style={{ fontFamily: "Fraunces, Georgia, serif" }}
            >
              {t("footer.brand")}
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-8 text-white/70">
              {t("footer.description")}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-medium text-orange-100">
                QR-ready ordering
              </span>
              <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-medium text-orange-100">
                Admin dashboard
              </span>
              <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-medium text-orange-100">
                Mobile-first menu
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-orange-300">
              {t("footer.quick_links")}
            </h3>
            <ul className="mt-5 space-y-3">
              <li>
                <Link href="/" className="text-sm text-white/75 transition hover:text-orange-300">
                  {t("footer.links.home")}
                </Link>
              </li>
              <li>
                <Link href="/snack" className="text-sm text-white/75 transition hover:text-orange-300">
                  {t("footer.links.snacks")}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-white/75 transition hover:text-orange-300">
                  {t("footer.links.about")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-white/75 transition hover:text-orange-300">
                  {t("footer.links.contact")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-orange-300">
              {t("footer.follow_us")}
            </h3>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href="#" className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/75 transition hover:border-orange-300 hover:text-orange-300">
                {t("footer.socials.facebook")}
              </a>
              <a href="#" className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/75 transition hover:border-orange-300 hover:text-orange-300">
                {t("footer.socials.instagram")}
              </a>
              <a href="#" className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/75 transition hover:border-orange-300 hover:text-orange-300">
                {t("footer.socials.tiktok")}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-white/55 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {t("footer.brand")}. {t("footer.copyright")}
          </p>

          <div className="flex flex-wrap gap-4">
            <a href="/conditions" className="transition hover:text-orange-300">
              {t("footer.legal.terms")}
            </a>
            <a href="/confidentialite" className="transition hover:text-orange-300">
              {t("footer.legal.privacy")}
            </a>
            <a href="/mentions-legales" className="transition hover:text-orange-300">
              {t("footer.legal.mentions")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
