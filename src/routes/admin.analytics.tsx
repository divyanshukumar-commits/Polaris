import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Download,
  Eye,
  Globe2,
  PieChart as PieIcon,
  Search,
  TrendingUp,
  Users,
} from "lucide-react";
import { PageHeader, SectionTitle, StatCard } from "@/components/polaris/core";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const Route = createFileRoute("/admin/analytics")({
  head: () => ({
    meta: [
      { title: "Platform Analytics & Telemetry — POLARIS Admin" },
      {
        name: "description",
        content:
          "Platform traffic metrics, research paper downloads, topic interest, and geographic dissemination.",
      },
      { property: "og:title", content: "Platform Analytics — POLARIS" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AnalyticsPage,
});

const monthlyData = [
  { month: "Jan", visitors: 4200, downloads: 1240 },
  { month: "Feb", visitors: 5800, downloads: 1890 },
  { month: "Mar", visitors: 7400, downloads: 2450 },
  { month: "Apr", visitors: 8900, downloads: 3100 },
  { month: "May", visitors: 11200, downloads: 4200 },
  { month: "Jun", visitors: 13500, downloads: 5120 },
  { month: "Jul", visitors: 16800, downloads: 6450 },
  { month: "Aug", visitors: 19400, downloads: 7800 },
];

const topicDistribution = [
  { topic: "Glaciology", count: 420 },
  { topic: "Climate", count: 380 },
  { topic: "Oceanography", count: 290 },
  { topic: "Space / Sat", count: 210 },
  { topic: "Wildlife", count: 160 },
  { topic: "Geology", count: 110 },
];

const regionDistribution = [
  { name: "Antarctic Research", value: 58, color: "oklch(0.72 0.16 195)" },
  { name: "Arctic Research", value: 34, color: "oklch(0.68 0.18 240)" },
  { name: "Global Teleconnections", value: 8, color: "oklch(0.8 0.14 85)" },
];

const popularQueries = [
  { query: "Thwaites Glacier ice melt", searches: 2420, trend: "+34%" },
  { query: "Maitri station weather data", searches: 1980, trend: "+18%" },
  { query: "Arctic sea ice monsoon connection", searches: 1650, trend: "+45%" },
  { query: "IndARC Kongsfjorden telemetry", searches: 1240, trend: "+12%" },
  { query: "Bharati satellite ground station", searches: 980, trend: "+8%" },
];

function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("2026 YTD");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin Portal · Telemetry Dashboard"
        title="Platform Analytics & Dissemination"
        description="Monitor scientific knowledge dissemination, student outreach engagement, geographic reach, and research downloads across the country."
      >
        <div className="rounded-xl border border-border bg-secondary/50 p-1">
          {["Last 30 Days", "2026 YTD", "All Time"].map((t) => (
            <button
              key={t}
              onClick={() => setTimeRange(t)}
              className={
                "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all " +
                (timeRange === t
                  ? "bg-primary text-primary-foreground shadow-sm glow-primary"
                  : "text-muted-foreground hover:text-foreground")
              }
            >
              {t}
            </button>
          ))}
        </div>
      </PageHeader>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={<Users size={16} />}
          label="Total Portal Visitors"
          value={87200}
          suffix="+"
        />
        <StatCard
          icon={<Download size={16} />}
          label="Research & Dataset Downloads"
          value={32250}
          suffix="+"
        />
        <StatCard
          icon={<Eye size={16} />}
          label="Media Gallery Impressions"
          value={142800}
          suffix="+"
        />
        <StatCard
          icon={<Activity size={16} />}
          label="Outreach Quiz Completions"
          value={5410}
          suffix="+"
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Visitors & Downloads Area Chart */}
        <div className="glass rounded-3xl p-6 glow-soft border border-border/80 lg:col-span-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="font-mono text-[10px] uppercase font-bold text-primary">
                Monthly Dissemination Growth
              </span>
              <h3 className="font-display text-base font-bold text-foreground">
                Platform Visitors & Knowledge Downloads
              </h3>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-primary">
                <span className="h-2 w-2 rounded-full bg-primary" /> Visitors
              </span>
              <span className="flex items-center gap-1.5 text-chart-2">
                <span className="h-2 w-2 rounded-full bg-chart-2" /> Downloads
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.72 0.16 195)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="oklch(0.72 0.16 195)" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorDownloads" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.68 0.18 240)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="oklch(0.68 0.18 240)" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#6b7280" fontSize={11} tickLine={false} />
                  <YAxis stroke="#6b7280" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.9)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="visitors"
                    stroke="oklch(0.72 0.16 195)"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorVisitors)"
                  />
                  <Area
                    type="monotone"
                    dataKey="downloads"
                    stroke="oklch(0.68 0.18 240)"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorDownloads)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">
                Loading telemetry chart…
              </div>
            )}
          </div>
        </div>

        {/* Polar Region Breakdown Donut */}
        <div className="glass rounded-3xl p-6 glow-soft border border-border/80 lg:col-span-4 flex flex-col justify-between">
          <div>
            <span className="font-mono text-[10px] uppercase font-bold text-primary">
              Domain Interest
            </span>
            <h3 className="font-display text-base font-bold text-foreground">
              Regional Focus Share
            </h3>
          </div>

          <div className="h-48 w-full my-2">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={regionDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {regionDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.9)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">
                Loading distribution…
              </div>
            )}
          </div>

          <div className="space-y-2 border-t border-border pt-4 text-xs">
            {regionDistribution.map((r) => (
              <div key={r.name} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: r.color }} />
                  {r.name}
                </span>
                <span className="font-mono font-bold text-foreground">{r.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lower Row: Bar Chart and Search Queries Table */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Research Papers by Topic */}
        <div className="glass rounded-3xl p-6 glow-soft border border-border/80 lg:col-span-6">
          <span className="font-mono text-[10px] uppercase font-bold text-primary">
            Subject Matter Analysis
          </span>
          <h3 className="font-display text-base font-bold text-foreground mb-4">
            Repository Downloads by Scientific Discipline
          </h3>

          <div className="h-64 w-full">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topicDistribution}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <XAxis dataKey="topic" stroke="#6b7280" fontSize={10} tickLine={false} />
                  <YAxis stroke="#6b7280" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.9)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="count" fill="oklch(0.72 0.16 195)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">
                Loading discipline metrics…
              </div>
            )}
          </div>
        </div>

        {/* Trending Search Queries */}
        <div className="glass rounded-3xl p-6 glow-soft border border-border/80 lg:col-span-6">
          <span className="font-mono text-[10px] uppercase font-bold text-primary">
            Telemetry Feed
          </span>
          <h3 className="font-display text-base font-bold text-foreground mb-4">
            Top Search Queries & User Discovery Trends
          </h3>

          <div className="divide-y divide-border">
            {popularQueries.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-muted-foreground w-4">#{idx + 1}</span>
                  <div>
                    <span className="font-semibold text-xs text-foreground block">
                      {item.query}
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {item.searches.toLocaleString()} queries
                    </span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 font-mono text-xs font-bold text-emerald-400">
                  <TrendingUp size={13} /> {item.trend}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
