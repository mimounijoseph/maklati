"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase";

const RevenueOrdersCards = () => {
  const [todayOrders, setTodayOrders] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "orders"));
      let totalOrdersCount = 0;
      let totalRevenueSum = 0;
      let todayOrdersCount = 0;
      let todayRevenueSum = 0;

      const today = new Date();
      const todayDate = today.toISOString().split("T")[0]; // YYYY-MM-DD

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const orderDate = data.createdAt?.toDate(); // Firestore Timestamp → Date
        const orderDateString = orderDate?.toISOString().split("T")[0];

        totalOrdersCount++;
        totalRevenueSum += data.total || 0;

        if (orderDateString === todayDate) {
          todayOrdersCount++;
          todayRevenueSum += data.total || 0;
        }
      });

      setTotalOrders(totalOrdersCount);
      setTotalRevenue(totalRevenueSum);
      setTodayOrders(todayOrdersCount);
      setTodayRevenue(todayRevenueSum);
    };

    fetchData();
  }, []);

  const cards = [
    { title: "Today Orders", value: todayOrders },
    { title: "Total Orders", value: totalOrders },
    { title: "Today Revenue", value: `$${todayRevenue}` },
    { title: "Total Revenue", value: `$${totalRevenue}` },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="flex flex-col justify-center items-start p-6 bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition"
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
