import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ImageOff, Search } from "lucide-react";
import { EmptyState, PageHeader } from "@/components/polaris/core";
import { MediaCard, MediaLightbox } from "@/components/polaris/cards";
import { mediaAssets } from "@/lib/data/media";
import type { MediaAsset, MediaType } from "@/lib/data/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/user/media")({
  head: () => ({
    meta: [
      { title: "Polar Media Gallery — POLARIS" },
      {
        name: "description",
        content:
          "Browse polar images, videos and infographics from Arctic and Antarctic expeditions.",
      },
      { property: "og:title", content: "Polar Media Gallery — POLARIS" },
      { property: "og:description", content: "Images, videos and infographics from both poles." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MediaPage,
});

const TABS: { key: MediaType | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "image", label: "Images" },
  { key: "video", label: "Videos" },
  { key: "infographic", label: "Infographics" },
];
const REGIONS = ["All", "Arctic", "Antarctic"];

function MediaPage() {
  const [tab, setTab] = useState<MediaType | "all">("all");
  const [region, setRegion] = useState("All");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<MediaAsset | null>(null);

  const topics = useMemo(
    () => ["All", ...Array.from(new Set(mediaAssets.map((m) => m.topic)))],
    [],
  );
  const [topic, setTopic] = useState("All");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return mediaAssets.filter((m) => {
      if (tab !== "all" && m.type !== tab) return false;
      if (region !== "All" && m.region !== region) return false;
      if (topic !== "All" && m.topic !== topic) return false;
      if (q && ![m.title, m.description, m.credit].join(" ").toLowerCase().includes(q))
        return false;
      return true;
    });
  }, [tab, region, topic, query]);

  const selectCls =
    "rounded-lg border border-input bg-secondary/60 px-3 py-2 text-xs font-medium text-foreground outline-none focus:border-primary/50";

  return (
    <div>
      <PageHeader
        eyebrow="User Portal"
        title="Media Gallery"
        description="Expedition photography, mission videos and scientific infographics from both polar regions."
      />

      <div className="glass rounded-2xl p-4 glow-soft">
        <div className="flex flex-wrap items-center gap-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-xs font-semibold transition-all",
                tab === t.key
                  ? "border-primary/40 bg-primary/15 text-primary glow-primary"
                  : "border-border bg-secondary/50 text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label}
            </button>
          ))}
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className={selectCls}
              aria-label="Filter by region"
            >
              {REGIONS.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className={selectCls}
              aria-label="Filter by topic"
            >
              {topics.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-input bg-background/60 px-3 py-2.5">
          <Search size={16} className="shrink-0 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search media titles, descriptions, credits…"
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <p className="mt-5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
        {results.length} asset{results.length === 1 ? "" : "s"}
      </p>

      {results.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            icon={<ImageOff size={20} />}
            title="No media matches"
            description="Try another tab, region or search term — the gallery spans both poles."
          />
        </div>
      ) : (
        <div className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {results.map((m) => (
            <MediaCard key={m.id} asset={m} onOpen={setOpen} />
          ))}
        </div>
      )}

      <MediaLightbox asset={open} onClose={() => setOpen(null)} />
    </div>
  );
}
