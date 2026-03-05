"use client";

import { type ReactNode, useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { Manrope } from "next/font/google";
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarRange,
  Clock3,
  Package,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import { db } from "@/config/firebase";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

type LiveDashboardProps = {
  snackId?: string;
};

type DashboardOrder = {
  id: string;
  total: number;
  status: string;
  date: Date;
  products: any[];
};

type Granularity = "hours" | "days" | "months";

type TrendPoint = {
  key: string;
  label: string;
  orders: number;
  revenue: number;
};

type TopProduct = {
  id: string;
  name: string;
  image: string;
  orders: number;
  revenue: number;
};

const quickRanges = [
  { label: "Today", days: 1 },
  { label: "7D", days: 7 },
  { label: "30D", days: 30 },
  { label: "90D", days: 90 },
];

const statusColors: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-700",
  "In Progress": "bg-orange-100 text-orange-700",
  Completed: "bg-emerald-100 text-emerald-700",
};

const statusBarColors: Record<string, string> = {
  Pending: "bg-amber-400",
  "In Progress": "bg-orange-500",
  Completed: "bg-emerald-500",
};

const startOfHour = (date: Date) =>
  new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    0,
    0,
    0
  );

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const endOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);

const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const addHours = (date: Date, hours: number) => {
  const next = new Date(date);
  next.setHours(next.getHours() + hours);
  return next;
};

const addMonths = (date: Date, months: number) => {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
};

const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);

const normalizeDate = (value: any) => {
  if (value?.toDate) {
    return value.toDate();
  }

  if (value?.seconds) {
    return new Date(value.seconds * 1000);
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
};

const toDateInput = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const fromDateInput = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
};

const formatCompactCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "MAD",
    maximumFractionDigits: 0,
  }).format(value);

const formatPercent = (value: number) =>
  `${value > 0 ? "+" : ""}${value.toFixed(value >= 10 ? 0 : 1)}%`;

const compareMetric = (current: number, previous: number) => {
  if (previous === 0) {
    if (current === 0) {
      return { value: 0, positive: true };
    }

    return { value: 100, positive: true };
  }

  const ratio = ((current - previous) / previous) * 100;
  return { value: ratio, positive: ratio >= 0 };
};

const buildPath = (values: number[], width: number, height: number) => {
  if (values.length === 0) {
    return "";
  }

  const max = Math.max(...values, 1);
  return values
    .map((value, index) => {
      const x =
        values.length === 1 ? width / 2 : (index / (values.length - 1)) * width;
      const y = height - (value / max) * height;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
};

const buildAreaPath = (values: number[], width: number, height: number) => {
  if (values.length === 0) {
    return "";
  }

  const line = buildPath(values, width, height);
  return `${line} L ${width} ${height} L 0 ${height} Z`;
};

const normalizeBucket = (date: Date, granularity: Granularity) => {
  if (granularity === "hours") return startOfHour(date);
  if (granularity === "months") return startOfMonth(date);
  return startOfDay(date);
};

const addBucket = (date: Date, granularity: Granularity, amount: number) => {
  if (granularity === "hours") return addHours(date, amount);
  if (granularity === "months") return addMonths(date, amount);
  return addDays(date, amount);
};

const formatBucketLabel = (date: Date, granularity: Granularity) => {
  if (granularity === "hours") {
    return date.toLocaleTimeString("en-US", { hour: "numeric", hour12: true });
  }

  if (granularity === "months") {
    return date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
  }

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const getVisibleLabels = (points: TrendPoint[]) => {
  if (points.length <= 6) return points;

  const indexes = new Set<number>([
    0,
    Math.floor((points.length - 1) * 0.25),
    Math.floor((points.length - 1) * 0.5),
    Math.floor((points.length - 1) * 0.75),
    points.length - 1,
  ]);

  return points.filter((_, index) => indexes.has(index));
};

const groupTrend = (
  orders: DashboardOrder[],
  start: Date,
  end: Date,
  granularity: Granularity
): TrendPoint[] => {
  const points: TrendPoint[] = [];
  const pointMap = new Map<string, TrendPoint>();

  for (
    let cursor = normalizeBucket(start, granularity);
    cursor <= end;
    cursor = addBucket(cursor, granularity, 1)
  ) {
    const point = {
      key: cursor.toISOString(),
      label: formatBucketLabel(cursor, granularity),
      orders: 0,
      revenue: 0,
    };
    points.push(point);
    pointMap.set(point.key, point);
  }

  orders.forEach((order) => {
    const key = normalizeBucket(order.date, granularity).toISOString();
    const point = pointMap.get(key);
    if (!point) return;
    point.orders += 1;
    point.revenue += order.total;
  });

  return points;
};

const aggregateTopProducts = (orders: DashboardOrder[]) => {
  const productsMap = new Map<string, TopProduct>();

  orders.forEach((order) => {
    order.products?.forEach((product: any) => {
      const quantity = (product?.cost || []).reduce(
        (sum: number, entry: any) => sum + (entry.quantity || 0),
        0
      );
      const revenue = (product?.cost || []).reduce(
        (sum: number, entry: any) =>
          sum + (entry.quantity || 0) * (entry.price || 0),
        0
      );

      if (quantity <= 0) {
        return;
      }

      const id = String(product?.id || product?.name || Math.random());
      const existing = productsMap.get(id);

      if (existing) {
        existing.orders += quantity;
        existing.revenue += revenue;
        return;
      }

      productsMap.set(id, {
        id,
        name: product?.name || "Unnamed plat",
        image: product?.urlPhoto || "/images.jpg",
        orders: quantity,
        revenue,
      });
    });
  });

  return Array.from(productsMap.values())
    .sort((a, b) => b.orders - a.orders)
    .slice(0, 5);
};

const KpiCard = ({
  title,
  value,
  helper,
  delta,
  icon,
}: {
  title: string;
  value: string;
  helper: string;
  delta: { value: number; positive: boolean };
  icon: ReactNode;
}) => (
  <article className="rounded-[28px] border border-white/70 bg-white/85 p-5 shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
          {title}
        </p>
        <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950">
          {value}
        </p>
      </div>
      <div className="rounded-2xl bg-slate-950 p-3 text-white">{icon}</div>
    </div>

    <div className="mt-5 flex items-center justify-between gap-3">
      <span
        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
          delta.positive ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
        }`}
      >
        {delta.positive ? (
          <ArrowUpRight className="h-3.5 w-3.5" />
        ) : (
          <ArrowDownRight className="h-3.5 w-3.5" />
        )}
        {formatPercent(delta.value)}
      </span>
      <span className="text-sm text-slate-500">{helper}</span>
    </div>
  </article>
);

const TrendChart = ({
  title,
  subtitle,
  points,
  metric,
  tone,
}: {
  title: string;
  subtitle: string;
  points: TrendPoint[];
  metric: "orders" | "revenue";
  tone: "orange" | "emerald";
}) => {
  const values = points.map((point) => point[metric]);
  const max = Math.max(...values, 1);
  const linePath = buildPath(values, 640, 220);
  const areaPath = buildAreaPath(values, 640, 220);
  const stroke = tone === "orange" ? "#F97316" : "#10B981";
  const fill =
    tone === "orange" ? "rgba(249,115,22,0.08)" : "rgba(16,185,129,0.08)";
  const latest = values[values.length - 1] || 0;
  const previous = values[values.length - 2] || 0;
  const delta = compareMetric(latest, previous);
  const visibleLabels = getVisibleLabels(points);
  const latestX = values.length === 1 ? 320 : 640;
  const latestY = 220 - (latest / max) * 220;

  return (
    <section className="rounded-[32px] border border-white/70 bg-white/85 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">
            {title}
          </p>
          <h3 className="mt-2 text-[28px] font-semibold tracking-[-0.05em] text-slate-950">
            {subtitle}
          </h3>
        </div>

        <div
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
            delta.positive ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
          }`}
        >
          {delta.positive ? (
            <ArrowUpRight className="h-3.5 w-3.5" />
          ) : (
            <ArrowDownRight className="h-3.5 w-3.5" />
          )}
          {formatPercent(delta.value)}
        </div>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white p-4">
        <svg viewBox="0 0 640 240" className="h-64 w-full">
          {[0, 1, 2, 3].map((row) => (
            <line
              key={row}
              x1="0"
              x2="640"
              y1={20 + row * 55}
              y2={20 + row * 55}
              stroke="#E2E8F0"
              strokeDasharray="4 8"
            />
          ))}
          <path d={areaPath} fill={fill} />
          <path
            d={linePath}
            fill="none"
            stroke={stroke}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx={latestX} cy={latestY} r="7" fill="white" stroke={stroke} strokeWidth="3" />
        </svg>

        <div className="mt-4 flex items-center justify-between gap-3 text-[11px] font-medium text-slate-400">
          {visibleLabels.map((point) => (
            <span key={point.key}>{point.label}</span>
          ))}
        </div>
      </div>
    </section>
  );
};

const StatusBreakdown = ({
  counts,
  total,
}: {
  counts: Record<string, number>;
  total: number;
}) => {
  const statuses = ["Pending", "In Progress", "Completed"];

  return (
    <section className="rounded-[32px] border border-white/70 bg-white/85 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
        Status mix
      </p>
      <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
        Current order pipeline
      </h3>

      <div className="mt-6 space-y-4">
        {statuses.map((status) => {
          const value = counts[status] || 0;
          const percent = total > 0 ? (value / total) * 100 : 0;

          return (
            <div key={status}>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700">{status}</span>
                <span className="text-slate-500">
                  {value} orders - {percent.toFixed(0)}%
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${statusBarColors[status]}`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

const TopPlats = ({ products }: { products: TopProduct[] }) => (
  <section className="rounded-[32px] border border-white/70 bg-white/85 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur">
    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
      Best sellers
    </p>
    <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
      Most ordered plats
    </h3>

    <div className="mt-6 space-y-4">
      {products.length > 0 ? (
        products.map((product, index) => (
          <article
            key={product.id}
            className="flex items-center gap-4 rounded-[24px] border border-slate-100 bg-white p-3 shadow-[0_12px_40px_rgba(15,23,42,0.05)]"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white">
              {index + 1}
            </span>
            <img
              src={product.image}
              alt={product.name}
              className="h-14 w-14 rounded-2xl object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-950">{product.name}</p>
              <p className="mt-1 text-xs text-slate-500">{product.orders} units ordered</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-950">
                {formatCompactCurrency(product.revenue)}
              </p>
              <p className="mt-1 text-xs text-slate-500">Revenue</p>
            </div>
          </article>
        ))
      ) : (
        <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 px-5 py-10 text-center text-sm text-slate-500">
          No ordered plats in this date range yet.
        </div>
      )}
    </div>
  </section>
);

const RecentActivity = ({ orders }: { orders: DashboardOrder[] }) => (
  <section className="rounded-[32px] border border-white/70 bg-slate-950 p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.16)]">
    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/45">
      Recent activity
    </p>
    <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
      Latest live orders
    </h3>

    <div className="mt-6 space-y-3">
      {orders.length > 0 ? (
        orders.slice(0, 5).map((order) => (
          <article
            key={order.id}
            className="flex items-center justify-between gap-3 rounded-[24px] border border-white/10 bg-white/5 px-4 py-4"
          >
            <div>
              <p className="text-sm font-semibold text-white">
                Order #{order.id.slice(0, 6)}
              </p>
              <p className="mt-1 text-xs text-white/55">{order.date.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                  statusColors[order.status] || "bg-slate-200 text-slate-700"
                }`}
              >
                {order.status}
              </span>
              <p className="mt-2 text-sm font-semibold text-white">
                {formatCompactCurrency(order.total)}
              </p>
            </div>
          </article>
        ))
      ) : (
        <div className="rounded-[24px] border border-dashed border-white/10 bg-white/5 px-5 py-10 text-center text-sm text-white/55">
          No orders yet.
        </div>
      )}
    </div>
  </section>
);

const LiveDashboard = ({ snackId }: LiveDashboardProps) => {
  const today = new Date();
  const initialFrom = toDateInput(addDays(today, -29));
  const initialTo = toDateInput(today);

  const [granularity, setGranularity] = useState<Granularity>("days");
  const [fromDate, setFromDate] = useState(initialFrom);
  const [toDate, setToDate] = useState(initialTo);
  const [orders, setOrders] = useState<DashboardOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!snackId) {
      setOrders([]);
      setLoading(false);
      return;
    }

    const ordersQuery = query(collection(db, "orders"), where("snackId", "==", snackId));
    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      const nextOrders = snapshot.docs
        .map((doc) => {
          const data = doc.data() as any;
          return {
            id: doc.id,
            total: Number(data.total) || 0,
            status: data.status || "Pending",
            date: normalizeDate(data.createdAt || data.date),
            products: data.products || [],
          } satisfies DashboardOrder;
        })
        .sort((left, right) => right.date.getTime() - left.date.getTime());

      setOrders(nextOrders);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [snackId]);

  const analytics = useMemo(() => {
    const currentStart = startOfDay(fromDateInput(fromDate));
    const currentEnd = endOfDay(fromDateInput(toDate));
    const duration = currentEnd.getTime() - currentStart.getTime();
    const previousStart = new Date(currentStart.getTime() - duration - 1);
    const previousEnd = new Date(currentStart.getTime() - 1);
    const todayStart = startOfDay(new Date());

    const currentOrders = orders.filter(
      (order) => order.date >= currentStart && order.date <= currentEnd
    );
    const previousOrders = orders.filter(
      (order) => order.date >= previousStart && order.date <= previousEnd
    );
    const todayOrders = orders.filter((order) => order.date >= todayStart);

    const currentRevenue = currentOrders.reduce((sum, order) => sum + order.total, 0);
    const previousRevenue = previousOrders.reduce((sum, order) => sum + order.total, 0);
    const completedOrders = currentOrders.filter((order) => order.status === "Completed");
    const pendingOrders = todayOrders.filter((order) => order.status !== "Completed");

    const statusCounts = currentOrders.reduce<Record<string, number>>((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    const trend = groupTrend(currentOrders, currentStart, currentEnd, granularity);
    const topProducts = aggregateTopProducts(currentOrders);

    return {
      currentOrders,
      previousOrders,
      currentRevenue,
      previousRevenue,
      averageOrderValue:
        currentOrders.length > 0 ? currentRevenue / currentOrders.length : 0,
      previousAverageOrderValue:
        previousOrders.length > 0 ? previousRevenue / previousOrders.length : 0,
      completedRate:
        currentOrders.length > 0 ? (completedOrders.length / currentOrders.length) * 100 : 0,
      previousCompletedRate:
        previousOrders.length > 0
          ? (previousOrders.filter((order) => order.status === "Completed").length /
              previousOrders.length) *
            100
          : 0,
      pendingToday: pendingOrders.length,
      previousPendingToday: previousOrders.filter((order) => order.status !== "Completed").length,
      statusCounts,
      trend,
      topProducts,
    };
  }, [orders, fromDate, toDate, granularity]);

  const revenueSeries = analytics.trend.map((point) => point.revenue);
  const orderSeries = analytics.trend.map((point) => point.orders);

  return (
    <div
      className={`relative min-h-screen bg-[radial-gradient(circle_at_top,rgba(251,146,60,0.14),transparent_35%),linear-gradient(180deg,#fff7ed_0%,#f8fafc_35%,#ffffff_100%)] p-4 sm:ml-64 sm:p-6 ${manrope.className}`}
    >
      <div className="mx-auto mt-14 max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-orange-500">
              Live analytics
            </p>
            <h1 className="mt-3 text-[40px] font-semibold tracking-[-0.06em] text-slate-950">
              Dashboard performance overview
            </h1>
            <p className="mt-3 max-w-3xl text-[15px] leading-7 text-slate-600">
              Orders, revenue, comparisons, and best-selling plats update automatically
              whenever your restaurant data changes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500" />
              Live updating
            </span>
          </div>
        </div>

        <section className="mb-6 rounded-[32px] border border-white/70 bg-white/85 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              {quickRanges.map((range) => (
                <button
                  key={range.label}
                  type="button"
                  onClick={() => {
                    const nextTo = new Date();
                    const nextFrom = addDays(nextTo, -(range.days - 1));
                    setFromDate(toDateInput(nextFrom));
                    setToDate(toDateInput(nextTo));
                  }}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-orange-200 hover:text-orange-600"
                >
                  {range.label}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
                <CalendarRange className="h-4 w-4" />
                <input
                  type="date"
                  value={fromDate}
                  max={toDate}
                  onChange={(event) => setFromDate(event.target.value)}
                  className="bg-transparent outline-none"
                />
                <span className="text-slate-300">to</span>
                <input
                  type="date"
                  value={toDate}
                  min={fromDate}
                  onChange={(event) => setToDate(event.target.value)}
                  className="bg-transparent outline-none"
                />
              </div>

              <div className="inline-flex rounded-full border border-slate-200 bg-white p-1">
                {(["hours", "days", "months"] as Granularity[]).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setGranularity(option)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      granularity === option
                        ? "bg-slate-950 text-white"
                        : "text-slate-600 hover:text-slate-950"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="rounded-[32px] border border-dashed border-slate-200 bg-white/80 px-6 py-20 text-center text-sm text-slate-500">
            Loading live dashboard data...
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <KpiCard
                title="Orders"
                value={String(analytics.currentOrders.length)}
                helper="Selected range"
                delta={compareMetric(
                  analytics.currentOrders.length,
                  analytics.previousOrders.length
                )}
                icon={<ShoppingBag className="h-5 w-5" />}
              />
              <KpiCard
                title="Revenue"
                value={formatCompactCurrency(analytics.currentRevenue)}
                helper="Selected range"
                delta={compareMetric(analytics.currentRevenue, analytics.previousRevenue)}
                icon={<TrendingUp className="h-5 w-5" />}
              />
              <KpiCard
                title="Average ticket"
                value={formatCompactCurrency(analytics.averageOrderValue)}
                helper="Per order"
                delta={compareMetric(
                  analytics.averageOrderValue,
                  analytics.previousAverageOrderValue
                )}
                icon={<Package className="h-5 w-5" />}
              />
              <KpiCard
                title="Open today"
                value={String(analytics.pendingToday)}
                helper="Pending or in progress"
                delta={compareMetric(
                  analytics.pendingToday,
                  analytics.previousPendingToday
                )}
                icon={<Clock3 className="h-5 w-5" />}
              />
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.8fr)]">
              <TrendChart
                title="Orders"
                subtitle={`${orderSeries.reduce((sum, value) => sum + value, 0)} total orders`}
                points={analytics.trend}
                metric="orders"
                tone="orange"
              />
              <StatusBreakdown
                counts={analytics.statusCounts}
                total={analytics.currentOrders.length}
              />
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.8fr)]">
              <TrendChart
                title="Revenue"
                subtitle={formatCompactCurrency(
                  revenueSeries.reduce((sum, value) => sum + value, 0)
                )}
                points={analytics.trend}
                metric="revenue"
                tone="emerald"
              />
              <TopPlats products={analytics.topProducts} />
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
              <RecentActivity orders={orders} />

              <section className="rounded-[32px] border border-white/70 bg-white/85 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                  Date comparison
                </p>
                <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                  Current period vs previous period
                </h3>

                <div className="mt-6 space-y-5">
                  {[
                    {
                      label: "Orders",
                      current: analytics.currentOrders.length,
                      previous: analytics.previousOrders.length,
                    },
                    {
                      label: "Revenue",
                      current: analytics.currentRevenue,
                      previous: analytics.previousRevenue,
                      money: true,
                    },
                    {
                      label: "Completion rate",
                      current: analytics.completedRate,
                      previous: analytics.previousCompletedRate,
                      suffix: "%",
                    },
                  ].map((row) => {
                    const delta = compareMetric(row.current, row.previous);
                    const maximum = Math.max(row.current, row.previous, 1);

                    return (
                      <div key={row.label}>
                        <div className="mb-2 flex items-center justify-between gap-4">
                          <p className="text-sm font-semibold text-slate-900">{row.label}</p>
                          <p className="text-xs font-semibold text-slate-500">
                            {delta.positive ? "Up" : "Down"} {formatPercent(delta.value)}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <div>
                            <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
                              <span>Current</span>
                              <span>
                                {row.money
                                  ? formatCompactCurrency(row.current)
                                  : `${row.current.toFixed(0)}${row.suffix || ""}`}
                              </span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                              <div
                                className="h-full rounded-full bg-slate-950"
                                style={{ width: `${(row.current / maximum) * 100}%` }}
                              />
                            </div>
                          </div>

                          <div>
                            <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
                              <span>Previous</span>
                              <span>
                                {row.money
                                  ? formatCompactCurrency(row.previous)
                                  : `${row.previous.toFixed(0)}${row.suffix || ""}`}
                              </span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                              <div
                                className="h-full rounded-full bg-orange-400"
                                style={{ width: `${(row.previous / maximum) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LiveDashboard;
