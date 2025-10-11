"use client";
import { Snack } from "@/interfaces/snack";
import CenteredImageCard from "@/components/ui/profilecard";
import React, { useEffect, useMemo, useState } from "react";
import Layout from "../core/layout";
import { SnackService } from "@/services/snack";
import { Loader } from "@/components/ui/loader";
import { useTranslation } from "react-i18next";

const snackService = new SnackService();
function Menu() {
  const { t } = useTranslation("common");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Snack[]>([]);
  const [data, setData] = useState<Snack[]>([]);
  const [fetchUrl, setFetchUrl] = useState("");
  const [loading, setLoading] = useState(true);
  
  async function fetchSnacks() {
    try {
      const response = await snackService.getAll();
      setData(response);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSnacks();
  }, []);

  const filteredData = useMemo(() => {
    if (fetchUrl) return results;
    const q = query.trim().toLowerCase();
    if (!q) return data;
    return data.filter((item) => item.name?.toLowerCase().includes(q));
  }, [data, results, fetchUrl, query]);

  if (loading) {
    return (
      <Layout>
        <div className="h-[60vh] flex justify-center items-center">
          <Loader>
            <span className="text-black dark:text-white">
              {t("menuPage.loading")}
            </span>
          </Loader>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pt-10">
        <h1 className="text-center text-4xl mb-4">{t("menuPage.title")}</h1>

        <div className="w-full md:w-[30%] mx-auto flex gap-2 justify-center items-center px-3">
          <input
            type="text"
            placeholder={t("menuPage.search_placeholder")}
            className="w-full px-4 py-2 border border-white rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label={t("menuPage.search_placeholder")}
          />
          <svg
            className="w-5 h-5 text-black shrink-0"
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
        </div>

        {filteredData.length === 0 ? (
          <p className="text-center text-slate-700 mt-8">{t("menuPage.empty")}</p>
        ) : (
          <div className="flex gap-2 md:w-[80%] flex-wrap justify-center m-auto p-3">
            {filteredData.map((snack) => (
              <div className="cursor-pointer" key={snack.id}>
                <CenteredImageCard
                  id={snack.id}
                  img={snack.image}
                  name={snack.name}
                  bio={snack.description}
                  skills={[]}
                  githubUrl={undefined}
                  twitterUrl={undefined}
                  position={snack.address}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Menu;