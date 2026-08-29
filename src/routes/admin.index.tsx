import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Clock,
  Database,
  FileCheck,
  FileText,
  HardDrive,
  Radio,
  Server,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";
import { PageHeader, SectionTitle, StatCard, StatusBadge } from "@/components/polaris/core";
import { useApp } from "@/lib/store";
import { ResearchDetailModal } from "@/components/polaris/cards";
import type { ResearchItem } from "@/lib/data/types";
import { toast } from "sonner";
import { InteractiveGlobe } from "@/components/polaris/interactive-globe";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Admin Command Center — POLARIS" },
      {
        name: "description",
        content: "Administrative control center for platform moderation, users, and node health.",
      },
      { property: "og:title", content: "Admin Command Center — POLARIS" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const { allResearch, setResearchStatus, users } = useApp();
  const [selectedItem, setSelectedItem] = useState<ResearchItem | null>(null);

  const pendingModeration = allResearch.filter((r) => r.status === "Under Review");
  const publishedCount = allResearch.filter((r) => r.status === "Published").length;
  const activeUsersCount = users.filter((u) => u.status === "Active").length;

  const handleQuickApprove = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setResearchStatus(id, "Published");
    toast.success("Submission approved and published to Knowledge Repository!");
  };

  const handleQuickReject = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setResearchStatus(id, "Rejected");
    toast.error("Submission rejected.");
  };

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
              <ShieldCheck size={12} /> System Administrator
            </p>
            <h1 className="mt-3 font-display text-3xl font-bold text-foreground md:text-4xl">
              Platform Command Center
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Supervise content verification, user account permissions, and national polar data
              synchronization feeds.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/admin/content"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-md transition-opacity hover:opacity-90 glow-primary"
            >
              <FileCheck size={16} /> Open Content Moderation
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={<Clock size={16} />}
          label="Pending Moderation"
          value={pendingModeration.length}
        />
        <StatCard icon={<FileText size={16} />} label="Published Works" value={publishedCount} />
        <StatCard icon={<Users size={16} />} label="Active Accounts" value={activeUsersCount} />
        <StatCard icon={<Server size={16} />} label="System Health" value={100} suffix="%" />
      </div>

      <section>
        <SectionTitle
          title="Global Research Activity"
          action={
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Platform field coverage
            </span>
          }
        />
        <InteractiveGlobe className="h-[460px] w-full" />
      </section>

      {/* Pending Moderation Queue */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <SectionTitle title="Pending Moderation Queue" />
          <Link to="/admin/content" className="text-xs font-semibold text-primary hover:underline">
            Manage All Content <ArrowRight size={13} className="inline ml-0.5" />
          </Link>
        </div>

        {pendingModeration.length > 0 ? (
          <div className="glass overflow-hidden rounded-2xl border border-border/80 glow-soft">
            <div className="divide-y divide-border">
              {pendingModeration.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="flex flex-wrap items-center justify-between gap-4 p-5 transition-colors hover:bg-secondary/40 cursor-pointer"
                >
                  <div className="max-w-xl">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={item.status} />
                      <span className="font-mono text-[10px] text-muted-foreground uppercase">
                        {item.region}
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        · {item.topic}
                      </span>
                    </div>
                    <h4 className="mt-1 font-display text-sm font-bold text-foreground hover:text-primary transition-colors">
                      {item.title}
                    </h4>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Submitted by: {item.authors.join(", ")} ({item.institution})
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleQuickApprove(e, item.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600/90 hover:bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition-colors"
                    >
                      <CheckCircle2 size={13} /> Approve
                    </button>
                    <button
                      onClick={(e) => handleQuickReject(e, item.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 px-3 py-1.5 text-xs font-bold text-rose-400 transition-colors"
                    >
                      <XCircle size={13} /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="glass rounded-2xl p-8 text-center text-muted-foreground border border-border">
            <CheckCircle2 size={32} className="mx-auto mb-2 text-emerald-400" />
            <h4 className="font-display text-sm font-semibold text-foreground">
              All Submissions Reviewed!
            </h4>
            <p className="text-xs mt-0.5">
              No manuscripts are currently pending administrative moderation.
            </p>
          </div>
        )}
      </div>

      {/* Infrastructure Node Telemetry */}
      <div>
        <SectionTitle title="Connected Institutional Data Relays" />
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              node: "NCPOR Master Storage (Goa)",
              type: "Primary Core Repository",
              latency: "14ms",
              status: "Operational",
              load: "4.2 TB / 10 TB (42%)",
            },
            {
              node: "ISRO VEDAS Satellite Pipeline",
              type: "Cryosphere Remote Sensing Stream",
              latency: "28ms",
              status: "Operational",
              load: "Sync Active (10 Hz)",
            },
            {
              node: "NPDC Open Access Gateway",
              type: "Public Metadata Exchange Hub",
              latency: "19ms",
              status: "Operational",
              load: "1,250 Datasets Cached",
            },
          ].map((srv, idx) => (
            <div key={idx} className="glass rounded-2xl p-5 glow-soft border border-border">
              <div className="flex items-center justify-between">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Database size={16} />
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-bold">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />{" "}
                  {srv.status}
                </span>
              </div>
              <h4 className="mt-3 font-display text-sm font-bold text-foreground">{srv.node}</h4>
              <p className="mt-0.5 text-xs text-muted-foreground">{srv.type}</p>
              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between font-mono text-[10px] text-muted-foreground">
                <span>Latency: {srv.latency}</span>
                <span>{srv.load}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedItem && (
        <ResearchDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
}
