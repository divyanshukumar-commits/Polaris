import { useMemo, useState } from "react";
import { Bookmark, BookmarkCheck, Calendar, ExternalLink, MapPin, Play, Share2, Users, X } from "lucide-react";
import { toast } from "sonner";
import type { Expedition, MediaAsset, ResearchItem } from "@/lib/data/types";
import { expeditionById } from "@/lib/data/expeditions";
import { mediaAssets } from "@/lib/data/media";
import { useApp } from "@/lib/store";
import { RegionTag, SectionTitle, StatusBadge } from "./core";
import { cn } from "@/lib/utils";

/* ---------- Procedural polar visual (no external images) ---------- */
export function MediaVisual({
  seed,
  className,
  imageUrl,
  alt = "Polar science media",
}: {
  seed: number;
  className?: string;
  imageUrl?: string;
  alt?: string;
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
        <path d="M0 170 L60 140 L120 165 L190 130 L260 160 L330 135 L400 165 V225 H0 Z" fill="oklch(0.85 0.05 230)" opacity="0.9" />
        <path d="M0 195 L80 172 L150 192 L230 168 L310 190 L400 175 V225 H0 Z" fill="oklch(0.92 0.03 225)" />
      </svg>
    </div>
  );
}

/* ---------- Research ---------- */
export function ResearchCard({ item, onOpen }: { item: ResearchItem; onOpen: (r: ResearchItem) => void }) {
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
      <p className="mt-1.5 text-xs text-muted-foreground">
        {item.authors.slice(0, 2).join(", ")}
        {item.authors.length > 2 && " et al."} · {item.year}
      </p>
      <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground line-clamp-3">{item.abstract}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {item.tags.slice(0, 3).map((t) => (
          <span key={t} className="rounded-md bg-accent/60 px-2 py-0.5 text-[10px] font-medium text-accent-foreground">
            #{t}
          </span>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
        <span className="font-mono text-[10px] text-muted-foreground">{item.views.toLocaleString()} views</span>
        <button
          onClick={() => onOpen(item)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 border border-primary/25 px-3 py-1.5 text-xs font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground"
        >
          View Details <ExternalLink size={12} />
        </button>
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
  if (!item) return null;
  const expedition = expeditionById(item.expeditionId);
  const relatedMedia = mediaAssets.filter((m) => m.topic === item.topic).slice(0, 3);
  const saved = isSaved(item.id);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="glass-strong max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl p-6 glow-primary"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <RegionTag region={item.region} />
            <StatusBadge status={item.status} />
            <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-secondary-foreground">
              {item.type}
            </span>
          </div>
          <button onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground">
            <X size={18} />
          </button>
        </div>
        <h2 className="mt-4 font-display text-2xl font-bold leading-tight text-foreground">{item.title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {item.authors.join(", ")} · {item.institution} · {item.year}
        </p>

        <h3 className="mt-6 font-display text-sm font-semibold uppercase tracking-wider text-primary">Abstract</h3>
        <p className="mt-2 text-sm leading-relaxed text-foreground/85">{item.abstract}</p>

        <h3 className="mt-6 font-display text-sm font-semibold uppercase tracking-wider text-primary">Key Findings</h3>
        <ul className="mt-2 space-y-2">
          {(item.keyFindings ?? [item.abstract]).map((f, i) => (
            <li key={i} className="flex gap-2.5 text-sm text-foreground/85">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              {f}
            </li>
          ))}
        </ul>

        {expedition && (
          <>
            <h3 className="mt-6 font-display text-sm font-semibold uppercase tracking-wider text-primary">Related Expedition</h3>
            <div className="mt-2 flex items-center gap-3 rounded-xl border border-border bg-secondary/40 p-3">
              <MapPin size={16} className="shrink-0 text-primary" />
              <div>
                <p className="text-sm font-semibold text-foreground">{expedition.name}</p>
                <p className="text-xs text-muted-foreground">{expedition.location}</p>
              </div>
              <StatusBadge status={expedition.status} className="ml-auto" />
            </div>
          </>
        )}

        {relatedMedia.length > 0 && (
          <>
            <h3 className="mt-6 font-display text-sm font-semibold uppercase tracking-wider text-primary">Related Media</h3>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {relatedMedia.map((m) => (
                <div key={m.id} className="overflow-hidden rounded-lg border border-border">
                  <MediaVisual seed={m.seed} className="aspect-video" />
                  <p className="truncate px-2 py-1.5 text-[10px] text-muted-foreground">{m.title}</p>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="mt-6 flex flex-wrap gap-2 border-t border-border pt-4">
          <button
            onClick={() => toast.success("Opening research reader", { description: "Full text available via NPDC open access." })}
            className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Read Research
          </button>
          <button
            onClick={() => {
              const added = toggleSaved(item.id);
              toast(added ? "Saved to your library" : "Removed from saved");
            }}
            className="rounded-lg border border-border bg-secondary px-4 py-2 text-xs font-semibold text-secondary-foreground hover:border-primary/40"
          >
            {saved ? "Saved ✓" : "Save"}
          </button>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(`${window.location.origin}/user/repository?research=${encodeURIComponent(item.id)}`).catch(() => {});
              toast.success("Link copied to clipboard");
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-4 py-2 text-xs font-semibold text-secondary-foreground hover:border-primary/40"
          >
            <Share2 size={13} /> Share
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Expedition ---------- */
export function ExpeditionCard({ expedition, onView }: { expedition: Expedition; onView?: (e: Expedition) => void }) {
  return (
    <article className="glass card-hover-lift flex flex-col rounded-2xl p-5 glow-soft">
      <div className="flex items-center justify-between gap-2">
        <RegionTag region={expedition.region} />
        <StatusBadge status={expedition.status} />
      </div>
      <h3 className="mt-3 font-display text-[15px] font-semibold leading-snug text-foreground line-clamp-2">
        {expedition.name}
      </h3>
      <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
        <MapPin size={12} className="text-primary" /> {expedition.location}
      </p>
      <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground line-clamp-2">{expedition.objective}</p>
      <div className="mt-3 flex items-center gap-4 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1"><Users size={12} /> {expedition.team ?? expedition.members ?? 0} members</span>
        <span className="inline-flex items-center gap-1"><Calendar size={12} /> {expedition.startDate?.slice(0, 4) ?? expedition.startYear ?? "TBD"} → {expedition.endDate?.slice(0, 4) ?? expedition.endYear ?? "Ongoing"}</span>
      </div>
      <button
        onClick={() => onView?.(expedition)}
        className="mt-4 rounded-lg border border-primary/25 bg-primary/10 px-3 py-2 text-xs font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground"
      >
        View Expedition
      </button>
    </article>
  );
}

/* ---------- Media ---------- */
export function MediaCard({ asset, onOpen }: { asset: MediaAsset; onOpen: (m: MediaAsset) => void }) {
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
          <MediaVisual seed={asset.seed} imageUrl={asset.imageUrl} alt={asset.title} className="aspect-video" />
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
          <span className="font-mono text-[10px] text-muted-foreground">{asset.views.toLocaleString()} views</span>
        </div>
      </div>
    </button>
  );
}

export function MediaLightbox({ asset, onClose }: { asset: MediaAsset | null; onClose: () => void }) {
  if (!asset) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 p-4 backdrop-blur-sm" onClick={onClose} role="dialog" aria-modal="true">
      <div className="glass-strong w-full max-w-3xl overflow-hidden rounded-2xl glow-primary" onClick={(e) => e.stopPropagation()}>
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
            <MediaVisual seed={asset.seed} imageUrl={asset.imageUrl} alt={asset.title} className="aspect-video" />
          )}
          {asset.type === "video" && (
            !asset.videoUrl && <span className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/40">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 border border-primary/50 backdrop-blur-md glow-primary">
                <Play size={26} className="ml-1 text-primary" />
              </span>
              <span className="font-mono text-xs text-foreground/80">Preview stream · {asset.duration}</span>
            </span>
          )}
          <button onClick={onClose} aria-label="Close" className="absolute right-3 top-3 rounded-lg bg-background/70 p-2 text-foreground backdrop-blur-sm hover:bg-background">
            <X size={16} />
          </button>
        </div>
        <div className="p-5">
          <div className="flex flex-wrap items-center gap-2">
            <RegionTag region={asset.region} />
            <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-secondary-foreground">{asset.topic}</span>
            <span className="font-mono text-[10px] text-muted-foreground">{asset.year}</span>
          </div>
          <h3 className="mt-2 font-display text-xl font-bold text-foreground">{asset.title}</h3>
          <p className="mt-1.5 text-sm text-muted-foreground">{asset.description}</p>
          <p className="mt-3 font-mono text-[11px] text-muted-foreground">Credit: {asset.credit} · {asset.views.toLocaleString()} views</p>
        </div>
      </div>
    </div>
  );
}

export { SectionTitle };
