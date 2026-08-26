import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FilePlus,
  Filter,
  Plus,
  Search,
  Trash2,
  Upload,
  X,
  FileText,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import { PageHeader, RegionTag, StatusBadge } from "@/components/polaris/core";
import { ResearchDetailModal } from "@/components/polaris/cards";
import { useApp } from "@/lib/store";
import type { ContentType, PolarRegion, ResearchItem, ResearchStatus, ScientificTopic } from "@/lib/data/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/researcher/research")({
  head: () => ({
    meta: [
      { title: "My Research & Submissions — POLARIS" },
      {
        name: "description",
        content: "Submit and manage polar research papers, datasets, and peer review statuses.",
      },
      { property: "og:title", content: "My Research — POLARIS" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MyResearchPage,
});

const TYPES: ContentType[] = [
  "Research Paper",
  "Report",
  "Article",
  "Dataset",
  "Educational Resource",
];
const REGIONS: PolarRegion[] = ["Antarctic", "Arctic"];
const TOPICS: ScientificTopic[] = [
  "Climate",
  "Glaciology",
  "Oceanography",
  "Wildlife",
  "Meteorology",
  "Geology",
  "Space & Satellite",
];

function MyResearchPage() {
  const { allResearch, submitResearch, deleteResearch } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<ResearchItem | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [type, setType] = useState<ContentType>("Research Paper");
  const [region, setRegion] = useState<PolarRegion>("Antarctic");
  const [topic, setTopic] = useState<ScientificTopic>("Glaciology");
  const [authors, setAuthors] = useState("Dr. Geeta Nair, NCPOR Team");
  const [institution, setInstitution] = useState("National Centre for Polar and Ocean Research (NCPOR)");
  const [year, setYear] = useState(2026);
  const [doi, setDoi] = useState("10.1016/j.polar.2026.");
  const [abstract, setAbstract] = useState("");
  const [tags, setTags] = useState("NCPOR, Antarctica, Ice Dynamics");

  const filtered = allResearch.filter((item) => {
    if (filterStatus !== "All" && item.status !== filterStatus) return false;
    if (query) {
      const q = query.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.abstract.toLowerCase().includes(q) ||
        item.topic.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !abstract.trim()) {
      toast.error("Please fill in the title and abstract.");
      return;
    }

    const newItem: ResearchItem = {
      id: `res-${Date.now()}`,
      title: title.trim(),
      type,
      region,
      topic,
      authors: authors.split(",").map((a) => a.trim()).filter(Boolean),
      institution: institution.trim(),
      year: Number(year) || 2026,
      abstract: abstract.trim(),
      doi: doi.trim() || undefined,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      keyFindings: [],
      status: "Under Review",
      views: 0,
    };

    submitResearch(newItem);
    toast.success("Research submitted successfully!", {
      description: "Your submission has been queued for admin review (Status: Under Review).",
    });

    // Reset Form & Close Modal
    setTitle("");
    setAbstract("");
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Researcher Portal · Submission Hub"
        title="My Research & Submissions"
        description="Manage your published literature, upload new preprints or raw datasets, and track the status of papers submitted for administrative verification."
      >
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-md transition-opacity hover:opacity-90 glow-primary"
        >
          <Plus size={16} /> Submit New Research
        </button>
      </PageHeader>

      {/* Filter and Search Bar */}
      <div className="glass flex flex-wrap items-center justify-between gap-4 rounded-2xl p-4 glow-soft">
        <div className="flex flex-1 min-w-[240px] items-center gap-2 rounded-xl border border-input bg-background/60 px-3 py-2">
          <Search size={16} className="text-muted-foreground shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search my manuscripts by title, keyword, or topic…"
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {["All", "Published", "Under Review", "Draft", "Rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
                filterStatus === status
                  ? "bg-primary text-primary-foreground glow-primary"
                  : "bg-secondary/60 text-muted-foreground hover:text-foreground",
              )}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass card-hover-lift flex flex-col justify-between rounded-2xl p-5 glow-soft md:flex-row md:items-center gap-4"
          >
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={item.status} />
                <RegionTag region={item.region} />
                <span className="rounded bg-secondary px-2 py-0.5 font-mono text-[10px] uppercase text-secondary-foreground font-semibold">
                  {item.type}
                </span>
                <span className="font-mono text-xs text-muted-foreground">· {item.year}</span>
              </div>
              <h3
                onClick={() => setDetailItem(item)}
                className="mt-2 font-display text-base font-bold text-foreground hover:text-primary transition-colors cursor-pointer"
              >
                {item.title}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {item.authors.join(", ")} · <span className="text-foreground/80">{item.institution}</span>
              </p>
              <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{item.abstract}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0 md:flex-col md:items-end">
              <button
                onClick={() => setDetailItem(item)}
                className="rounded-lg border border-border bg-secondary/60 px-3 py-1.5 text-xs font-medium text-foreground hover:border-primary/40"
              >
                View Details
              </button>
              <button
                onClick={() => {
                  deleteResearch(item.id);
                  toast.success("Submission removed from workspace.");
                }}
                className="rounded-lg p-2 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
                title="Delete submission"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="glass rounded-2xl p-12 text-center text-muted-foreground">
            <FileText size={36} className="mx-auto mb-3 text-muted-foreground/60" />
            <h3 className="font-display text-base font-semibold text-foreground">No submissions found</h3>
            <p className="mt-1 text-xs">Try adjusting your search query or filter tabs.</p>
          </div>
        )}
      </div>

      {/* Submission Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-strong relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl p-6 md:p-8 glow-primary border border-primary/30"
            >
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/20 text-primary border border-primary/30">
                    <FilePlus size={18} />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold text-foreground">
                      Submit Research to POLARIS
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Submit a manuscript, report, or dataset for National Polar Repository ingestion.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Title *
                  </label>
                  <input
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Decadal Mass Balance Anomalies of Western Antarctic Ice Shelves"
                    className="w-full rounded-xl border border-input bg-background/80 px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary/60"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">Type</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as ContentType)}
                      className="w-full rounded-xl border border-input bg-background/80 px-3 py-2 text-xs text-foreground outline-none focus:border-primary/60"
                    >
                      {TYPES.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">Region</label>
                    <select
                      value={region}
                      onChange={(e) => setRegion(e.target.value as PolarRegion)}
                      className="w-full rounded-xl border border-input bg-background/80 px-3 py-2 text-xs text-foreground outline-none focus:border-primary/60"
                    >
                      {REGIONS.map((r) => (
                        <option key={r}>{r}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">Topic</label>
                    <select
                      value={topic}
                      onChange={(e) => setTopic(e.target.value as ScientificTopic)}
                      className="w-full rounded-xl border border-input bg-background/80 px-3 py-2 text-xs text-foreground outline-none focus:border-primary/60"
                    >
                      {TOPICS.map((top) => (
                        <option key={top}>{top}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">Authors</label>
                    <input
                      value={authors}
                      onChange={(e) => setAuthors(e.target.value)}
                      placeholder="e.g., Dr. Geeta Nair, Dr. S. Rao"
                      className="w-full rounded-xl border border-input bg-background/80 px-3.5 py-2 text-xs text-foreground outline-none focus:border-primary/60"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">Institution</label>
                    <input
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      placeholder="e.g., NCPOR / MoES"
                      className="w-full rounded-xl border border-input bg-background/80 px-3.5 py-2 text-xs text-foreground outline-none focus:border-primary/60"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">DOI (Optional)</label>
                    <input
                      value={doi}
                      onChange={(e) => setDoi(e.target.value)}
                      placeholder="10.1016/j.polar.2026..."
                      className="w-full rounded-xl border border-input bg-background/80 px-3.5 py-2 text-xs text-foreground outline-none focus:border-primary/60 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">Tags (Comma-separated)</label>
                    <input
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="Antarctica, Ice Core, Cryosphere"
                      className="w-full rounded-xl border border-input bg-background/80 px-3.5 py-2 text-xs text-foreground outline-none focus:border-primary/60"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Abstract *</label>
                  <textarea
                    required
                    rows={4}
                    value={abstract}
                    onChange={(e) => setAbstract(e.target.value)}
                    placeholder="Provide a comprehensive scientific abstract describing methodology, dataset parameters, and core findings..."
                    className="w-full rounded-xl border border-input bg-background/80 p-3 text-xs text-foreground outline-none focus:border-primary/60"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-xl border border-border px-4 py-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-md transition-opacity hover:opacity-90 glow-primary"
                  >
                    <Upload size={14} /> Submit for Review
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {detailItem && (
        <ResearchDetailModal item={detailItem} onClose={() => setDetailItem(null)} />
      )}
    </div>
  );
}
