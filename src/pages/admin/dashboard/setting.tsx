"use client";

import { useState } from "react";
import { db } from "@/config/firebase";
import { collection, addDoc } from "firebase/firestore";

const categories = [
  { name: "Salads & Soups", icon: "🥗 " },
  { name: "Traditional Dishes", icon: "🍗 " },
  { name: "Sandwiches & Burgers", icon: "🍔 " },
  { name: "Pizzas & Pastas", icon: "🍕 " },
  { name: "Fish & Seafood", icon: "🐟 " },
  { name: "Side Dishes", icon: "🍟 " },
  { name: "Desserts", icon: "🍰 " },
  { name: "Hot Drinks", icon: "☕ " },
  { name: "Cold Drinks", icon: "🥤 " },
];

export default function SeedCategories() {
  const [status, setStatus] = useState<string | null>(null);

  const seedData = async () => {
    try {
      const colRef = collection(db, "categories");

      for (const cat of categories) {
        await addDoc(colRef, cat);
      }

      setStatus("✅ Categories added successfully!");
    } catch (error) {
      console.error("Error seeding categories:", error);
      setStatus("❌ Failed to add categories.");
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={seedData}
        className="px-4 py-2 bg-green-600 text-white rounded-md shadow"
      >
        Seed Categories
      </button>

      {status && <p className="mt-2">{status}</p>}
    </div>
  );
}
