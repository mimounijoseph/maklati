"use client";

import React from "react";
import { useTranslation } from "react-i18next";

function Footer() {
  const { t } = useTranslation("common");

  return (
    <footer className="bg-amber-500 text-white mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section principale */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10">
          {/* Logo + description */}
          <div>
            <h1
              className="text-2xl font-bold"
              style={{ fontFamily: "Sacramento" }}
            >
              {t("footer.brand")}
            </h1>
            <p className="mt-3 text-sm text-gray-200">
              {t("footer.description")}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-lg font-semibold mb-3">
              {t("footer.quick_links")}
            </h2>
            <ul className="space-y-2">
              <li>
                <a href="/" className="hover:text-yellow-300">
                  {t("footer.links.home")}
                </a>
              </li>
              <li>
                <a href="/snack" className="hover:text-yellow-300">
                  {t("footer.links.snacks")}
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-yellow-300">
                  {t("footer.links.about")}
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-yellow-300">
                  {t("footer.links.contact")}
                </a>
              </li>
            </ul>
          </div>

          {/* Réseaux sociaux */}
          <div>
            <h2 className="text-lg font-semibold mb-3">
              {t("footer.follow_us")}
            </h2>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-yellow-300">
                {t("footer.socials.facebook")}
              </a>
              <a href="#" className="hover:text-yellow-300">
                {t("footer.socials.instagram")}
              </a>
              <a href="#" className="hover:text-yellow-300">
                {t("footer.socials.tiktok")}
              </a>
            </div>
          </div>
        </div>

        {/* Ligne en bas */}
        <div className="border-t border-red-500 py-4 text-center text-sm text-gray-200">
          <p>
            © {new Date().getFullYear()} {t("footer.brand")}.{" "}
            {t("footer.copyright")}
          </p>
          <div className="mt-2 space-x-4">
            <a
              href="/conditions"
              className="hover:underline text-gray-200"
            >
              {t("footer.legal.terms")}
            </a>
            <a
              href="/confidentialite"
              className="hover:underline text-gray-200"
            >
              {t("footer.legal.privacy")}
            </a>
            <a
              href="/mentions-legales"
              className="hover:underline text-gray-200"
            >
              {t("footer.legal.mentions")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;