import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Check,
  Copy,
  Download,
  ExternalLink,
  FileCode,
  FileText,
  Filter,
  Globe2,
  Quote,
  Search,
  Share2,
} from "lucide-react";
import { PageHeader, RegionTag, SectionTitle } from "@/components/polaris/core";
import { ResearchDetailModal } from "@/components/polaris/cards";
import { useApp } from "@/lib/store";
import type { ResearchItem } from "@/lib/data/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/researcher/discover")({
  head: () => ({
    meta: [
      { title: "Discover Research & Citations — POLARIS" },
      {
        name: "description",
        content: "Search polar literature, generate BibTeX/APA/RIS citations, and explore open polar datasets.",
      },
      { property: "og:title", content: "Discover Research — POLARIS" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DiscoverResearchPage,
});

function getCitation(item: ResearchItem, format: "bibtex" | "apa" | "ieee" | "ris") {
  const authorStr = item.authors.join(", ");
  const firstAuthorLast = item.authors[0]?.split(" ").pop()?.toLowerCase() || "polar";

  switch (format) {
    case "bibtex":
      return `@article{${firstAuthorLast}${item.year}${item.id},
  title = {${item.title}},
  author = {${item.authors.join(" and ")}},
  journal = {Polar Science Letters},
  year = {${item.year}},
  institution = {${item.institution}},
  doi = {${item.doi || "10.1016/j.polaris." + item.id}}
}`;
    case "apa":
      return `${authorStr} (${item.year}). ${item.title}. ${item.institution}. https://doi.org/${item.doi || "10.1016/j.polaris." + item.id}`;
    case "ieee":
      return `${authorStr}, "${item.title}," ${item.institution}, ${item.year}, doi: ${item.doi || "10.1016/j.polaris." + item.id}.`;
    case "ris":
      return `TY  - JOUR
TI  - ${item.title}
${item.authors.map((a) => `AU  - ${a}`).join("\n")}
PY  - ${item.year}
PB  - ${item.institution}
DO  - ${item.doi || "10.1016/j.polaris." + item.id}
ER  -`;
  }
}

function DiscoverResearchPage() {
  const { allResearch } = useApp();
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("All");
  const [topic, setTopic] = useState("All");
  const [selectedPaper, setSelectedPaper] = useState<ResearchItem | null>(null);
  const [citeItem, setCiteItem] = useState<ResearchItem | null>(null);
  const [citeFormat, setCiteFormat] = useState<"bibtex" | "apa" | "ieee" | "ris">("bibtex");
  const [copied, setCopied] = useState(false);

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    return allResearch.filter((item) => {
      if (region !== "All" && item.region !== region) return false;
      if (topic !== "All" && item.topic !== topic) return false;
      if (q) {
        return (
          item.title.toLowerCase().includes(q) ||
          item.abstract.toLowerCase().includes(q) ||
          item.institution.toLowerCase().includes(q) ||
          item.doi?.toLowerCase().includes(q) ||
          item.authors.some((a) => a.toLowerCase().includes(q)) ||
          item.tags.some((t) => t.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [allResearch, query, region, topic]);

  const handleCopyCitation = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Citation copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportDatasets = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(results, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "polaris_research_dataset.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success("Exported " + results.length + " metadata records (JSON).");
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Researcher Portal · Literature Discovery"
        title="Discover Polar Research"
        description="Search open-access polar science publications, export formal citations (BibTeX, APA, RIS), and download structured metadata."
      >
        <button
          onClick={handleExportDatasets}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-secondary/60 px-4 py-2.5 text-xs font-semibold text-foreground transition-colors hover:border-primary/40"
        >
          <Download size={14} className="text-primary" /> Export Results (JSON)
        </button>
      </PageHeader>

      {/* Search and Filters */}
      <div className="glass flex flex-col gap-3 rounded-2xl p-4 glow-soft">
        <div className="flex items-center gap-2 rounded-xl border border-input bg-background/60 px-3 py-2.5">
          <Search size={16} className="text-muted-foreground shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search publications by keyword, author, DOI, or telemetry parameter…"
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="rounded-lg border border-input bg-secondary/60 px-3 py-2 text-xs font-medium text-foreground outline-none focus:border-primary/50"
          >
            <option value="All">All Regions</option>
            <option value="Arctic">Arctic</option>
            <option value="Antarctic">Antarctic</option>
          </select>

          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="rounded-lg border border-input bg-secondary/60 px-3 py-2 text-xs font-medium text-foreground outline-none focus:border-primary/50"
          >
            <option value="All">All Topics</option>
            <option value="Climate">Climate</option>
            <option value="Glaciology">Glaciology</option>
            <option value="Oceanography">Oceanography</option>
            <option value="Wildlife">Wildlife</option>
            <option value="Space & Satellite">Space & Satellite</option>
          </select>

          <span className="ml-auto font-mono text-xs text-muted-foreground">
            {results.length} record{results.length === 1 ? "" : "s"} found
          </span>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {results.map((item) => (
          <motion.article
            key={item.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass card-hover-lift flex flex-col justify-between rounded-2xl p-5 glow-soft"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <RegionTag region={item.region} />
                  <span className="rounded bg-secondary px-2 py-0.5 font-mono text-[10px] uppercase font-semibold text-secondary-foreground">
                    {item.topic}
                  </span>
                </div>
                <span className="font-mono text-xs text-muted-foreground">{item.year}</span>
              </div>

              <h3
                onClick={() => setSelectedPaper(item)}
                className="mt-3 font-display text-base font-bold leading-snug text-foreground hover:text-primary transition-colors cursor-pointer"
              >
                {item.title}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {item.authors.join(", ")} · <span className="text-foreground/80">{item.institution}</span>
              </p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                {item.abstract}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between gap-2">
              <button
                onClick={() => setCiteItem(item)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Quote size={13} /> Cite Paper
              </button>

              <button
                onClick={() => setSelectedPaper(item)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
              >
                Inspect Paper <ExternalLink size={13} />
              </button>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Citation Generator Modal */}
      {citeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-strong relative w-full max-w-xl rounded-3xl p-6 md:p-8 glow-primary border border-primary/30"
          >
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Quote size={18} className="text-primary" />
                <h3 className="font-display text-base font-bold text-foreground">
                  Citation Generator
                </h3>
              </div>
              <button
                onClick={() => setCiteItem(null)}
                className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <p className="mt-3 text-xs font-medium text-muted-foreground line-clamp-2">
              {citeItem.title}
            </p>

            {/* Format Tabs */}
            <div className="mt-4 flex gap-1 rounded-xl border border-border bg-background/50 p-1">
              {(["bibtex", "apa", "ieee", "ris"] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setCiteFormat(fmt)}
                  className={cn(
                    "flex-1 rounded-lg py-1.5 text-xs font-mono font-bold uppercase transition-all",
                    citeFormat === fmt
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {fmt}
                </button>
              ))}
            </div>

            {/* Citation Output */}
            <pre className="mt-4 max-h-48 overflow-x-auto rounded-xl border border-border bg-background/80 p-4 font-mono text-xs leading-relaxed text-foreground whitespace-pre-wrap">
              {getCitation(citeItem, citeFormat)}
            </pre>

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setCiteItem(null)}
                className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
              >
                Close
              </button>
              <button
                onClick={() => handleCopyCitation(getCitation(citeItem, citeFormat))}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-md hover:opacity-90 glow-primary"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? "Copied!" : "Copy Citation"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {selectedPaper && (
        <ResearchDetailModal item={selectedPaper} onClose={() => setSelectedPaper(null)} />
      )}
    </div>
  );
}
