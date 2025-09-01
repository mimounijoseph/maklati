"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/config/firebase";

const OrdersChart = () => {
  const [totalOrders, setTotalOrders] = useState<number>(0);

  useEffect(() => {
    const fetchDataAndRenderChart = async () => {
      const ordersQuery = query(collection(db, "orders"), orderBy("date", "asc"));
      const snapshot = await getDocs(ordersQuery);

      let total = 0;
      const seriesData: { x: number; y: number }[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        let date: Date;

        if (data.date?.seconds) {
          date = new Date(data.date.seconds * 1000);
        } else {
          date = new Date(data.date);
        }

        total += 1;

        // Push the order as a point in time
        seriesData.push({
          x: date.getTime(), // timestamp (ms)
          y: 1,              // always 1 order per event
        });
      });

      setTotalOrders(total);

      const ApexCharts = (await import("apexcharts")).default;

      const options = {
        chart: {
          type: "area",
          height: 180,
          width: "100%",
          fontFamily: "Inter, sans-serif",
          toolbar: { show: false },
        },
        series: [
          {
            name: "Orders",
            data: seriesData,
            color: "#8B5CF6", // purple like Shopify
          },
        ],
        xaxis: {
          type: "datetime",
          labels: {
            datetimeUTC: false,
            style: {
              fontFamily: "Inter, sans-serif",
              cssClass: "text-xs font-normal fill-gray-500 dark:fill-gray-400",
            },
          },
          axisBorder: { show: false },
          axisTicks: { show: false },
        },
        yaxis: {
          min: 0,
          max: 10, // always fixed from 0 → 10
          tickAmount: 5,
          labels: {
            formatter: (val: number) => `${val}`,
            style: {
              fontFamily: "Inter, sans-serif",
              cssClass: "text-xs font-normal fill-gray-500 dark:fill-gray-400",
            },
          },
        },
        stroke: { width: 2 },
        fill: {
          type: "gradient",
          gradient: {
            opacityFrom: 0.5,
            opacityTo: 0,
            shade: "#8B5CF6",
            gradientToColors: ["#8B5CF6"],
          },
        },
        dataLabels: { enabled: false },
        grid: { show: true, borderColor: "#E5E7EB" },
        tooltip: { enabled: true },
        legend: { show: false },
      };

      const chart = new ApexCharts(document.getElementById("orders-chart"), options);
      chart.render();
    };

    fetchDataAndRenderChart();
  }, []);

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between p-4 pb-2">
        <div>
          <h5 className="leading-none text-3xl font-bold text-gray-900 dark:text-white">
            {totalOrders}
          </h5>
          <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
            ORDERS OVER TIME
          </p>
        </div>
        <a href="#" className="text-sm font-medium text-blue-600">
          View report
        </a>
      </div>

      {/* Chart */}
      <div id="orders-chart" className="w-full h-48 px-2.5"></div>
    </div>
  );
};

export default OrdersChart;
