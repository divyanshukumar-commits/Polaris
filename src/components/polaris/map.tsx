import { useMemo, useState } from "react";
import {
  Calendar,
  Compass,
  Flag,
  Globe2,
  Layers,
  MapPin,
  Radio,
  Satellite,
  Thermometer,
  Users,
  Wind,
  X,
} from "lucide-react";
import type { Expedition, ExpeditionStatus } from "@/lib/data/types";
import { RegionTag, StatusBadge } from "./core";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

/* Realistic Polar Projection Spherical Globe */
function projectSphere(
  lat: number,
  lon: number,
  pole: "N" | "S",
  cx: number,
  cy: number,
  radius: number,
) {
  // Polar azimuthal equidistant projection to sphere
  const latRange = 40; // from pole (90) to ~50 degrees
  const clampedLat =
    pole === "N" ? Math.max(50, Math.min(90, lat)) : Math.min(-50, Math.max(-90, lat));
  const r =
    pole === "N"
      ? ((90 - clampedLat) / latRange) * radius
      : ((90 + clampedLat) / latRange) * radius;

  const rad = (lon * Math.PI) / 180;
  return {
    x: cx + r * Math.sin(rad),
    y: pole === "N" ? cy - r * Math.cos(rad) : cy + r * Math.cos(rad),
    r,
  };
}

const statusColors: Record<
  ExpeditionStatus,
  { bg: string; border: string; glow: string; text: string; svg: string }
> = {
  Active: {
    bg: "bg-emerald-400",
    border: "border-emerald-300",
    glow: "shadow-[0_0_12px_rgba(52,211,153,0.8)]",
    text: "text-emerald-400",
    svg: "#10b981",
  },
  Upcoming: {
    bg: "bg-amber-400",
    border: "border-amber-300",
    glow: "shadow-[0_0_12px_rgba(251,191,36,0.8)]",
    text: "text-amber-400",
    svg: "#f59e0b",
  },
  Completed: {
    bg: "bg-cyan-400",
    border: "border-cyan-300",
    glow: "shadow-[0_0_12px_rgba(6,182,212,0.8)]",
    text: "text-cyan-400",
    svg: "#06b6d4",
  },
};

const INDIAN_BASES = [
  {
    name: "Maitri Station",
    region: "Antarctic",
    lat: -70.76,
    lon: 11.73,
    desc: "Schirmacher Oasis",
  },
  {
    name: "Bharati Station",
    region: "Antarctic",
    lat: -69.41,
    lon: 76.19,
    desc: "Larsemann Hills",
  },
  { name: "Dakshin Gangotri", region: "Antarctic", lat: -70.08, lon: 12.0, desc: "Historic Site" },
  { name: "Himadri Base", region: "Arctic", lat: 78.92, lon: 11.93, desc: "Ny-Ålesund, Svalbard" },
  { name: "IndARC Mooring", region: "Arctic", lat: 79.0, lon: 12.0, desc: "Kongsfjorden Fjord" },
];

export function PolarMap({
  expeditions,
  onSelect,
  selected,
}: {
  expeditions: Expedition[];
  onSelect: (e: Expedition) => void;
  selected?: Expedition | null;
}) {
  const [pole, setPole] = useState<"S" | "N">("S");
  const [showIndianOnly, setShowIndianOnly] = useState(false);
  const [hoveredExp, setHoveredExp] = useState<Expedition | null>(null);

  const W = 740;
  const H = 580;
  const cx = W / 2;
  const cy = H / 2;
  const sphereR = 230;

  const currentRegion = pole === "S" ? "Antarctic" : "Arctic";

  const visibleExpeditions = useMemo(() => {
    return expeditions.filter((e) => e.region === currentRegion);
  }, [expeditions, currentRegion]);

  const visibleBases = useMemo(() => {
    return INDIAN_BASES.filter((b) => b.region === currentRegion);
  }, [currentRegion]);

  return (
    <div className="glass relative overflow-hidden rounded-3xl glow-soft border border-primary/20 bg-card/60">
      {/* Top Controls Bar */}
      <div className="absolute left-4 top-4 z-20 flex flex-wrap items-center gap-2">
        {/* Pole Switcher */}
        <div className="flex rounded-xl border border-border bg-background/80 p-1 backdrop-blur-md">
          <button
            onClick={() => setPole("S")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all",
              pole === "S"
                ? "bg-primary text-primary-foreground glow-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Globe2 size={13} /> South Pole · Antarctica
          </button>
          <button
            onClick={() => setPole("N")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all",
              pole === "N"
                ? "bg-primary text-primary-foreground glow-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Globe2 size={13} /> North Pole · Arctic
          </button>
        </div>

        {/* Indian Bases Toggle */}
        <button
          onClick={() => setShowIndianOnly(!showIndianOnly)}
          className={cn(
            "flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold backdrop-blur-md transition-all",
            showIndianOnly
              ? "bg-primary/20 border-primary text-primary glow-primary"
              : "border-border bg-background/70 text-muted-foreground hover:text-foreground",
          )}
        >
          <Flag size={12} /> Indian Stations
        </button>
      </div>

      {/* Status Legend Badge */}
      <div className="absolute right-4 top-4 z-20 hidden sm:flex items-center gap-3 rounded-xl border border-border bg-background/80 px-3.5 py-2 backdrop-blur-md text-[10px] font-mono">
        <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Active
        </span>
        <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
          <span className="h-2 w-2 rounded-full bg-amber-400" /> Upcoming
        </span>
        <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
          <span className="h-2 w-2 rounded-full bg-cyan-400" /> Completed
        </span>
        <span className="flex items-center gap-1.5 text-yellow-300 font-bold border-l border-border pl-2">
          🇮🇳 Indian Base
        </span>
      </div>

      {/* SVG 3D Polar Projection Globe */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full select-none"
        style={{ minHeight: "440px" }}
      >
        <defs>
          {/* Deep Polar Ocean Sphere Radial Shading */}
          <radialGradient id="sphereOcean" cx="45%" cy="40%" r="65%">
            <stop offset="0%" stopColor="oklch(0.32 0.08 230)" />
            <stop offset="60%" stopColor="oklch(0.2 0.06 250)" />
            <stop offset="95%" stopColor="oklch(0.12 0.04 260)" />
            <stop offset="100%" stopColor="oklch(0.08 0.03 265)" />
          </radialGradient>

          {/* Glowing Atmosphere Rim Halo */}
          <radialGradient id="atmosphereGlow" cx="50%" cy="50%" r="50%">
            <stop offset="85%" stopColor="oklch(0.72 0.16 195)" stopOpacity="0" />
            <stop offset="98%" stopColor="oklch(0.72 0.16 195)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="oklch(0.8 0.18 190)" stopOpacity="0.8" />
          </radialGradient>

          {/* Ice Sheet Shading */}
          <radialGradient id="antarcticIce" cx="48%" cy="46%" r="55%">
            <stop offset="0%" stopColor="oklch(0.96 0.02 220)" />
            <stop offset="70%" stopColor="oklch(0.88 0.04 225)" />
            <stop offset="100%" stopColor="oklch(0.75 0.06 230)" />
          </radialGradient>
        </defs>

        {/* Outer Glow Halo */}
        <circle
          cx={cx}
          cy={cy}
          r={sphereR + 10}
          fill="none"
          stroke="oklch(0.72 0.16 195 / 20%)"
          strokeWidth="12"
        />

        {/* The 3D Planetary Sphere Base */}
        <circle
          cx={cx}
          cy={cy}
          r={sphereR}
          fill="url(#sphereOcean)"
          stroke="oklch(0.72 0.16 195 / 40%)"
          strokeWidth="2"
        />

        {/* Graticule Latitude Concentric Rings */}
        {[0.25, 0.5, 0.75, 1].map((factor, i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={sphereR * factor}
            fill="none"
            stroke="oklch(0.94 0.02 240 / 12%)"
            strokeWidth="1"
            strokeDasharray={factor === 1 ? "none" : "3 3"}
          />
        ))}

        {/* Graticule Longitude Radiating Lines */}
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i * 30 * Math.PI) / 180;
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={cx + sphereR * Math.sin(a)}
              y2={cy - sphereR * Math.cos(a)}
              stroke="oklch(0.94 0.02 240 / 10%)"
              strokeWidth="1"
            />
          );
        })}

        {/* Latitude Degree Labels */}
        {[0.25, 0.5, 0.75].map((factor, i) => {
          const r = sphereR * factor;
          const latText = pole === "S" ? `${80 - i * 10}°S` : `${80 - i * 10}°N`;
          return (
            <text
              key={i}
              x={cx + r * 0.7}
              y={cy - r * 0.7}
              fill="oklch(0.65 0.04 240)"
              fontSize="9"
              fontFamily="monospace"
              opacity="0.8"
            >
              {latText}
            </text>
          );
        })}

        {/* Realistic Landmass / Ice Shelf Vector Contours */}
        {pole === "S" ? (
          /* Detailed Antarctica Continent Path */
          <g>
            {/* Ice Shelves Outer Extent (Translucent Ice) */}
            <path
              d={`M ${cx - 150} ${cy - 50} 
                 C ${cx - 190} ${cy + 40}, ${cx - 140} ${cy + 160}, ${cx - 40} ${cy + 175}
                 C ${cx + 70} ${cy + 180}, ${cx + 170} ${cy + 130}, ${cx + 185} ${cy + 30}
                 C ${cx + 195} ${cy - 70}, ${cx + 130} ${cy - 160}, ${cx + 20} ${cy - 175}
                 C ${cx - 80} ${cy - 180}, ${cx - 120} ${cy - 130}, ${cx - 150} ${cy - 50} Z`}
              fill="oklch(0.8 0.05 220 / 35%)"
              stroke="oklch(0.8 0.1 210 / 50%)"
              strokeWidth="1.5"
            />

            {/* Grounded Ice Sheet (Antarctica Main Body) */}
            <path
              d={`M ${cx - 125} ${cy - 40} 
                 C ${cx - 165} ${cy + 30}, ${cx - 120} ${cy + 140}, ${cx - 30} ${cy + 150}
                 C ${cx + 60} ${cy + 155}, ${cx + 150} ${cy + 110}, ${cx + 160} ${cy + 25}
                 C ${cx + 170} ${cy - 60}, ${cx + 110} ${cy - 140}, ${cx + 10} ${cy - 150}
                 C ${cx - 65} ${cy - 155}, ${cx - 100} ${cy - 110}, ${cx - 125} ${cy - 40} Z`}
              fill="url(#antarcticIce)"
              stroke="oklch(0.95 0.02 220)"
              strokeWidth="2"
              className="drop-shadow-lg"
            />

            {/* Antarctic Peninsula Reach */}
            <path
              d={`M ${cx - 115} ${cy - 40} 
                 Q ${cx - 165} ${cy - 110} ${cx - 175} ${cy - 160} 
                 Q ${cx - 155} ${cy - 175} ${cx - 145} ${cy - 140}
                 Q ${cx - 135} ${cy - 90} ${cx - 105} ${cy - 45} Z`}
              fill="url(#antarcticIce)"
              stroke="oklch(0.95 0.02 220)"
              strokeWidth="1.5"
            />

            {/* Geographic South Pole Marker (Center) */}
            <circle
              cx={cx}
              cy={cy}
              r="4"
              fill="oklch(0.72 0.16 195)"
              stroke="white"
              strokeWidth="1.5"
            />
            <text
              x={cx + 7}
              y={cy + 3}
              fill="oklch(0.72 0.16 195)"
              fontSize="10"
              fontWeight="bold"
              fontFamily="monospace"
            >
              South Pole (90°S)
            </text>
          </g>
        ) : (
          /* Detailed Arctic Ocean & Surrounding Landmasses */
          <g>
            {/* Arctic Ocean Central Pack Ice */}
            <circle cx={cx} cy={cy} r={sphereR * 0.42} fill="url(#antarcticIce)" opacity="0.85" />

            {/* Greenland Ice Sheet */}
            <path
              d={`M ${cx - 80} ${cy + 70} 
                 Q ${cx - 110} ${cy + 130} ${cx - 60} ${cy + 175}
                 Q ${cx - 20} ${cy + 140} ${cx - 45} ${cy + 85} Z`}
              fill="url(#antarcticIce)"
              stroke="oklch(0.95 0.02 220)"
              strokeWidth="1.5"
            />
            <text x={cx - 115} y={cy + 145} fill="white" fontSize="9" fontFamily="monospace">
              Greenland
            </text>

            {/* Svalbard Archipelago */}
            <ellipse
              cx={cx + 35}
              cy={cy + 110}
              rx="14"
              ry="10"
              fill="url(#antarcticIce)"
              stroke="white"
            />
            <text x={cx + 45} y={cy + 105} fill="white" fontSize="9" fontFamily="monospace">
              Svalbard
            </text>

            {/* Geographic North Pole Marker */}
            <circle
              cx={cx}
              cy={cy}
              r="4"
              fill="oklch(0.72 0.16 195)"
              stroke="white"
              strokeWidth="1.5"
            />
            <text
              x={cx + 7}
              y={cy + 3}
              fill="oklch(0.72 0.16 195)"
              fontSize="10"
              fontWeight="bold"
              fontFamily="monospace"
            >
              North Pole (90°N)
            </text>
          </g>
        )}

        {/* Indian Base Stations Highlighted Beacons */}
        {visibleBases.map((base, idx) => {
          const pt = projectSphere(base.lat, base.lon, pole, cx, cy, sphereR);
          return (
            <g key={idx} className="cursor-pointer group">
              {/* Gold Pulsing Station Rings */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r="14"
                fill="#fbbf24"
                opacity="0.2"
                className="animate-ping"
              />
              <circle cx={pt.x} cy={pt.y} r="7" fill="#fbbf24" stroke="#ffffff" strokeWidth="2" />
              {/* Station Label */}
              <rect
                x={pt.x + 8}
                y={pt.y - 12}
                width={base.name.length * 6.5 + 16}
                height="18"
                rx="4"
                fill="#0f172a"
                stroke="#fbbf24"
                strokeWidth="1"
                opacity="0.9"
              />
              <text
                x={pt.x + 14}
                y={pt.y}
                fill="#fbbf24"
                fontSize="9"
                fontFamily="monospace"
                fontWeight="bold"
              >
                🇮🇳 {base.name}
              </text>
            </g>
          );
        })}

        {/* Expedition Dynamic Markers with Distinct Color-Coded Glows */}
        {!showIndianOnly &&
          visibleExpeditions.map((exp) => {
            const pt = projectSphere(exp.lat, exp.lon, pole, cx, cy, sphereR);
            const isSelected = selected?.id === exp.id;
            const style = statusColors[exp.status];

            return (
              <g
                key={exp.id}
                role="button"
                tabIndex={0}
                aria-label={`${exp.name}, ${exp.status}, ${exp.location}`}
                onClick={() => onSelect(exp)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelect(exp);
                  }
                }}
                onMouseEnter={() => setHoveredExp(exp)}
                onMouseLeave={() => setHoveredExp(null)}
                className="cursor-pointer"
              >
                {/* Status-specific pulse ring */}
                {(exp.status === "Active" || isSelected) && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isSelected ? "16" : "12"}
                    fill={style.svg}
                    opacity="0.28"
                    className="animate-ping"
                  />
                )}

                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isSelected ? "9" : "6"}
                  fill={style.svg}
                  stroke={style.svg}
                  strokeWidth={isSelected ? "3" : "1.5"}
                  className="transition-all hover:scale-125"
                />

                {/* Marker Name Label */}
                {(isSelected || hoveredExp?.id === exp.id) && (
                  <g>
                    <rect
                      x={pt.x + 10}
                      y={pt.y - 16}
                      width={Math.min(180, exp.name.length * 6.8 + 14)}
                      height="22"
                      rx="6"
                      fill="#090d16"
                      stroke={style.svg}
                      strokeWidth="1.5"
                    />
                    <text
                      x={pt.x + 16}
                      y={pt.y - 2}
                      fill="#ffffff"
                      fontSize="10"
                      fontWeight="bold"
                      fontFamily="sans-serif"
                    >
                      {exp.name.slice(0, 22)}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

        {/* Atmosphere Edge Shading */}
        <circle cx={cx} cy={cy} r={sphereR} fill="url(#atmosphereGlow)" pointerEvents="none" />
      </svg>

      {/* Bottom Coordinates & Stats Bar */}
      <div className="border-t border-border bg-background/80 px-5 py-3 backdrop-blur-md flex flex-wrap items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-3 font-mono text-[11px]">
          <span className="text-foreground font-bold flex items-center gap-1">
            <Compass size={13} className="text-primary" />
            {pole === "S"
              ? "Antarctic Polar Projection (50°S–90°S)"
              : "Arctic Ocean Projection (50°N–90°N)"}
          </span>
          <span>· {visibleExpeditions.length} Field Missions Plotted</span>
        </div>

        {selected && (
          <div className="font-mono text-[11px] text-primary flex items-center gap-2">
            <span>Selected: {selected.name}</span>
            <span>({selected.lat > 0 ? `${selected.lat}°N` : `${Math.abs(selected.lat)}°S`})</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* Detail Drawer/Panel for Expedition */
export function ExpeditionPanel({
  expedition,
  onClose,
  onOpenDetail,
}: {
  expedition: Expedition | null;
  onClose: () => void;
  onOpenDetail?: (e: Expedition) => void;
}) {
  if (!expedition) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="glass rounded-3xl p-6 glow-soft border border-primary/30 space-y-4 relative"
    >
      <button
        onClick={onClose}
        className="absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground hover:text-foreground cursor-pointer"
        aria-label="Close panel"
      >
        <X size={16} />
      </button>

      <div className="flex items-center gap-2">
        <StatusBadge status={expedition.status} />
        <RegionTag region={expedition.region} />
      </div>

      <div>
        <h3 className="font-display text-xl font-bold text-foreground">{expedition.name}</h3>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin size={14} className="text-primary" /> {expedition.location}
        </p>
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        {expedition.plainSummary || expedition.summary || expedition.description}
      </p>

      <div className="grid grid-cols-2 gap-3 pt-2">
        <div className="rounded-xl bg-background/60 p-3 border border-border">
          <span className="font-mono text-[10px] text-muted-foreground uppercase block font-semibold">
            Time Period
          </span>
          <span className="font-mono text-xs font-bold text-foreground mt-0.5 block">
            {expedition.startYear} – {expedition.endYear || "Ongoing"}
          </span>
        </div>
        <div className="rounded-xl bg-background/60 p-3 border border-border">
          <span className="font-mono text-[10px] text-muted-foreground uppercase block font-semibold">
            Lead Agency
          </span>
          <span className="font-display text-xs font-bold text-foreground mt-0.5 block line-clamp-1">
            {expedition.leadAgency}
          </span>
        </div>
      </div>

      <div className="space-y-2 pt-2 border-t border-border">
        <span className="font-mono text-[10px] uppercase font-bold text-muted-foreground block">
          Key Scientific Objectives
        </span>
        <ul className="space-y-1 pl-1">
          {(expedition.objectives ?? (expedition.objective ? [expedition.objective] : [])).map(
            (obj, i) => (
              <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                <span>{obj}</span>
              </li>
            ),
          )}
        </ul>
      </div>

      <div className="pt-3 border-t border-border flex items-center justify-between font-mono text-[11px] text-muted-foreground">
        <span>Team: {expedition.members || expedition.team || 0} Scientists</span>
        <span className="text-primary font-bold">
          {expedition.stationRef || "Field Expedition"}
        </span>
      </div>

      {onOpenDetail && (
        <button
          onClick={() => onOpenDetail(expedition)}
          className="w-full mt-2 rounded-xl bg-primary/15 border border-primary/30 py-2.5 px-4 text-xs font-bold text-primary hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center gap-2 cursor-pointer glow-soft"
        >
          View Full Expedition Report & Gallery
        </button>
      )}
    </motion.div>
  );
}
