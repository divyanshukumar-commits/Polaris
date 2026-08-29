import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  FileCheck,
  FileText,
  Filter,
  Search,
  Trash2,
  XCircle,
} from "lucide-react";
import { PageHeader, RegionTag, StatusBadge } from "@/components/polaris/core";
import { ResearchDetailModal } from "@/components/polaris/cards";
import { useApp } from "@/lib/store";
import type { ResearchItem, ResearchStatus } from "@/lib/data/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/content")({
  head: () => ({
    meta: [
      { title: "Content Moderation — POLARIS Admin" },
      {
        name: "description",
        content:
          "Moderate and approve research papers, scientific datasets, and metadata submissions.",
      },
      { property: "og:title", content: "Content Moderation — POLARIS" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ContentModerationPage,
});

function ContentModerationPage() {
  const { allResearch, setResearchStatus, deleteResearch } = useApp();
  const [tab, setTab] = useState<string>("Under Review");
  const [query, setQuery] = useState("");
  const [activeItem, setActiveItem] = useState<ResearchItem | null>(null);

  const filtered = allResearch.filter((item) => {
    if (tab !== "All" && item.status !== tab) return false;
    if (query) {
      const q = query.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.abstract.toLowerCase().includes(q) ||
        item.authors.some((a) => a.toLowerCase().includes(q)) ||
        item.institution.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleUpdateStatus = (id: string, newStatus: ResearchStatus) => {
    setResearchStatus(id, newStatus);
    toast.success(`Updated status to ${newStatus}`);
  };

  const handleDelete = (id: string) => {
    deleteResearch(id);
    toast.success("Submission deleted permanently.");
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin Portal · Verification Hub"
        title="Scientific Content Moderation"
        description="Verify manuscripts, reports, and datasets submitted by researchers before public dissemination on the National Polar Knowledge Repository."
      />

      {/* Filter and Search Bar */}
      <div className="glass flex flex-wrap items-center justify-between gap-4 rounded-2xl p-4 glow-soft">
        <div className="flex flex-1 min-w-[240px] items-center gap-2 rounded-xl border border-input bg-background/60 px-3 py-2">
          <Search size={16} className="text-muted-foreground shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, author, or institution…"
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {[
            { label: "Pending Review", value: "Under Review" },
            { label: "Published", value: "Published" },
            { label: "Rejected", value: "Rejected" },
            { label: "All Items", value: "All" },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setTab(item.value)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
                tab === item.value
                  ? "bg-primary text-primary-foreground glow-primary"
                  : "bg-secondary/60 text-muted-foreground hover:text-foreground",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Submissions Moderation Table */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-5 glow-soft border border-border/80 flex flex-col justify-between gap-4 lg:flex-row lg:items-center"
          >
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={item.status} />
                <RegionTag region={item.region} />
                <span className="rounded bg-secondary px-2 py-0.5 font-mono text-[10px] font-semibold uppercase text-secondary-foreground">
                  {item.topic}
                </span>
                <span className="font-mono text-xs text-muted-foreground">· {item.year}</span>
              </div>

              <h3
                onClick={() => setActiveItem(item)}
                className="mt-2 font-display text-base font-bold text-foreground hover:text-primary transition-colors cursor-pointer"
              >
                {item.title}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Authors: <strong className="text-foreground/90">{item.authors.join(", ")}</strong> ·{" "}
                {item.institution}
              </p>
              <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{item.abstract}</p>
            </div>

            {/* Moderation Controls */}
            <div className="flex flex-wrap items-center gap-2 shrink-0 border-t border-border pt-3 lg:border-t-0 lg:pt-0">
              <button
                onClick={() => setActiveItem(item)}
                className="rounded-lg border border-border bg-secondary/60 px-3 py-1.5 text-xs font-semibold text-foreground hover:border-primary/40"
              >
                View Full
              </button>

              {item.status !== "Published" && (
                <button
                  onClick={() => handleUpdateStatus(item.id, "Published")}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white transition-opacity hover:opacity-90 shadow-sm"
                >
                  <CheckCircle2 size={13} /> Approve
                </button>
              )}

              {item.status !== "Rejected" && (
                <button
                  onClick={() => handleUpdateStatus(item.id, "Rejected")}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-1.5 text-xs font-bold text-rose-400 transition-colors hover:bg-rose-500/20"
                >
                  <XCircle size={13} /> Reject
                </button>
              )}

              <button
                onClick={() => handleDelete(item.id)}
                className="rounded-lg p-2 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
                title="Delete item"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="glass rounded-2xl p-12 text-center text-muted-foreground border border-border">
            <FileText size={32} className="mx-auto mb-2 text-muted-foreground/60" />
            <h4 className="font-display text-sm font-semibold text-foreground">
              No submissions found
            </h4>
            <p className="text-xs mt-0.5">No manuscripts match the selected status filter.</p>
          </div>
        )}
      </div>

      {activeItem && <ResearchDetailModal item={activeItem} onClose={() => setActiveItem(null)} />}
    </div>
  );
}
