import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  CheckCircle2,
  FileDown,
  HardDrive,
  MapPin,
  Maximize2,
  RefreshCw,
  Share2,
  ShieldCheck,
  Sparkles,
  Users,
  Wifi,
  WifiOff,
  X,
  Download,
} from "lucide-react";
import type { Expedition, ExpeditionGalleryItem } from "@/lib/data/types";
import { RegionTag, StatusBadge } from "./core";
import { generateExpeditionPDF } from "@/lib/pdf-export";
import {
  cacheExpedition,
  getCachedExpedition,
  isExpeditionCached,
  removeCachedExpedition,
  useOfflineStatus,
} from "@/lib/offline-expeditions";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ExpeditionDetailModalProps {
  expedition: Expedition | null;
  onClose: () => void;
}

export function ExpeditionDetailModal({ expedition, onClose }: ExpeditionDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "gallery" | "objectives" | "telemetry">(
    "overview",
  );
  const [selectedPhoto, setSelectedPhoto] = useState<ExpeditionGalleryItem | null>(null);
  const [isCached, setIsCached] = useState(false);
  const { isOnline, isSyncing, syncNow, toggleSimulatedOffline, isSimulatedOffline } =
    useOfflineStatus();

  useEffect(() => {
    if (expedition) {
      // Auto-cache when viewed so it is instantly available offline
      cacheExpedition(expedition);
      setIsCached(isExpeditionCached(expedition.id));
    }
  }, [expedition]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (expedition) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [expedition]);

  if (!expedition) return null;

  const cachedRecord = getCachedExpedition(expedition.id);
  const cachedTime = cachedRecord
    ? new Date(cachedRecord.cachedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const toggleCache = () => {
    if (isCached) {
      removeCachedExpedition(expedition.id);
      setIsCached(false);
      toast.info("Removed from offline cache", {
        description: `"${expedition.name}" is no longer cached locally.`,
      });
    } else {
      cacheExpedition(expedition);
      setIsCached(true);
      toast.success("Expedition saved for offline viewing", {
        description: `"${expedition.name}" and all field records are available without internet.`,
      });
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href).catch(() => {});
      toast.success("Expedition link copied to clipboard");
    }
  };

  const handleDownloadPDF = () => {
    generateExpeditionPDF(expedition);
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 backdrop-blur-md sm:p-6 overflow-y-auto"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="glass-strong relative my-auto w-full max-w-4xl overflow-hidden rounded-3xl border border-cyan-500/30 bg-[#071322]/95 shadow-2xl glow-primary max-h-[92vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Offline Status Banner if Offline */}
          {!isOnline && (
            <div className="flex items-center justify-between bg-amber-500/15 border-b border-amber-500/30 px-5 py-2 text-xs text-amber-200">
              <div className="flex items-center gap-2 font-medium">
                <WifiOff size={14} className="text-amber-400 shrink-0" />
                <span>
                  <strong>Offline Mode:</strong> Viewing cached expedition record
                  {cachedTime ? ` (cached ${cachedTime})` : ""}.
                </span>
              </div>
              <button
                onClick={syncNow}
                disabled={isSyncing}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/20 px-2.5 py-1 text-[11px] font-bold text-amber-300 hover:bg-amber-500/30 transition-colors cursor-pointer"
              >
                <RefreshCw size={12} className={cn("shrink-0", isSyncing && "animate-spin")} />
                {isSyncing ? "Checking connection..." : "Sync / Retry"}
              </button>
            </div>
          )}

          {/* Modal Header Bar */}
          <div className="relative border-b border-border/80 px-6 py-4 flex flex-wrap items-center justify-between gap-3 bg-secondary/30">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={expedition.status} />
              <RegionTag region={expedition.region} />
              {expedition.researchArea && (
                <span className="rounded-full bg-cyan-500/10 border border-cyan-500/25 px-2.5 py-0.5 text-[11px] font-semibold text-cyan-300">
                  {expedition.researchArea}
                </span>
              )}
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-1.5">
              {/* Online / Offline Status Badge */}
              <button
                onClick={toggleSimulatedOffline}
                title={
                  isOnline
                    ? "Connected to POLARIS network. Click to test offline mode."
                    : "Offline mode active. Click to toggle live network simulation."
                }
                className={cn(
                  "hidden sm:inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-mono transition-colors",
                  isOnline
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                    : "border-amber-500/40 bg-amber-500/15 text-amber-300",
                )}
              >
                {isOnline ? <Wifi size={12} /> : <WifiOff size={12} />}
                <span>{isOnline ? "Online" : "Offline Cache"}</span>
              </button>

              {/* Cache toggle */}
              <button
                onClick={toggleCache}
                title={isCached ? "Cached locally. Click to remove." : "Save for offline access"}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer",
                  isCached
                    ? "border-primary/40 bg-primary/20 text-primary glow-soft"
                    : "border-border bg-secondary/50 text-muted-foreground hover:text-foreground",
                )}
              >
                <HardDrive size={13} />
                <span className="hidden sm:inline">{isCached ? "Cached" : "Cache"}</span>
              </button>

              {/* PDF Download Button */}
              <button
                onClick={handleDownloadPDF}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-md transition-all hover:opacity-90 glow-primary cursor-pointer"
                title="Download printable expedition PDF report"
              >
                <FileDown size={14} />
                <span>Download PDF</span>
              </button>

              {/* Share button */}
              <button
                onClick={handleShare}
                className="rounded-lg border border-border bg-secondary/50 p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer"
                title="Share link"
              >
                <Share2 size={15} />
              </button>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="rounded-lg border border-border bg-secondary/50 p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer ml-1"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Modal Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Title & Location Header */}
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight leading-snug">
                {expedition.name}
              </h2>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5 text-foreground/90 font-medium">
                  <MapPin size={14} className="text-primary" /> {expedition.location}
                </span>
                <span className="font-mono text-[11px] text-primary">
                  {expedition.lat > 0 ? `${expedition.lat}°N` : `${Math.abs(expedition.lat)}°S`},{" "}
                  {expedition.lon > 0 ? `${expedition.lon}°E` : `${Math.abs(expedition.lon)}°W`}
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Calendar size={13} /> {expedition.startDate || expedition.startYear} →{" "}
                  {expedition.endDate || expedition.endYear || "Ongoing"}
                </span>
              </div>
            </div>

            {/* Plain-Language Research Summary Callout */}
            <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/30 p-4.5 glow-soft relative overflow-hidden">
              <div className="flex items-start gap-3.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-300 shrink-0 border border-cyan-500/30">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h4 className="font-mono text-[10px] uppercase font-bold tracking-widest text-cyan-300">
                    Research Summary · Plain Language
                  </h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-200">
                    {expedition.plainSummary ||
                      expedition.summary ||
                      expedition.description ||
                      "Long-term polar environmental and cryosphere monitoring mission under the Ministry of Earth Sciences."}
                  </p>
                </div>
              </div>
            </div>

            {/* Lead Researcher & Key Expedition Parameters Row */}
            <div className="grid gap-4 md:grid-cols-12">
              {/* Lead Researcher Card */}
              <div className="md:col-span-6 rounded-2xl border border-border bg-secondary/30 p-4 flex items-center gap-4">
                {expedition.leadAvatar ? (
                  <img
                    src={expedition.leadAvatar}
                    alt={expedition.lead || "Lead Scientist"}
                    className="h-16 w-16 rounded-2xl object-cover border-2 border-primary/40 shadow-md shrink-0"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center font-bold text-primary text-xl shrink-0">
                    {(expedition.lead || "Lead").slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground block font-semibold">
                    Lead Expedition Scientist
                  </span>
                  <h3 className="text-base font-bold text-foreground truncate">
                    {expedition.lead || "Principal Investigator"}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                    {expedition.leadRole || "Lead Polar Researcher"}
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-primary">
                    <Users size={13} />
                    <span>{expedition.members || expedition.team || 0} Total Team Members</span>
                  </div>
                </div>
              </div>

              {/* Key Details Metadata Box */}
              <div className="md:col-span-6 rounded-2xl border border-border bg-secondary/30 p-4 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="font-mono text-[10px] text-muted-foreground uppercase block font-semibold">
                    Station / Base Depot
                  </span>
                  <p className="font-bold text-foreground mt-0.5 truncate">
                    {expedition.stationRef || "Field Expedition"}
                  </p>
                </div>
                <div>
                  <span className="font-mono text-[10px] text-muted-foreground uppercase block font-semibold">
                    Sponsoring Agency
                  </span>
                  <p className="font-bold text-foreground mt-0.5 truncate">
                    {expedition.leadAgency || "NCPOR / MoES"}
                  </p>
                </div>
                <div>
                  <span className="font-mono text-[10px] text-muted-foreground uppercase block font-semibold">
                    Telemetry Status
                  </span>
                  <p className="font-semibold text-emerald-400 mt-0.5 truncate flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    Operational
                  </p>
                </div>
                <div>
                  <span className="font-mono text-[10px] text-muted-foreground uppercase block font-semibold">
                    Offline Available
                  </span>
                  <p className="font-semibold text-cyan-300 mt-0.5 flex items-center gap-1">
                    <HardDrive size={12} /> Yes (Cached)
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-border">
              <div className="flex gap-2">
                {[
                  { key: "overview", label: "Overview & Objectives" },
                  {
                    key: "gallery",
                    label: `Field Image Gallery (${expedition.gallery?.length || 1})`,
                  },
                  { key: "telemetry", label: "Findings & Telemetry" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as typeof activeTab)}
                    className={cn(
                      "px-4 py-2.5 text-xs font-bold transition-all border-b-2 cursor-pointer",
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

            {/* Tab Contents */}
            {activeTab === "overview" && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-mono text-[11px] uppercase font-bold tracking-wider text-muted-foreground">
                    Comprehensive Mission Description
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {expedition.description || expedition.objective}
                  </p>
                </div>

                <div>
                  <h4 className="font-mono text-[11px] uppercase font-bold tracking-wider text-muted-foreground mb-2">
                    Key Scientific Work Packages & Objectives
                  </h4>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {(
                      expedition.objectives ?? (expedition.objective ? [expedition.objective] : [])
                    ).map((obj, i) => (
                      <div
                        key={i}
                        className="rounded-xl border border-border/80 bg-secondary/30 p-3 flex items-start gap-2.5 text-xs text-foreground/90"
                      >
                        <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
                        <span>{obj}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "gallery" && (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  {(
                    expedition.gallery || [
                      {
                        id: "default-img",
                        url:
                          expedition.imageUrl ||
                          "https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=800&q=80",
                        caption: `${expedition.name} field campaign operations.`,
                        credit: expedition.leadAgency || "NCPOR Photo Archives",
                        tag: "Field Operations",
                      },
                    ]
                  ).map((photo, index) => (
                    <div
                      key={photo.id}
                      onClick={() => setSelectedPhoto(photo)}
                      className="glass card-hover-lift group overflow-hidden rounded-2xl border border-border/80 cursor-pointer"
                    >
                      <div className="relative aspect-video overflow-hidden bg-secondary/50">
                        <img
                          src={photo.url}
                          alt={photo.caption}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-white">
                            <Maximize2 size={13} /> Click to expand
                          </span>
                        </div>
                        {photo.tag && (
                          <span className="absolute top-2 left-2 rounded-md bg-black/60 px-2 py-0.5 font-mono text-[10px] text-cyan-300 backdrop-blur-sm">
                            {photo.tag}
                          </span>
                        )}
                        <span className="absolute top-2 right-2 rounded-md bg-black/60 px-2 py-0.5 font-mono text-[10px] text-white/80 backdrop-blur-sm">
                          Fig. {index + 1}
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
              </div>
            )}

            {activeTab === "telemetry" && (
              <div className="space-y-4">
                <div className="rounded-2xl border border-border bg-secondary/30 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-mono text-[11px] uppercase font-bold text-muted-foreground">
                      Telemetry Feeds & Satellite Sensor Array
                    </h4>
                    <span className="rounded-full bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 font-mono text-[10px] font-bold">
                      LIVE STREAM
                    </span>
                  </div>
                  <p className="text-xs text-foreground/90 font-medium">
                    {expedition.telemetryStatus ||
                      "Automatic telemetry packets relayed via INSAT-3DR and Iridium satellite links."}
                  </p>
                </div>

                {expedition.keyFindings && expedition.keyFindings.length > 0 && (
                  <div>
                    <h4 className="font-mono text-[11px] uppercase font-bold tracking-wider text-muted-foreground mb-2">
                      Key Observational Findings to Date
                    </h4>
                    <div className="space-y-2">
                      {expedition.keyFindings.map((finding, idx) => (
                        <div
                          key={idx}
                          className="rounded-xl border border-border/80 bg-secondary/30 p-3 text-xs text-slate-200 flex items-start gap-2.5"
                        >
                          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-primary/20 font-mono text-[11px] font-bold text-primary shrink-0">
                            {idx + 1}
                          </span>
                          <span className="leading-relaxed">{finding}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Modal Footer Bar */}
          <div className="border-t border-border/80 px-6 py-3.5 bg-secondary/30 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <ShieldCheck size={15} className="text-primary" />
              <span>Verified Scientific Record · National Polar Data Centre (NPDC)</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleDownloadPDF}
                className="font-semibold text-primary hover:underline cursor-pointer flex items-center gap-1"
              >
                <Download size={13} /> Printable PDF Report
              </button>
              <span>·</span>
              <button
                onClick={onClose}
                className="font-semibold hover:text-foreground cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>

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
    </AnimatePresence>
  );
}
