import { useMemo, useState } from "react";
import {
  Activity,
  ArrowDownUp,
  Bookmark,
  BookmarkCheck,
  Calendar,
  Camera,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Download,
  ExternalLink,
  FileCheck,
  FilePlus,
  FileSpreadsheet,
  FileText,
  History,
  Image as ImageIcon,
  Layers,
  MapPin,
  Maximize2,
  Play,
  Share2,
  ShieldCheck,
  Sparkles,
  Users,
  Upload,
  X,
} from "lucide-react";
import { toast } from "sonner";
import type { Expedition, MediaAsset, ResearchGalleryItem, ResearchItem } from "@/lib/data/types";
import { expeditionById } from "@/lib/data/expeditions";
import { mediaAssets } from "@/lib/data/media";
import { getResearchAttachments, getResearchGallery, getResearchTimeline } from "@/lib/data/research";
import { useApp } from "@/lib/store";
import { RegionTag, SectionTitle, StatusBadge } from "./core";
import { cn } from "@/lib/utils";
import { canDownloadResearchItem, downloadResearchItem } from "@/lib/download";

/* ---------- Procedural polar visual (no external images) ---------- */
export function MediaVisual({
  seed,
  className,
  imageUrl,
  alt = "Polar science media",
}: {
  seed: number;
  className?: string | undefined;
  imageUrl?: string | undefined;
  alt?: string | undefined;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const { stops, stars } = useMemo(() => {
    const rand = (n: number) => {
      const x = Math.sin(seed * 999 + n * 77.7) * 10000;
      return x - Math.floor(x);
    };
    const hueA = 190 + rand(1) * 70;
    const hueB = 210 + rand(2) * 60;
    const stops = [
      `oklch(0.28 0.08 ${hueB})`,
      `oklch(0.45 0.1 ${hueA})`,
      `oklch(0.7 0.12 ${hueA + 20})`,
    ];
    const stars = Array.from({ length: 14 }, (_, i) => ({
      x: rand(10 + i) * 100,
      y: rand(40 + i) * 55,
      r: 0.5 + rand(70 + i) * 1.1,
    }));
    return { stops, stars };
  }, [seed]);

  if (imageUrl && !imageFailed) {
    return (
      <img
        src={imageUrl}
        alt={alt}
        loading="lazy"
        onError={() => setImageFailed(true)}
        className={cn("block h-full w-full object-cover", className)}
      />
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <svg viewBox="0 0 400 225" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id={`sky-${seed}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={stops[0]} />
            <stop offset="60%" stopColor={stops[1]} />
            <stop offset="100%" stopColor={stops[2]} />
          </linearGradient>
          <linearGradient id={`aur-${seed}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="oklch(0.75 0.15 165)" stopOpacity="0" />
            <stop offset="50%" stopColor="oklch(0.8 0.16 170)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="oklch(0.75 0.14 200)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width="400" height="225" fill={`url(#sky-${seed})`} />
        {stars.map((s, i) => (
          <circle key={i} cx={s.x * 4} cy={s.y * 2.25} r={s.r} fill="white" opacity="0.7" />
        ))}
        <path
          d={`M0 ${70 + (seed % 30)} Q 100 ${30 + (seed % 40)} 200 ${60 + (seed % 25)} T 400 ${50 + (seed % 35)} V 120 Q 300 100 200 115 T 0 110 Z`}
          fill={`url(#aur-${seed})`}
          className="animate-aurora"
        />
        {/* ice ridges */}
        <path
          d="M0 170 L60 140 L120 165 L190 130 L260 160 L330 135 L400 165 V225 H0 Z"
          fill="oklch(0.85 0.05 230)"
          opacity="0.9"
        />
        <path
          d="M0 195 L80 172 L150 192 L230 168 L310 190 L400 175 V225 H0 Z"
          fill="oklch(0.92 0.03 225)"
        />
      </svg>
    </div>
  );
}

/* ---------- Research ---------- */
export function ResearchCard({
  item,
  onOpen,
}: {
  item: ResearchItem;
  onOpen: (r: ResearchItem) => void;
}) {
  const { toggleSaved, isSaved } = useApp();
  const saved = isSaved(item.id);
  return (
    <article className="glass card-hover-lift group flex flex-col rounded-2xl p-5 glow-soft">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <RegionTag region={item.region} />
          <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-secondary-foreground">
            {item.topic}
          </span>
        </div>
        <button
          aria-label={saved ? "Remove from saved" : "Save research"}
          onClick={(e) => {
            e.stopPropagation();
            const added = toggleSaved(item.id);
            toast(added ? "Saved to your library" : "Removed from saved", {
              description: item.title.slice(0, 60) + "…",
            });
          }}
          className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
        >
          {saved ? <BookmarkCheck size={16} className="text-primary" /> : <Bookmark size={16} />}
        </button>
      </div>
      <h3 className="mt-3 font-display text-[15px] font-semibold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
        {item.title}
      </h3>
      {item.publisherName && (
        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
          {item.publisherImageUrl ? (
            <img
              src={item.publisherImageUrl}
              alt=""
              className="h-6 w-6 rounded-full object-cover"
            />
          ) : (
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary">
              {item.publisherName.slice(0, 1)}
            </span>
          )}
          <span>{item.publisherName}</span>
        </div>
      )}
      <p className="mt-1.5 text-xs text-muted-foreground">
        {item.authors.slice(0, 2).join(", ")}
        {item.authors.length > 2 && " et al."} · {item.year}
      </p>
      <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground line-clamp-3">
        {item.abstract}
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {item.tags.slice(0, 3).map((t) => (
          <span
            key={t}
            className="rounded-md bg-accent/60 px-2 py-0.5 text-[10px] font-medium text-accent-foreground"
          >
            #{t}
          </span>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
        <span className="font-mono text-[10px] text-muted-foreground">
          {item.views.toLocaleString()} views
        </span>
        <div className="flex items-center gap-2">
          {canDownloadResearchItem(item) && (
            <button
              onClick={() => {
                downloadResearchItem(item);
                toast.success("Research download started");
              }}
              aria-label={`Download ${item.title}`}
              title="Download research paper"
              className="rounded-lg border border-border bg-secondary p-2 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
            >
              <Download size={14} />
            </button>
          )}
          {item.downloadUrl && !canDownloadResearchItem(item) && (
            <span
              className="rounded-lg border border-amber-400/20 bg-amber-400/10 px-2 py-1.5 text-[10px] font-semibold text-amber-200"
              title="This resource is restricted or not verified"
            >
              Restricted
            </span>
          )}
          <button
            onClick={() => onOpen(item)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 border border-primary/25 px-3 py-1.5 text-xs font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground"
          >
            View Details <ExternalLink size={12} />
          </button>
        </div>
      </div>
    </article>
  );
}

export function ResearchDetailModal({
  item,
  onClose,
}: {
  item: ResearchItem | null;
  onClose: () => void;
}) {
  const { toggleSaved, isSaved } = useApp();
  const [activeTab, setActiveTab] = useState<"overview" | "gallery" | "timeline" | "files">("overview");
  const [selectedPhoto, setSelectedPhoto] = useState<ResearchGalleryItem | null>(null);
  const [showAllTimeline, setShowAllTimeline] = useState(false);
  const [isTimelineReversed, setIsTimelineReversed] = useState(false);

  if (!item) return null;

  const expedition = expeditionById(item.expeditionId);
  const saved = isSaved(item.id);
  const gallery = getResearchGallery(item);
  const timelineRaw = getResearchTimeline(item);
  const timelineEvents = isTimelineReversed ? [...timelineRaw].reverse() : timelineRaw;
  const attachments = getResearchAttachments(item);

  const displayedTimeline = showAllTimeline ? timelineEvents : timelineEvents.slice(0, 4);

  const getTimelineIcon = (iconType?: string, status?: string) => {
    switch (iconType) {
      case "created":
        return <FilePlus size={14} className="text-cyan-400" />;
      case "upload":
        return <Upload size={14} className="text-blue-400" />;
      case "collaborator":
        return <Users size={14} className="text-purple-400" />;
      case "submitted":
        return <FileCheck size={14} className="text-emerald-400" />;
      case "review":
        return <Clock size={14} className="text-amber-400" />;
      case "approved":
      case "published":
        return <CheckCircle2 size={14} className="text-emerald-400" />;
      case "activity":
        return <Activity size={14} className="text-cyan-400" />;
      default:
        return <Sparkles size={14} className="text-primary" />;
    }
  };

  const getTimelineStatusBadge = (status?: string) => {
    switch (status) {
      case "success":
        return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
      case "warning":
        return "bg-amber-500/15 text-amber-300 border-amber-500/30";
      case "rejected":
        return "bg-rose-500/15 text-rose-300 border-rose-500/30";
      case "pending":
        return "bg-blue-500/15 text-blue-300 border-blue-500/30";
      default:
        return "bg-cyan-500/10 text-cyan-300 border-cyan-500/25";
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 backdrop-blur-md sm:p-6 overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="glass-strong relative my-auto w-full max-w-3xl overflow-hidden rounded-3xl border border-cyan-500/30 bg-[#071322]/95 shadow-2xl glow-primary max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-border/80 px-6 py-4 bg-secondary/30">
          <div className="flex flex-wrap items-center gap-2">
            <RegionTag region={item.region} />
            <StatusBadge status={item.status} />
            <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-secondary-foreground">
              {item.type}
            </span>
            <span className="font-mono text-xs text-cyan-300 font-semibold">
              {item.topic}
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg border border-border bg-secondary/50 p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold leading-tight text-foreground">
              {item.title}
            </h2>
            <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              {item.publisherImageUrl ? (
                <img
                  src={item.publisherImageUrl}
                  alt={`${item.publisherName ?? "Publisher"} profile`}
                  className="h-8 w-8 rounded-full border border-primary/30 object-cover"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 font-bold text-primary text-xs">
                  {(item.publisherName || item.authors[0] || "P").slice(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <p className="font-semibold text-foreground">
                  {item.publisherName ?? item.authors.join(", ")}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {item.institution} · {item.publicationDate ?? item.year}
                  {item.location ? ` · 📍 ${item.location}` : ""}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-border">
            <div className="flex gap-2">
              {[
                { key: "overview", label: "Abstract & Findings" },
                {
                  key: "gallery",
                  label: `Research Media (${gallery.length})`,
                },
                {
                  key: "timeline",
                  label: `Lifecycle Timeline (${timelineEvents.length})`,
                },
                {
                  key: "files",
                  label: `Attached Files (${attachments.length})`,
                },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as typeof activeTab)}
                  className={cn(
                    "px-3.5 py-2 text-xs font-bold transition-all border-b-2 cursor-pointer",
                    activeTab === tab.key
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground",
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab 1: Overview */}
          {activeTab === "overview" && (
            <div className="space-y-5">
              <div>
                <h3 className="font-mono text-xs uppercase font-bold tracking-wider text-cyan-300 mb-1.5 flex items-center gap-1.5">
                  <FileText size={13} /> Plain Summary & Abstract
                </h3>
                <p className="text-sm leading-relaxed text-foreground/85">{item.abstract}</p>
              </div>

              <div>
                <h3 className="font-mono text-xs uppercase font-bold tracking-wider text-cyan-300 mb-2 flex items-center gap-1.5">
                  <Sparkles size={13} /> Key Observational Findings
                </h3>
                <div className="space-y-2">
                  {(item.keyFindings ?? [item.abstract]).map((f, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-border/80 bg-secondary/30 p-3 text-xs text-foreground/90 flex items-start gap-2.5"
                    >
                      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-primary/20 font-mono text-[11px] font-bold text-primary shrink-0">
                        {i + 1}
                      </span>
                      <span className="leading-relaxed">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {expedition && (
                <div>
                  <h3 className="font-mono text-xs uppercase font-bold tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                    <MapPin size={13} className="text-primary" /> Associated Field Expedition
                  </h3>
                  <div className="flex items-center justify-between rounded-xl border border-border bg-secondary/30 p-3 text-xs">
                    <div>
                      <p className="font-bold text-foreground">{expedition.name}</p>
                      <p className="text-muted-foreground mt-0.5">{expedition.location}</p>
                    </div>
                    <StatusBadge status={expedition.status} />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Research Media Gallery (Prominent Research Photos Only) */}
          {activeTab === "gallery" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase font-bold text-muted-foreground">
                  Attached Field Imagery & Observational Figures
                </span>
                <span className="font-mono text-[10px] text-cyan-300">
                  {gallery.length} Verified Photos
                </span>
              </div>

              {gallery.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {gallery.map((photo, idx) => (
                    <div
                      key={photo.id}
                      onClick={() => setSelectedPhoto(photo)}
                      className="glass card-hover-lift group overflow-hidden rounded-2xl border border-border/80 cursor-pointer bg-secondary/30"
                    >
                      <div className="relative aspect-video overflow-hidden bg-black/40">
                        <img
                          src={photo.url}
                          alt={photo.caption}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white">
                            <Maximize2 size={13} /> Click for fullscreen view
                          </span>
                        </div>
                        {photo.tag && (
                          <span className="absolute top-2 left-2 rounded-md bg-black/70 px-2 py-0.5 font-mono text-[10px] text-cyan-300 backdrop-blur-sm">
                            {photo.tag}
                          </span>
                        )}
                        <span className="absolute top-2 right-2 rounded-md bg-black/70 px-2 py-0.5 font-mono text-[10px] text-white/80 backdrop-blur-sm">
                          Fig. {idx + 1}
                        </span>
                      </div>
                      <div className="p-3.5 space-y-1">
                        <p className="text-xs font-semibold text-foreground line-clamp-2">
                          {photo.caption}
                        </p>
                        {photo.credit && (
                          <p className="font-mono text-[10px] text-muted-foreground truncate">
                            Credit: {photo.credit}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="glass rounded-2xl p-10 text-center text-muted-foreground border border-border">
                  <ImageIcon size={32} className="mx-auto mb-2 text-primary/50" />
                  <p className="text-sm font-semibold text-foreground">No Research Imagery Attached</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    No field photographs or scientific diagrams have been attached to this specific research item.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Detailed Lifecycle Timeline */}
          {activeTab === "timeline" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase font-bold text-muted-foreground">
                  Audit Log & Verification Milestones
                </span>
                <button
                  onClick={() => setIsTimelineReversed(!isTimelineReversed)}
                  className="inline-flex items-center gap-1 text-[11px] font-mono text-cyan-300 hover:underline cursor-pointer"
                >
                  <ArrowDownUp size={12} />
                  {isTimelineReversed ? "Oldest First" : "Newest First"}
                </button>
              </div>

              {/* Vertical timeline matching POLARIS design */}
              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-cyan-500 before:via-primary/50 before:to-transparent">
                {displayedTimeline.map((event) => (
                  <div key={event.id} className="relative group">
                    {/* Node Dot */}
                    <div className="absolute -left-6 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#071322] border-2 border-primary shadow-sm">
                      {getTimelineIcon(event.iconType, event.status)}
                    </div>

                    <div className="glass rounded-xl border border-border/80 bg-secondary/30 p-3.5 space-y-1.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="text-xs font-bold text-foreground">{event.action}</h4>
                        <span
                          className={cn(
                            "rounded-full border px-2 py-0.5 font-mono text-[10px] font-bold uppercase",
                            getTimelineStatusBadge(event.status),
                          )}
                        >
                          {event.status || "Completed"}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1 font-mono text-cyan-300">
                          <Clock size={11} /> {event.date}
                        </span>
                        <span>·</span>
                        <span className="font-medium text-foreground/90">
                          👤 {event.actor}
                        </span>
                        {event.actorRole && (
                          <span className="text-[10px] text-muted-foreground">
                            ({event.actorRole})
                          </span>
                        )}
                      </div>

                      {event.note && (
                        <p className="text-xs leading-relaxed text-slate-300 pt-1 border-t border-border/50">
                          {event.note}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {timelineEvents.length > 4 && (
                <div className="pt-2 text-center">
                  <button
                    onClick={() => setShowAllTimeline(!showAllTimeline)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-secondary/50 px-3.5 py-1.5 text-xs font-semibold text-primary hover:bg-secondary cursor-pointer"
                  >
                    {showAllTimeline ? (
                      <>
                        <ChevronUp size={14} /> Collapse older events
                      </>
                    ) : (
                      <>
                        <ChevronDown size={14} /> View all {timelineEvents.length} events
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Tab 4: Attached Files */}
          {activeTab === "files" && (
            <div className="space-y-3">
              <span className="font-mono text-[11px] uppercase font-bold text-muted-foreground block">
                Primary Manuscripts & Sensor Packages
              </span>

              {attachments.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between rounded-xl border border-border bg-secondary/30 p-3.5 gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary shrink-0 border border-primary/25">
                      {file.category === "dataset" ? (
                        <FileSpreadsheet size={20} />
                      ) : (
                        <FileText size={20} />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-foreground truncate">{file.name}</p>
                      <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground mt-0.5">
                        <span>{file.sizeFormatted}</span>
                        <span>·</span>
                        <span className="uppercase text-cyan-300">{file.category}</span>
                        <span>·</span>
                        <span>Uploaded: {file.uploadedAt}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (!file.url) {
                        toast.error("The source file is not available in this browser session.");
                        return;
                      }
                      const anchor = document.createElement("a");
                      anchor.href = file.url;
                      anchor.download = file.name;
                      document.body.appendChild(anchor);
                      anchor.click();
                      anchor.remove();
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer shrink-0"
                  >
                    <Download size={13} />
                    <span>Download</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="border-t border-border/80 px-6 py-3.5 bg-secondary/30 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <ShieldCheck size={15} className="text-primary" />
            <span>National Polar Data Centre (NPDC) · DOI Verified Record</span>
          </div>

          <div className="flex items-center gap-2">
            {canDownloadResearchItem(item) && (
              <button
                onClick={() => {
                  downloadResearchItem(item);
                  toast.success("Research download started");
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 px-3.5 py-2 text-xs font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground cursor-pointer"
              >
                <Download size={13} /> Download Manuscript
              </button>
            )}

            <button
              onClick={() => {
                const added = toggleSaved(item.id);
                toast(added ? "Saved to your library" : "Removed from saved");
              }}
              className="rounded-xl border border-border bg-secondary px-3.5 py-2 text-xs font-semibold text-secondary-foreground hover:border-primary/40 cursor-pointer"
            >
              {saved ? "Saved ✓" : "Save"}
            </button>

            <button
              onClick={() => {
                if (typeof window !== "undefined") {
                  navigator.clipboard
                    ?.writeText(
                      `${window.location.origin}/user/repository?research=${encodeURIComponent(item.id)}`,
                    )
                    .catch(() => {});
                  toast.success("Link copied to clipboard");
                }
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-secondary px-3.5 py-2 text-xs font-semibold text-secondary-foreground hover:border-primary/40 cursor-pointer"
            >
              <Share2 size={13} /> Share
            </button>
          </div>
        </div>

        {/* Fullscreen Photo Lightbox Zoom */}
        {selectedPhoto && (
          <div
            className="fixed inset-0 z-60 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
            onClick={() => setSelectedPhoto(null)}
          >
            <div
              className="relative max-w-4xl w-full overflow-hidden rounded-2xl bg-black/80 border border-border/80 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.caption}
                className="max-h-[75vh] w-full object-contain mx-auto"
              />
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-3 right-3 rounded-full bg-black/70 p-2 text-white hover:bg-black cursor-pointer"
                aria-label="Close photo"
              >
                <X size={18} />
              </button>
              <div className="p-4 bg-[#071322] border-t border-border">
                <p className="text-sm font-semibold text-white">{selectedPhoto.caption}</p>
                {selectedPhoto.credit && (
                  <p className="font-mono text-xs text-cyan-300 mt-1">
                    Credit: {selectedPhoto.credit}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Expedition ---------- */
export function ExpeditionCard({
  expedition,
  onView,
}: {
  expedition: Expedition;
  onView?: (e: Expedition) => void;
}) {
  return (
    <article className="glass card-hover-lift flex flex-col justify-between rounded-2xl p-5 glow-soft">
      <div>
        <div className="flex items-center justify-between gap-2">
          <RegionTag region={expedition.region} />
          <StatusBadge status={expedition.status} />
        </div>
        <h3 className="mt-3 font-display text-[15px] font-semibold leading-snug text-foreground line-clamp-2">
          {expedition.name}
        </h3>
        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin size={12} className="text-primary shrink-0" /> {expedition.location}
        </p>
        <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground line-clamp-2">
          {expedition.plainSummary || expedition.summary || expedition.objective}
        </p>
      </div>
      <div>
        <div className="mt-3 flex items-center gap-4 text-[11px] text-muted-foreground border-t border-border/50 pt-2">
          <span className="inline-flex items-center gap-1">
            <Users size={12} /> {expedition.team ?? expedition.members ?? 0} members
          </span>
          <span className="inline-flex items-center gap-1">
            <Calendar size={12} />{" "}
            {expedition.startDate?.slice(0, 4) ?? expedition.startYear ?? "TBD"} →{" "}
            {expedition.endDate?.slice(0, 4) ?? expedition.endYear ?? "Ongoing"}
          </span>
        </div>
        <button
          onClick={() => onView?.(expedition)}
          className="w-full mt-3 rounded-xl border border-primary/25 bg-primary/10 px-3 py-2 text-xs font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground cursor-pointer"
        >
          View Expedition Report
        </button>
      </div>
    </article>
  );
}

/* ---------- Media ---------- */
export function MediaCard({
  asset,
  onOpen,
}: {
  asset: MediaAsset;
  onOpen: (m: MediaAsset) => void;
}) {
  return (
    <button
      onClick={() => onOpen(asset)}
      className="glass card-hover-lift group overflow-hidden rounded-2xl text-left glow-soft"
    >
      <div className="relative">
        {asset.type === "video" && asset.videoUrl ? (
          <video
            src={asset.videoUrl}
            poster={asset.imageUrl}
            muted
            loop
            autoPlay
            playsInline
            preload="metadata"
            className="aspect-video w-full object-cover"
            aria-label={asset.title}
          />
        ) : (
          <MediaVisual
            seed={asset.seed}
            imageUrl={asset.imageUrl}
            alt={asset.title}
            className="aspect-video"
          />
        )}
        {asset.type === "video" && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-background/60 border border-primary/40 backdrop-blur-md transition-transform group-hover:scale-110">
              <Play size={18} className="ml-0.5 text-primary" />
            </span>
          </span>
        )}
        <span className="absolute left-2 top-2 rounded-md bg-background/70 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-primary backdrop-blur-sm">
          {asset.type}
        </span>
        {asset.duration && (
          <span className="absolute bottom-2 right-2 rounded bg-background/80 px-1.5 py-0.5 font-mono text-[10px] text-foreground">
            {asset.duration}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-display text-sm font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {asset.title}
        </h3>
        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{asset.description}</p>
        <div className="mt-2.5 flex items-center justify-between">
          <RegionTag region={asset.region} />
          <span className="font-mono text-[10px] text-muted-foreground">
            {asset.views.toLocaleString()} views
          </span>
        </div>
      </div>
    </button>
  );
}

export function MediaLightbox({
  asset,
  onClose,
}: {
  asset: MediaAsset | null;
  onClose: () => void;
}) {
  if (!asset) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="glass-strong w-full max-w-3xl overflow-hidden rounded-2xl glow-primary"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          {asset.type === "video" && asset.videoUrl ? (
            <video
              src={asset.videoUrl}
              poster={asset.imageUrl}
              controls
              playsInline
              preload="metadata"
              className="aspect-video w-full object-cover"
              aria-label={asset.title}
            />
          ) : (
            <MediaVisual
              seed={asset.seed}
              imageUrl={asset.imageUrl}
              alt={asset.title}
              className="aspect-video"
            />
          )}
          {asset.type === "video" && !asset.videoUrl && (
            <span className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/40">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 border border-primary/50 backdrop-blur-md glow-primary">
                <Play size={26} className="ml-1 text-primary" />
              </span>
              <span className="font-mono text-xs text-foreground/80">
                Preview stream · {asset.duration}
              </span>
            </span>
          )}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 rounded-lg bg-background/70 p-2 text-foreground backdrop-blur-sm hover:bg-background"
          >
            <X size={16} />
          </button>
        </div>
        <div className="p-5">
          <div className="flex flex-wrap items-center gap-2">
            <RegionTag region={asset.region} />
            <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-secondary-foreground">
              {asset.topic}
            </span>
            <span className="font-mono text-[10px] text-muted-foreground">{asset.year}</span>
          </div>
          <h3 className="mt-2 font-display text-xl font-bold text-foreground">{asset.title}</h3>
          <p className="mt-1.5 text-sm text-muted-foreground">{asset.description}</p>
          <p className="mt-3 font-mono text-[11px] text-muted-foreground">
            Credit: {asset.credit} · {asset.views.toLocaleString()} views
          </p>
        </div>
      </div>
    </div>
  );
}

export { SectionTitle };
export { ExpeditionDetailModal } from "./expedition-detail";
