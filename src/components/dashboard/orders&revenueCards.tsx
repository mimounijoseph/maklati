"use client";

import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/config/firebase";

const RevenueOrdersCards = () => {
  const [todayOrders, setTodayOrders] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "orders"), (querySnapshot) => {
      let totalOrdersCount = 0;
      let totalRevenueSum = 0;
      let todayOrdersCount = 0;
      let todayRevenueSum = 0;

      const today = new Date();

      querySnapshot.forEach((doc) => {
        const data = doc.data();

        totalOrdersCount++;
        totalRevenueSum += Number(data.total) || 0;

        // Pick createdAt or fallback to date
        const timestamp = data.createdAt || data.date;
        if (timestamp) {
          const orderDate =
            typeof timestamp.toDate === "function"
              ? timestamp.toDate()
              : new Date(timestamp);

          if (
            orderDate.getDate() === today.getDate() &&
            orderDate.getMonth() === today.getMonth() &&
            orderDate.getFullYear() === today.getFullYear()
          ) {
            todayOrdersCount++;
            todayRevenueSum += Number(data.total) || 0;
          }
        }
      });

      setTotalOrders(totalOrdersCount);
      setTotalRevenue(totalRevenueSum);
      setTodayOrders(todayOrdersCount);
      setTodayRevenue(todayRevenueSum);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  const cards = [
    { title: "Today Orders", value: todayOrders },
    { title: "Total Orders", value: totalOrders },
    { title: "Today Revenue", value: `$${todayRevenue}` },
    { title: "Total Revenue", value: `$${totalRevenue}` },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="flex flex-col justify-center items-start p-6 bg-white rounded-lg shadow-sm border border-gray-20 hover:shadow-lg transition"
        >
          <p className="text-sm text-gray-500">{card.title}</p>
          <h3 className="mt-2 text-2xl font-semibold text-gray-900">
            {card.value}
          </h3>
        </div>
      ))}
    </div>
  );
};

export default RevenueOrdersCards;
