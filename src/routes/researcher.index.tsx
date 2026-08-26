import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bookmark,
  CheckCircle2,
  Clock,
  Compass,
  FilePlus,
  FileText,
  FlaskConical,
  Globe2,
  Library,
  Radio,
  Search,
  Sparkles,
  TrendingUp,
  Upload,
  Users,
} from "lucide-react";
import { PageHeader, SectionTitle, StatCard, StatusBadge } from "@/components/polaris/core";
import { useApp } from "@/lib/store";
import { ResearchDetailModal } from "@/components/polaris/cards";
import type { ResearchItem } from "@/lib/data/types";
import { toast } from "sonner";

export const Route = createFileRoute("/researcher/")({
  head: () => ({
    meta: [
      { title: "Researcher Dashboard — POLARIS" },
      {
        name: "description",
        content: "Manage your polar research papers, dataset submissions, peer-review statuses, and station telemetry.",
      },
      { property: "og:title", content: "Researcher Dashboard — POLARIS" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ResearcherDashboard,
});

function ResearcherDashboard() {
  const { allResearch } = useApp();
  const [selectedItem, setSelectedItem] = useState<ResearchItem | null>(null);

  const published = allResearch.filter((r) => r.status === "Published");
  const inReview = allResearch.filter((r) => r.status === "Under Review" || r.status === "Draft");
  const totalViews = allResearch.reduce((acc, r) => acc + (r.views || 0), 0);

  return (
    <div className="space-y-8">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-strong bg-grid relative overflow-hidden rounded-3xl p-8 glow-primary md:p-10"
      >
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
              <FlaskConical size={12} /> NCPOR Scientist Portal
            </p>
            <h1 className="mt-3 font-display text-3xl font-bold text-foreground md:text-4xl">
              Welcome back, <span className="text-aurora">Dr. Geeta Nair</span>
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
              National Centre for Polar & Ocean Research (NCPOR) · Cryosphere & Sea-Ice Division
            </p>
          </div>
          <Link
            to="/researcher/research"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-md transition-opacity hover:opacity-90 glow-primary"
          >
            <FilePlus size={16} /> Submit Research Paper
          </Link>
        </div>
      </motion.section>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={<Library size={16} />} label="Total Published" value={published.length} />
        <StatCard icon={<Clock size={16} />} label="Under Moderation" value={inReview.length} />
        <StatCard icon={<TrendingUp size={16} />} label="Total Repository Views" value={totalViews} suffix="+" />
        <StatCard icon={<Compass size={16} />} label="Field Expeditions" value={4} />
      </div>

      {/* Quick Action Grid */}
      <div>
        <SectionTitle title="Researcher Quick Actions" />
        <div className="grid gap-4 sm:grid-cols-3">
          <Link
            to="/researcher/research"
            className="glass card-hover-lift group rounded-2xl p-5 glow-soft flex flex-col justify-between"
          >
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary border border-primary/25">
                <Upload size={18} />
              </div>
              <h3 className="mt-3 font-display text-base font-bold text-foreground group-hover:text-primary transition-colors">
                My Research & Submissions
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Manage your submitted manuscripts, datasets, and track peer review status in real-time.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-semibold text-primary">
              Open My Research <ArrowRight size={14} className="ml-1" />
            </div>
          </Link>

          <Link
            to="/researcher/discover"
            className="glass card-hover-lift group rounded-2xl p-5 glow-soft flex flex-col justify-between"
          >
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary border border-primary/25">
                <Search size={18} />
              </div>
              <h3 className="mt-3 font-display text-base font-bold text-foreground group-hover:text-primary transition-colors">
                Discover & Citation Export
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Search verified datasets with DOI citations in BibTeX, APA, and RIS formats.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-semibold text-primary">
              Explore Literature <ArrowRight size={14} className="ml-1" />
            </div>
          </Link>

          <Link
            to="/researcher/expeditions"
            className="glass card-hover-lift group rounded-2xl p-5 glow-soft flex flex-col justify-between"
          >
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary border border-primary/25">
                <Compass size={18} />
              </div>
              <h3 className="mt-3 font-display text-base font-bold text-foreground group-hover:text-primary transition-colors">
                Field Mission Telemetry
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Live sensor feeds and operational status for Maitri, Bharati, and Himadri stations.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-semibold text-primary">
              View Field Hub <ArrowRight size={14} className="ml-1" />
            </div>
          </Link>
        </div>
      </div>

      {/* Station Telemetry Widget */}
      <div className="rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/10 via-background to-secondary/30 p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-primary">
              Live Station Status
            </span>
            <h3 className="font-display text-lg font-bold text-foreground">
              Indian Polar Observatory Telemetry
            </h3>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 font-mono text-[10px] font-bold text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> All Stations Online
          </span>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {[
            {
              station: "Maitri Station",
              location: "Schirmacher Oasis, Antarctica",
              temp: "-18.4 °C",
              wind: "32 km/h ESE",
              status: "Nominal",
            },
            {
              station: "Bharati Station",
              location: "Larsemann Hills, Antarctica",
              temp: "-12.1 °C",
              wind: "18 km/h S",
              status: "Nominal",
            },
            {
              station: "Himadri Station",
              location: "Ny-Ålesund, Svalbard (Arctic)",
              temp: "-6.8 °C",
              wind: "14 km/h NW",
              status: "Nominal",
            },
          ].map((s) => (
            <div key={s.station} className="glass rounded-xl p-4 border border-border">
              <div className="flex items-center justify-between">
                <span className="font-display text-sm font-bold text-foreground">{s.station}</span>
                <span className="font-mono text-xs font-bold text-primary">{s.temp}</span>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">{s.location}</p>
              <div className="mt-3 flex items-center justify-between pt-2 border-t border-border/50 text-[10px] font-mono text-muted-foreground">
                <span>Wind: {s.wind}</span>
                <span className="text-emerald-400">{s.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Submissions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-semibold text-foreground">Recent Submissions</h2>
          <Link to="/researcher/research" className="text-xs font-semibold text-primary hover:underline">
            View All ({allResearch.length})
          </Link>
        </div>

        <div className="glass overflow-hidden rounded-2xl border border-border/80 glow-soft">
          <div className="divide-y divide-border">
            {allResearch.slice(0, 5).map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="flex flex-wrap items-center justify-between gap-4 p-4 transition-colors hover:bg-secondary/40 cursor-pointer"
              >
                <div className="max-w-xl">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={item.status} />
                    <span className="font-mono text-[10px] text-muted-foreground uppercase">{item.region}</span>
                    <span className="font-mono text-[10px] text-muted-foreground">· {item.year}</span>
                  </div>
                  <h4 className="mt-1 font-display text-sm font-semibold text-foreground hover:text-primary transition-colors">
                    {item.title}
                  </h4>
                  <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{item.abstract}</p>
                </div>
                <div className="flex items-center gap-4 text-right text-xs font-mono text-muted-foreground">
                  <div>
                    <span className="block font-bold text-foreground">{item.views || 0}</span>
                    <span className="text-[10px]">views</span>
                  </div>
                  <ArrowRight size={15} className="text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedItem && (
        <ResearchDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
}
