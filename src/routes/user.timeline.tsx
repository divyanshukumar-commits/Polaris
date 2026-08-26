import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Compass,
  Flag,
  Globe2,
  Landmark,
  Radio,
  Rocket,
  Satellite,
  Sparkles,
} from "lucide-react";
import { PageHeader, SectionTitle } from "@/components/polaris/core";
import { timelinePeriods } from "@/lib/data/timeline";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/user/timeline")({
  head: () => ({
    meta: [
      { title: "Polar Science & History Timeline — POLARIS" },
      {
        name: "description",
        content:
          "Interactive 120-year timeline of Arctic and Antarctic exploration, Indian Polar Program milestones, and satellite missions.",
      },
      { property: "og:title", content: "Polar Science Timeline — POLARIS" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TimelinePage,
});

function TimelinePage() {
  const [activeIdx, setActiveIdx] = useState(4); // Default to 1980-2000 (India joins the ice)
  const [filterIndianOnly, setFilterIndianOnly] = useState(false);

  const currentPeriod = timelinePeriods[activeIdx];

  const indianMilestones = [
    { year: 1981, title: "1st Indian Antarctic Expedition", desc: "Led by Dr. S. Z. Qasim on MV Polar Circle." },
    { year: 1983, title: "Dakshin Gangotri Station", desc: "India's 1st permanent Antarctic base built in 45 days." },
    { year: 1989, title: "Maitri Station Commissioned", desc: "Year-round station in the rocky Schirmacher Oasis." },
    { year: 1998, title: "NCPOR Established", desc: "National Centre for Polar and Ocean Research founded in Goa." },
    { year: 2008, title: "Himadri Arctic Base", desc: "India's permanent Arctic station at Ny-Ålesund, Svalbard." },
    { year: 2012, title: "Bharati Station Commissioned", desc: "3rd state-of-the-art green Antarctic station in Larsemann Hills." },
    { year: 2014, title: "IndARC Mooring Deployed", desc: "Underwater observatory deployed at 192m in Kongsfjorden." },
    { year: 2026, title: "POLARIS Portal Launch", desc: "Integrated national polar knowledge and outreach platform." },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="User Portal · 120-Year Historical Record"
        title="Polar Science & Expedition Timeline"
        description="Navigate over a century of polar discovery with the 20-year interval timeline bar. Explore how the heroic age transformed into modern spaceborne cryosphere monitoring."
      >
        <button
          onClick={() => setFilterIndianOnly(!filterIndianOnly)}
          className={cn(
            "flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold backdrop-blur-md transition-all",
            filterIndianOnly
              ? "border-primary bg-primary text-primary-foreground glow-primary shadow-sm"
              : "border-border bg-secondary/60 text-muted-foreground hover:text-foreground",
          )}
        >
          <Flag size={14} /> {filterIndianOnly ? "Showing Indian Milestones" : "Highlight Indian Stations"}
        </button>
      </PageHeader>

      {/* 20-YEAR HORIZONTAL INTERACTIVE TIMELINE SLIDER BAR WITH POINTER */}
      <div className="glass rounded-3xl p-6 md:p-8 glow-soft border border-border/80">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-primary" />
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground font-bold">
              20-Year Major Intervals Timeline
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={activeIdx === 0}
              onClick={() => setActiveIdx((prev) => Math.max(0, prev - 1))}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground disabled:opacity-30"
              title="Previous Era"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="font-mono text-xs font-bold text-foreground">
              {activeIdx + 1} / {timelinePeriods.length}
            </span>
            <button
              disabled={activeIdx === timelinePeriods.length - 1}
              onClick={() => setActiveIdx((prev) => Math.min(timelinePeriods.length - 1, prev + 1))}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground disabled:opacity-30"
              title="Next Era"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* The Track Bar with Markers & Pointer */}
        <div className="relative pt-6 pb-4">
          {/* Base Background Track Line */}
          <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 via-primary to-chart-2"
              initial={false}
              animate={{ width: `${((activeIdx + 1) / timelinePeriods.length) * 100}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </div>
          <motion.div
            className="pointer-events-none absolute top-0 -translate-x-1/2 text-primary"
            initial={false}
            animate={{ left: `${((activeIdx + 0.5) / timelinePeriods.length) * 100}%` }}
            transition={{ type: "spring", stiffness: 220, damping: 24 }}
            aria-hidden="true"
          >
            <Rocket size={16} className="rotate-45 drop-shadow-[0_0_8px_currentColor]" />
          </motion.div>

          {/* 20-Year Interval Nodes and Pointer */}
          <div className="relative flex justify-between -mt-3.5">
            {timelinePeriods.map((period, idx) => {
              const isSelected = activeIdx === idx;
              const isPast = activeIdx >= idx;

              return (
                <button
                  key={period.id}
                  onClick={() => setActiveIdx(idx)}
                  className="group relative flex flex-col items-center focus:outline-none"
                >
                  {/* Glowing Node Circle */}
                  <motion.div
                    animate={{
                      scale: isSelected ? 1.35 : 1,
                    }}
                    className={cn(
                      "h-5 w-5 rounded-full border-2 transition-all flex items-center justify-center",
                      isSelected
                        ? "border-white bg-primary shadow-[0_0_16px_rgba(6,182,212,0.9)] z-20"
                        : isPast
                          ? "border-primary bg-primary/70"
                          : "border-border bg-background hover:border-primary/50",
                    )}
                  >
                    {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />}
                  </motion.div>

                  {/* Year Marker Label */}
                  <span
                    className={cn(
                      "mt-3 font-mono text-[11px] font-bold transition-colors whitespace-nowrap",
                      isSelected
                        ? "text-primary scale-110"
                        : "text-muted-foreground group-hover:text-foreground",
                    )}
                  >
                    {period.label.split("–")[0]}
                  </span>

                  {/* Indicator Arrow Pointer when selected */}
                  {isSelected && (
                    <motion.div
                      layoutId="timelinePointer"
                      className="absolute -top-7 text-primary font-bold text-xs flex flex-col items-center"
                    >
                      <span>▼</span>
                    </motion.div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ACTIVE ERA MAIN FEATURED CARD */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPeriod.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.35 }}
          className="glass-strong rounded-3xl p-6 md:p-8 glow-primary border border-primary/30 relative overflow-hidden"
        >
          <div className="grid gap-6 md:grid-cols-12 items-center">
            {/* Left: Era Details */}
            <div className="md:col-span-7 space-y-4">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-primary/20 border border-primary/40 px-3 py-1 font-mono text-xs font-bold text-primary">
                  {currentPeriod.label}
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  Era {activeIdx + 1} of {timelinePeriods.length}
                </span>
              </div>

              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                {currentPeriod.title}
              </h2>

              <p className="text-sm leading-relaxed text-muted-foreground">
                {currentPeriod.summary}
              </p>

              {/* Event Bullets */}
              <div className="space-y-2.5 pt-2">
                <span className="font-mono text-[11px] uppercase font-bold text-muted-foreground block">
                  Key Milestones & Expeditions:
                </span>
                {currentPeriod.events.map((ev, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-xl bg-background/50 border border-border/70 p-3 text-xs"
                  >
                    <span className="font-mono font-bold text-primary shrink-0 text-sm">
                      {ev.year}
                    </span>
                    <span className="text-foreground leading-snug">{ev.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Real Polar Photo */}
            <div className="md:col-span-5">
              <div className="relative h-64 md:h-80 w-full overflow-hidden rounded-2xl border border-border shadow-xl">
                <img
                  src={currentPeriod.imageUrl}
                  alt={currentPeriod.title}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                  <span className="font-mono text-xs text-slate-200 font-semibold">
                    📸 Historical Cryosphere Archive · {currentPeriod.label}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* INDIAN POLAR PROGRAM STATIONS SUMMARY ROW */}
      <div className="space-y-4">
        <SectionTitle
          title="Indian Polar Program Stations & Observatories"
          action={
            <span className="font-mono text-xs text-muted-foreground">
              MoES / NCPOR Milestones (1981–Present)
            </span>
          }
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {indianMilestones.map((item, idx) => (
            <div
              key={idx}
              className="glass card-hover-lift rounded-2xl p-5 border border-border/80 hover:border-primary/50 transition-all space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-primary">{item.year}</span>
                <Flag size={14} className="text-yellow-400" />
              </div>
              <h4 className="font-display text-sm font-bold text-foreground">{item.title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
