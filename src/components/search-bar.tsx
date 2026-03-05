"use client";

import React, { useState, useEffect } from "react";

interface Item {
  id?: number;
  name: string;
  image:string
}

interface SearchBarProps {
  data?: Item[]; // Liste locale optionnelle
  fetchUrl?: string; // URL d'une API distante
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ data = [], fetchUrl, placeholder = "Search..." }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);



  return (
    <div className="max-w-md mx-auto mt-10">
      <input
        type="text"
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {loading && (
        <div className="text-center text-sm text-gray-500 mt-2">Loading...</div>
      )}
{/* 
      <ul className="mt-4 space-y-2">
        {filteredData.length > 0 ? (
          filteredData.map((item) => (
            <li
              key={item.id}
              className="px-4 py-2 border rounded-md bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              {item.name}
            </li>
          ))
        ) : (
          query && !loading && (
            <li className="text-center text-sm text-gray-500">No results found.</li>
          )
        )}
      </ul> */}
    </div>
  );
};

export default SearchBar;
