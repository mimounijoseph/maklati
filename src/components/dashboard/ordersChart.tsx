"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/config/firebase";

const OrdersChart = () => {
  const [totalOrders, setTotalOrders] = useState<number>(0);

  useEffect(() => {
    const fetchDataAndRenderChart = async () => {
      const ordersQuery = query(
        collection(db, "orders"),
        orderBy("date", "asc")
      );
      const snapshot = await getDocs(ordersQuery);
      if (snapshot.empty) return;

      let total = 0;
      const ordersByDate: Record<string, number> = {};

      snapshot.forEach((doc) => {
        const data = doc.data();
        let date: Date;

        if (data.date?.seconds) {
          date = new Date(data.date.seconds * 1000);
        } else {
          date = new Date(data.date);
        }

        total += 1;

        const dayStr = date.toISOString().split("T")[0]; // YYYY-MM-DD
        ordersByDate[dayStr] = (ordersByDate[dayStr] || 0) + 1;
      });

      setTotalOrders(total);

      // Convert to chart data sorted by date with formatted labels
      const seriesData = Object.keys(ordersByDate)
        .sort()
        .map((dayStr) => {
          const date = new Date(dayStr);
          const formatted = date.toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short", // e.g. "09 Aug"
          });
          return { x: formatted, y: ordersByDate[dayStr] };
        });

      const ApexCharts = (await import("apexcharts")).default;

      const options = {
        chart: {
          type: "area",
          height: 200,
          width: "100%",
          fontFamily: "Inter, sans-serif",
          toolbar: { show: false },
          animations: { enabled: true, easing: "easeout", speed: 600 },
        },
        series: [
          {
            name: "Orders",
            data: seriesData,
          },
        ],
        stroke: { curve: "smooth", width: 3 },
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.3,
            opacityTo: 0,
            stops: [0, 90, 100],
            colorStops: [
              { offset: 0, color: "#8B5CF6", opacity: 0.5 },
              { offset: 100, color: "#8B5CF6", opacity: 0 },
            ],
          },
        },
        xaxis: {
          type: "category",
          labels: {
            style: { fontSize: "12px", colors: "#9CA3AF" },
          },
          axisBorder: { show: false },
          axisTicks: { show: false },
        },
        yaxis: {
          min: 0,
          labels: { style: { fontSize: "12px", colors: "#9CA3AF" } },
        },
        grid: { show: true, borderColor: "#E5E7EB", strokeDashArray: 3 },
        tooltip: { enabled: false },
        markers: { size: 0 },
        legend: { show: false },
      };

      const chartEl = document.getElementById("orders-chart");
      if (chartEl) {
        chartEl.innerHTML = ""; // clear before render
        const chart = new ApexCharts(chartEl, options);
        chart.render();
      }
    };

    fetchDataAndRenderChart();
  }, []);

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex justify-between mb-2">
        <div>
          <h5 className="text-3xl font-bold text-gray-900">{totalOrders}</h5>
          <p className="text-sm text-gray-500">Orders Over Time</p>
        </div>
        <a href="#" className="text-sm font-medium text-blue-600">
          View report
        </a>
      </div>
      <div id="orders-chart" className="w-full h-48"></div>
    </div>
  );
};

export default OrdersChart;
