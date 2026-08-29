import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import {
  Camera,
  Download,
  Film,
  Globe2,
  Image as ImageIcon,
  ImageOff,
  Plus,
  Search,
  Upload,
  Video,
  X,
  FileText,
} from "lucide-react";
import { EmptyState, PageHeader, RegionTag, StatCard } from "@/components/polaris/core";
import { MediaCard } from "@/components/polaris/cards";
import { mediaAssets as initialMediaAssets } from "@/lib/data/media";
import type { MediaAsset, MediaType, Region, Topic } from "@/lib/data/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/researcher/media")({
  head: () => ({
    meta: [
      { title: "Scientific Media & Telemetry Gallery — POLARIS Researcher" },
      {
        name: "description",
        content:
          "Expedition field photography, telemetry imagery, high-resolution scientific media and observational video records.",
      },
      { property: "og:title", content: "Media & Telemetry Gallery — POLARIS" },
      {
        property: "og:description",
        content: "High-resolution expedition and mission media from both polar regions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ResearcherMediaPage,
});

const TABS: { key: MediaType | "all"; label: string; icon: typeof ImageIcon }[] = [
  { key: "all", label: "All Assets", icon: Globe2 },
  { key: "image", label: "Field Images", icon: ImageIcon },
  { key: "video", label: "Video Records", icon: Video },
  { key: "infographic", label: "Infographics", icon: FileText },
];

const REGIONS: ("All" | Region)[] = ["All", "Antarctic", "Arctic"];
const LOCAL_STORAGE_MEDIA_KEY = "polaris-researcher-media";

function getStoredResearcherMedia(): MediaAsset[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_MEDIA_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredResearcherMedia(items: MediaAsset[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_MEDIA_KEY, JSON.stringify(items));
  } catch {
    // Ignore storage quota errors
  }
}

function ResearcherMediaPage() {
  const [tab, setTab] = useState<MediaType | "all">("all");
  const [region, setRegion] = useState<string>("All");
  const [topic, setTopic] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<MediaAsset | null>(null);
  const [customMedia, setCustomMedia] = useState<MediaAsset[]>([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Form states for new media submission
  const [formTitle, setFormTitle] = useState("");
  const [formType, setFormType] = useState<MediaType>("image");
  const [formRegion, setFormRegion] = useState<Region>("Antarctic");
  const [formTopic, setFormTopic] = useState<Topic>("Glaciology");
  const [formCredit, setFormCredit] = useState("NCPOR Expedition Team");
  const [formYear, setFormYear] = useState(new Date().getFullYear());
  const [formImageUrl, setFormImageUrl] = useState("");
  const [formVideoUrl, setFormVideoUrl] = useState("");
  const [formDuration, setFormDuration] = useState("");
  const [formDescription, setFormDescription] = useState("");

  useEffect(() => {
    setCustomMedia(getStoredResearcherMedia());
  }, []);

  const allAssets = useMemo(() => {
    return [...customMedia, ...initialMediaAssets];
  }, [customMedia]);

  const topics = useMemo(
    () => ["All", ...Array.from(new Set(allAssets.map((m) => m.topic)))],
    [allAssets],
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allAssets.filter((m) => {
      if (tab !== "all" && m.type !== tab) return false;
      if (region !== "All" && m.region !== region) return false;
      if (topic !== "All" && m.topic !== topic) return false;
      if (
        q &&
        ![m.title, m.description, m.credit, m.topic, m.region].join(" ").toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [allAssets, tab, region, topic, query]);

  const stats = useMemo(() => {
    const total = allAssets.length;
    const images = allAssets.filter((a) => a.type === "image").length;
    const videos = allAssets.filter((a) => a.type === "video").length;
    const infographics = allAssets.filter((a) => a.type === "infographic").length;
    return { total, images, videos, infographics };
  }, [allAssets]);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDescription.trim()) {
      toast.error("Please fill in required title and description fields");
      return;
    }

    const newAsset: MediaAsset = {
      id: `custom-med-${Date.now()}`,
      title: formTitle.trim(),
      type: formType,
      region: formRegion,
      topic: formTopic,
      credit: formCredit.trim() || "Polar Researcher Field Record",
      year: Number(formYear) || new Date().getFullYear(),
      description: formDescription.trim(),
      imageUrl: formImageUrl.trim() || undefined,
      videoUrl: formType === "video" ? formVideoUrl.trim() || undefined : undefined,
      duration: formType === "video" && formDuration.trim() ? formDuration.trim() : undefined,
      views: 1,
      seed: Math.floor(Math.random() * 100) + 1,
    };

    const updated = [newAsset, ...customMedia];
    setCustomMedia(updated);
    saveStoredResearcherMedia(updated);

    toast.success("Field media submitted successfully", {
      description: `"${newAsset.title}" is now recorded in your scientific media repository.`,
    });

    // Reset form
    setFormTitle("");
    setFormDescription("");
    setFormImageUrl("");
    setFormVideoUrl("");
    setFormDuration("");
    setIsUploadOpen(false);
  };

  const selectCls =
    "rounded-xl border border-input bg-secondary/70 px-3.5 py-2 text-xs font-medium text-foreground outline-none focus:border-primary/50 transition-colors";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <PageHeader
          eyebrow="Researcher Portal · Field Media & Imagery"
          title="Scientific Media & Telemetry Gallery"
          description="High-resolution expedition photography, sensor telemetry frames, mission video logs, and scientific infographics."
        />
        <button
          onClick={() => setIsUploadOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-md transition-all hover:opacity-90 glow-primary cursor-pointer"
        >
          <Upload size={15} />
          Submit Field Media
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={<Globe2 size={16} />} label="Total Media Records" value={stats.total} />
        <StatCard icon={<ImageIcon size={16} />} label="Field Photographs" value={stats.images} />
        <StatCard icon={<Film size={16} />} label="Mission Video Logs" value={stats.videos} />
        <StatCard
          icon={<FileText size={16} />}
          label="Infographics / Models"
          value={stats.infographics}
        />
      </div>

      {/* Filter and search bar */}
      <div className="glass rounded-2xl p-4.5 glow-soft space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Tab filter buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = tab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer",
                    active
                      ? "border-primary/40 bg-primary/15 text-primary glow-primary"
                      : "border-border bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary",
                  )}
                >
                  <Icon size={13} className={active ? "text-primary" : "text-muted-foreground"} />
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Region and Topic dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className={selectCls}
              aria-label="Filter by region"
            >
              {REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r === "All" ? "All Regions" : `${r} Region`}
                </option>
              ))}
            </select>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className={selectCls}
              aria-label="Filter by scientific topic"
            >
              {topics.map((top) => (
                <option key={top} value={top}>
                  {top === "All" ? "All Disciplines" : top}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Text Search Input */}
        <div className="flex items-center gap-2.5 rounded-xl border border-input bg-background/70 px-3.5 py-2.5 shadow-inner">
          <Search size={16} className="shrink-0 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search scientific media by title, description, expedition station, camera credit, or topic…"
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-xs text-muted-foreground hover:text-foreground p-1"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          Showing {results.length} scientific asset{results.length === 1 ? "" : "s"}
        </p>
        {(tab !== "all" || region !== "All" || topic !== "All" || query) && (
          <button
            onClick={() => {
              setTab("all");
              setRegion("All");
              setTopic("All");
              setQuery("");
            }}
            className="text-xs font-semibold text-primary hover:underline cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Media Results Grid */}
      {results.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            icon={<ImageOff size={24} />}
            title="No matching scientific media"
            description="No records found matching your selected filters or search terms. Try adjusting your query or submit a new field asset."
          />
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {results.map((asset) => (
            <MediaCard key={asset.id} asset={asset} onOpen={setOpen} />
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal with Researcher Actions */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 p-4 backdrop-blur-sm"
          onClick={() => setOpen(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="glass-strong w-full max-w-3xl overflow-hidden rounded-2xl glow-primary"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              {open.type === "video" && open.videoUrl ? (
                <video
                  src={open.videoUrl}
                  poster={open.imageUrl}
                  controls
                  playsInline
                  preload="metadata"
                  className="aspect-video w-full object-cover"
                  aria-label={open.title}
                />
              ) : open.imageUrl ? (
                <img
                  src={open.imageUrl}
                  alt={open.title}
                  className="aspect-video w-full object-cover"
                />
              ) : (
                <div className="aspect-video w-full flex items-center justify-center bg-secondary/50">
                  <Camera size={36} className="text-muted-foreground/60" />
                </div>
              )}
              <button
                onClick={() => setOpen(null)}
                aria-label="Close lightbox"
                className="absolute right-3 top-3 rounded-lg bg-background/70 p-2 text-foreground backdrop-blur-sm hover:bg-background cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <RegionTag region={open.region} />
                  <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-secondary-foreground">
                    {open.topic}
                  </span>
                  <span className="rounded-full bg-primary/10 border border-primary/20 px-2 py-0.5 font-mono text-[10px] uppercase text-primary">
                    {open.type}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">{open.year}</span>
                </div>
                <button
                  onClick={() => {
                    toast.success("Citation and metadata copied to clipboard", {
                      description: `${open.title} (${open.year}). Credit: ${open.credit}.`,
                    });
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary/60 px-3 py-1.5 text-xs font-semibold text-foreground hover:border-primary/40 transition-colors cursor-pointer"
                >
                  <Download size={13} />
                  Export Citation / Metadata
                </button>
              </div>

              <div>
                <h2 className="font-display text-xl font-bold text-foreground">{open.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {open.description}
                </p>
              </div>

              <div className="border-t border-border pt-3 flex flex-wrap items-center justify-between text-xs text-muted-foreground">
                <p>
                  <strong className="text-foreground">Credit:</strong> {open.credit}
                </p>
                <p className="font-mono">{open.views.toLocaleString()} verified views</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submit Field Media Modal */}
      <AnimatePresence>
        {isUploadOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => setIsUploadOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="glass-strong w-full max-w-2xl overflow-hidden rounded-3xl p-6 shadow-2xl border border-primary/25 glow-primary max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary border border-primary/25">
                    <Camera size={18} />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-foreground">
                      Submit Field Media Record
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Register expedition photography, telemetry frames, or observational video.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsUploadOpen(false)}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleUploadSubmit} className="mt-5 space-y-4">
                {/* Title */}
                <div>
                  <label className="text-xs font-semibold text-foreground">
                    Media Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g., Drone Mapping of Schirmacher Oasis Moraine"
                    className="mt-1 w-full rounded-xl border border-input bg-secondary/50 px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary"
                  />
                </div>

                {/* Type, Region, Topic grid */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div>
                    <label className="text-xs font-semibold text-foreground">Media Type</label>
                    <select
                      value={formType}
                      onChange={(e) => setFormType(e.target.value as MediaType)}
                      className="mt-1 w-full rounded-xl border border-input bg-secondary/50 px-3 py-2.5 text-xs text-foreground outline-none focus:border-primary"
                    >
                      <option value="image">Field Image</option>
                      <option value="video">Video Record</option>
                      <option value="infographic">Infographic / Model</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground">Region</label>
                    <select
                      value={formRegion}
                      onChange={(e) => setFormRegion(e.target.value as Region)}
                      className="mt-1 w-full rounded-xl border border-input bg-secondary/50 px-3 py-2.5 text-xs text-foreground outline-none focus:border-primary"
                    >
                      <option value="Antarctic">Antarctic</option>
                      <option value="Arctic">Arctic</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground">Topic</label>
                    <select
                      value={formTopic}
                      onChange={(e) => setFormTopic(e.target.value as Topic)}
                      className="mt-1 w-full rounded-xl border border-input bg-secondary/50 px-3 py-2.5 text-xs text-foreground outline-none focus:border-primary"
                    >
                      <option value="Glaciology">Glaciology</option>
                      <option value="Climate">Climate</option>
                      <option value="Oceanography">Oceanography</option>
                      <option value="Wildlife">Wildlife</option>
                      <option value="Meteorology">Meteorology</option>
                      <option value="Geology">Geology</option>
                      <option value="Space & Satellite">Space & Satellite</option>
                    </select>
                  </div>
                </div>

                {/* Credit & Year grid */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold text-foreground">
                      Credit / Institution
                    </label>
                    <input
                      value={formCredit}
                      onChange={(e) => setFormCredit(e.target.value)}
                      placeholder="e.g. 44th ISEA / Maitri Base"
                      className="mt-1 w-full rounded-xl border border-input bg-secondary/50 px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground">Year of Capture</label>
                    <input
                      type="number"
                      value={formYear}
                      onChange={(e) => setFormYear(Number(e.target.value))}
                      className="mt-1 w-full rounded-xl border border-input bg-secondary/50 px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary"
                    />
                  </div>
                </div>

                {/* Image URL & Video URL */}
                <div>
                  <label className="text-xs font-semibold text-foreground">
                    Image / Preview URL
                  </label>
                  <input
                    type="url"
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/... or hosted preview link"
                    className="mt-1 w-full rounded-xl border border-input bg-secondary/50 px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary"
                  />
                </div>

                {formType === "video" && (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold text-foreground">
                        Video Stream URL
                      </label>
                      <input
                        type="url"
                        value={formVideoUrl}
                        onChange={(e) => setFormVideoUrl(e.target.value)}
                        placeholder="https://.../video.mp4"
                        className="mt-1 w-full rounded-xl border border-input bg-secondary/50 px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-foreground">
                        Duration (e.g. 04:30)
                      </label>
                      <input
                        value={formDuration}
                        onChange={(e) => setFormDuration(e.target.value)}
                        placeholder="04:30"
                        className="mt-1 w-full rounded-xl border border-input bg-secondary/50 px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                )}

                {/* Description */}
                <div>
                  <label className="text-xs font-semibold text-foreground">
                    Scientific Description / Field Context <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Briefly describe the observation site, sensor equipment, or scientific significance of this media asset..."
                    className="mt-1 w-full rounded-xl border border-input bg-secondary/50 px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setIsUploadOpen(false)}
                    className="rounded-xl border border-border px-4 py-2.5 text-xs font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-md transition-all hover:opacity-90 glow-primary cursor-pointer"
                  >
                    <Plus size={15} />
                    Register Media Record
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
