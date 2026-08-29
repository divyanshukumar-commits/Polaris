import { useMemo, useState } from "react";
import {
  Bookmark,
  Compass,
  Download,
  Filter,
  Flame,
  Globe2,
  Library,
  MountainSnow,
  RotateCcw,
  Satellite,
  Search,
  Waves,
} from "lucide-react";
import type { Expedition, ResearchItem } from "@/lib/data/types";
import { expeditions } from "@/lib/data/expeditions";
import { useApp } from "@/lib/store";
import { ExpeditionCard, ResearchCard, ResearchDetailModal } from "./cards";
import { ExpeditionDetailModal } from "./expedition-detail";
import { EmptyState } from "./core";
import { ExpeditionPanel } from "./map";
import { InteractiveGlobe } from "./interactive-globe";
import { cn } from "@/lib/utils";

const selectCls =
  "rounded-xl border border-input bg-secondary/70 px-3.5 py-2 text-xs font-medium text-foreground outline-none transition-colors focus:border-primary/50";

const REGIONS = ["All", "Arctic", "Antarctic"];
const TOPICS = [
  "All",
  "Climate",
  "Glaciology",
  "Oceanography",
  "Wildlife",
  "Meteorology",
  "Geology",
  "Space & Satellite",
];
const TYPES = ["All", "Research Paper", "Report", "Article", "Dataset", "Educational Resource"];

/* ---------- Enhanced Knowledge repository browser ---------- */
export function ResearchBrowser({ onlyPublished = true }: { onlyPublished?: boolean }) {
  const { allResearch } = useApp();
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("All");
  const [topic, setTopic] = useState("All");
  const [type, setType] = useState("All");
  const [sort, setSort] = useState<"recent" | "views" | "oldest">("recent");
  const [open, setOpen] = useState<ResearchItem | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = allResearch.filter((r) => (onlyPublished ? r.status === "Published" : true));
    if (region !== "All") list = list.filter((r) => r.region === region);
    if (topic !== "All") list = list.filter((r) => r.topic === topic);
    if (type !== "All") list = list.filter((r) => r.type === type);
    if (q) {
      list = list.filter((r) =>
        [r.title, r.abstract, r.institution, r.authors.join(" "), r.tags.join(" ")]
          .join(" ")
          .toLowerCase()
          .includes(q),
      );
    }
    return [...list].sort((a, b) =>
      sort === "views" ? b.views - a.views : sort === "oldest" ? a.year - b.year : b.year - a.year,
    );
  }, [allResearch, query, region, topic, type, sort, onlyPublished]);

  const resetFilters = () => {
    setQuery("");
    setRegion("All");
    setTopic("All");
    setType("All");
    setSort("recent");
  };

  const hasActiveFilters = query || region !== "All" || topic !== "All" || type !== "All";

  return (
    <div className="space-y-6">
      {/* Top Topic Filter Pills */}
      <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-1">
        {TOPICS.map((t) => (
          <button
            key={t}
            onClick={() => setTopic(t)}
            className={cn(
              "shrink-0 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all",
              topic === t
                ? "bg-primary text-primary-foreground glow-primary shadow-sm"
                : "bg-secondary/70 text-muted-foreground hover:text-foreground hover:bg-secondary border border-border/50",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Main Glass Search & Filter Control Bar */}
      <div className="glass flex flex-col gap-3 rounded-2xl p-4 glow-soft border border-border/80">
        <div className="flex items-center gap-2.5 rounded-xl border border-input bg-background/80 px-3.5 py-2.5">
          <Search size={17} className="shrink-0 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search verified publications by title, author, NCPOR/ISRO institution, or keyword…"
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className={selectCls}
            aria-label="Filter by region"
          >
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                Region: {r}
              </option>
            ))}
          </select>

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className={selectCls}
            aria-label="Filter by content type"
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>
                Type: {t}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className={cn(selectCls, "ml-auto")}
            aria-label="Sort results"
          >
            <option value="recent">Sort: Newest first</option>
            <option value="views">Sort: Most viewed</option>
            <option value="oldest">Sort: Oldest first</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 rounded-xl border border-border bg-secondary/40 px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              <RotateCcw size={12} /> Reset
            </button>
          )}
        </div>
      </div>

      {/* Result Metrics */}
      <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
        <span>
          Showing <strong className="text-foreground">{results.length}</strong> verified research
          item
          {results.length === 1 ? "" : "s"}
        </span>
        <span>National Polar Data Repository</span>
      </div>

      {/* Research Cards Grid */}
      {results.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            icon={<Library size={20} />}
            title="Nothing matches those filters"
            description="Try broadening your search or resetting filters to explore all Arctic and Antarctic research records."
          />
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {results.map((r) => (
            <ResearchCard key={r.id} item={r} onOpen={setOpen} />
          ))}
        </div>
      )}

      <ResearchDetailModal item={open} onClose={() => setOpen(null)} />
    </div>
  );
}

/* ---------- Expeditions Explorer Component ---------- */
export function ExpeditionsExplorer() {
  const [selected, setSelected] = useState<Expedition | null>(expeditions[0] ?? null);
  const [detailExpedition, setDetailExpedition] = useState<Expedition | null>(null);
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = useMemo(() => {
    if (statusFilter === "All") return expeditions;
    return expeditions.filter((e) => e.status === statusFilter);
  }, [statusFilter]);

  const selectExpedition = (expedition: Expedition) => setSelected(expedition);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <InteractiveGlobe className="h-[520px] w-full" onSelect={selectExpedition} />
        </div>
        <div className="lg:col-span-4">
          {selected ? (
            <ExpeditionPanel
              expedition={selected}
              onClose={() => setSelected(null)}
              onOpenDetail={(exp) => setDetailExpedition(exp)}
            />
          ) : (
            <div className="glass rounded-3xl p-10 text-center text-muted-foreground border border-border">
              <Compass size={32} className="mx-auto mb-2 text-primary/60" />
              <p className="text-xs">
                Click on any colored expedition pin on the polar sphere to inspect details.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="pt-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="font-display text-lg font-bold text-foreground">
            All Active & Historic Polar Expeditions ({filtered.length})
          </h3>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={selectCls}
            aria-label="Filter expeditions by status"
          >
            <option value="All">All statuses</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="Upcoming">Upcoming</option>
          </select>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((e) => (
            <ExpeditionCard
              key={e.id}
              expedition={e}
              onView={(exp) => {
                setSelected(exp);
                setDetailExpedition(exp);
              }}
            />
          ))}
        </div>
      </div>

      {/* Full Expedition Detail Modal */}
      <ExpeditionDetailModal
        expedition={detailExpedition}
        onClose={() => setDetailExpedition(null)}
      />
    </div>
  );
}

/* ---------- Saved Library Grid ---------- */
export function SavedGrid() {
  const { allResearch, savedIds } = useApp();
  const [open, setOpen] = useState<ResearchItem | null>(null);

  const savedItems = useMemo(
    () => allResearch.filter((r) => savedIds.includes(r.id)),
    [allResearch, savedIds],
  );

  if (savedItems.length === 0) {
    return (
      <EmptyState
        icon={<Bookmark size={22} />}
        title="Your library is currently empty"
        description="Click the bookmark icon on any research paper, dataset, or report in the repository to save it here for fast reference."
      />
    );
  }

  return (
    <div>
      <p className="mb-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
        {savedItems.length} Saved Item{savedItems.length === 1 ? "" : "s"}
      </p>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {savedItems.map((r) => (
          <ResearchCard key={r.id} item={r} onOpen={setOpen} />
        ))}
      </div>
      <ResearchDetailModal item={open} onClose={() => setOpen(null)} />
    </div>
  );
}
