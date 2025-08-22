import { Snack } from "@/interfaces/snack";
import CenteredImageCard from "@/components/ui/profilecard";
import React, { useEffect, useState } from "react";

function Menu() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Snack[]>([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Snack[]>([
    { name: "snack 1", image: "/snack1.png" },
    { name: "snack 2", image: "/snack2.jpg" },
    { name: "snack 3", image: "/snack3.avif" },
    { name: "snack 4", image: "/snack4.png" },
  ]);
  const [fetchUrl, setFetchUrl] = useState("");

  // Fetch depuis une API si URL présente
  useEffect(() => {
    const fetchData = async () => {
      if (!fetchUrl || query.trim() === "") {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`${fetchUrl}?q=${query}`);
        const json = await response.json();
        setResults(json);
      } catch (err) {
        console.error("Error fetching data:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };
    console.log(filteredData);

    const debounceTimeout = setTimeout(fetchData, 300); // Debounce
    return () => clearTimeout(debounceTimeout);
  }, [query, fetchUrl]);

  // Recherche dans la liste locale
  const filteredData = !fetchUrl
    ? data.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      )
    : results;

  return (
    <div className="pt-10">
      <h1 className="text-center text-4xl mb-4">Snacks</h1>
      <div className="w-[30%] m-auto flex gap-1  justify-center items-center">
        <input
          type="text"
          placeholder={"search by name"}
          className="w-full px-4 py-2 border border-white rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
          <svg className="w-4 h-4 text-black" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
      </div>
      <div className="flex gap-2 md:w-[80%] flex-wrap justify-center  m-auto p-3">
        {filteredData.map((snack, index) => (
          <div className="cursor-pointer">
            <CenteredImageCard
              key={index}
              img={snack.image}
              name={snack.name}
              bio="menu variable avec plein de categori là'dans , pizza, tacos, boissons et beaucoup plus"
              skills={[]}
              githubUrl={undefined}
              twitterUrl={undefined}
              position="Berkane centre ville"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Menu;
