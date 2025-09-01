"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs,  query, orderBy  } from "firebase/firestore";
import { db } from "@/config/firebase";

const RevenueChart = () => {
  const [revenueData, setRevenueData] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);

  useEffect(() => {
    const fetchDataAndRenderChart = async () => {
      const ordersQuery = query(collection(db, "orders"), orderBy("date", "asc"));
        const snapshot = await getDocs(ordersQuery);
      const totals: number[] = [];
      const dates: string[] = [];
      let totalSum = 0;

      snapshot.forEach((doc) => {
        const data = doc.data();
        const total = data.total || 0;
        totals.push(total);
        totalSum += total;

        let date: Date;
        if (data.date?.seconds) {
          date = new Date(data.date.seconds * 1000);
        } else {
          date = new Date(data.date);
        }

        // Format date like '01 Feb', '02 Feb', etc.
        const formattedDate = date
          .toLocaleDateString("en-US", { day: "2-digit", month: "short" })
          .replace(",", "");
        dates.push(formattedDate);
      });

      setRevenueData(totals);
      setLabels(dates);
      setTotalRevenue(totalSum);

      // Import ApexCharts dynamically
      const ApexCharts = (await import("apexcharts")).default;

      const options = {
        chart: {
          type: "area",
          height: 150,
          width: "100%",
          fontFamily: "Inter, sans-serif",
          toolbar: { show: false },
        },
        series: [{ name: "Revenue", data: totals, color: "#1A56DB" }],
        xaxis: {
          categories: dates,
          labels: {
            style: {
              fontFamily: "Inter, sans-serif",
              cssClass: "text-xs font-normal fill-gray-500 dark:fill-gray-400",
            },
          },
          axisBorder: { show: false },
          axisTicks: { show: false },
        },
        yaxis: {
          labels: {
            formatter: (val: number) => `$${val}`,
            style: {
              fontFamily: "Inter, sans-serif",
              cssClass: "text-xs font-normal fill-gray-500 dark:fill-gray-400",
            },
          },
        },
        fill: {
          type: "gradient",
          gradient: { opacityFrom: 0.55, opacityTo: 0, shade: "#1C64F2", gradientToColors: ["#1C64F2"] },
        },
        dataLabels: { enabled: false },
        stroke: { width: 3 },
        legend: { show: false },
        grid: { show: false },
        tooltip: { enabled: true, x: { show: false } },
      };

      const chart = new ApexCharts(document.getElementById("labels-chart"), options);
      chart.render();
    };

    fetchDataAndRenderChart();
  }, []);

  return (
    <div className="w-full bg-white rounded-lg shadow-sm dark:bg-gray-800">
  <div className="flex justify-between p-4 md:p-6 pb-2">
    <div>
      <h5 className="leading-none text-3xl font-bold text-gray-900 dark:text-white pb-2">
        ${totalRevenue}
      </h5>
      <p className="text-base font-normal text-gray-500 dark:text-gray-400">
        Sales this week
      </p>
    </div>
    <div className="flex items-center px-2.5 py-0.5 text-base font-semibold text-green-500 dark:text-green-500 text-center">
      23%
      <svg
        className="w-3 h-3 ms-1"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 10 14"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M5 13V1m0 0L1 5m4-4 4 4"
        />
      </svg>
    </div>
  </div>

  {/* Chart below the top stats */}
  <div id="labels-chart" className="w-full px-2.5 h-48"></div>


</div>

  );
};

export default RevenueChart;
