import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Calendar,
  Compass,
  FileDown,
  FileText,
  MapPin,
  Radio,
  Satellite,
  Thermometer,
  Users,
  Wind,
} from "lucide-react";
import { PageHeader, SectionTitle, StatusBadge } from "@/components/polaris/core";
import { PolarMap } from "@/components/polaris/map";
import { ExpeditionDetailModal } from "@/components/polaris/expedition-detail";
import { expeditions } from "@/lib/data/expeditions";
import type { Expedition } from "@/lib/data/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/researcher/expeditions")({
  head: () => ({
    meta: [
      { title: "Expeditions & Field Operations — POLARIS" },
      {
        name: "description",
        content:
          "Track field expedition logs, scientific payloads, and telemetry from Arctic and Antarctic research bases.",
      },
      { property: "og:title", content: "Expeditions & Field Hub — POLARIS" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ResearcherExpeditionsPage,
});

function ResearcherExpeditionsPage() {
  const [selectedExp, setSelectedExp] = useState<Expedition | null>(expeditions[0] ?? null);
  const [detailExpedition, setDetailExpedition] = useState<Expedition | null>(null);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Researcher Portal · Field Operations"
        title="Field Missions & Station Telemetry"
        description="Monitor scientific payload statuses, field deployment logs, and live environmental sensors across India's polar observatories."
      />

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Interactive Map */}
        <div className="lg:col-span-7">
          <PolarMap
            expeditions={expeditions}
            selected={selectedExp}
            onSelect={(e) => setSelectedExp(e)}
          />
        </div>

        {/* Selected Expedition Inspector */}
        <div className="lg:col-span-5">
          {selectedExp ? (
            <motion.div
              key={selectedExp.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass rounded-2xl p-6 glow-soft border border-primary/20 space-y-4"
            >
              <div className="flex items-center justify-between">
                <StatusBadge status={selectedExp.status} />
                <span className="font-mono text-xs text-primary font-bold">
                  {selectedExp.region.toUpperCase()}
                </span>
              </div>

              <div>
                <h3 className="font-display text-xl font-bold text-foreground">
                  {selectedExp.name}
                </h3>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin size={14} className="text-primary" /> {selectedExp.location} (
                  {selectedExp.lat > 0 ? `${selectedExp.lat}°N` : `${Math.abs(selectedExp.lat)}°S`},{" "}
                  {selectedExp.lon > 0 ? `${selectedExp.lon}°E` : `${Math.abs(selectedExp.lon)}°W`})
                </p>
              </div>

              <p className="text-xs leading-relaxed text-muted-foreground">
                {selectedExp.plainSummary || selectedExp.summary || selectedExp.description}
              </p>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
                <div className="rounded-xl bg-background/50 p-3 border border-border">
                  <span className="font-mono text-[10px] text-muted-foreground uppercase block font-semibold">
                    Duration
                  </span>
                  <span className="font-mono text-xs font-bold text-foreground mt-0.5 block">
                    {selectedExp.startYear} – {selectedExp.endYear || "Ongoing"}
                  </span>
                </div>
                <div className="rounded-xl bg-background/50 p-3 border border-border">
                  <span className="font-mono text-[10px] text-muted-foreground uppercase block font-semibold">
                    Lead Agency
                  </span>
                  <span className="font-display text-xs font-bold text-foreground mt-0.5 block line-clamp-1">
                    {selectedExp.leadAgency}
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <span className="font-mono text-[10px] uppercase font-semibold text-muted-foreground block">
                  Scientific Objectives
                </span>
                <ul className="space-y-1.5 pl-1">
                  {(
                    selectedExp.objectives ?? (selectedExp.objective ? [selectedExp.objective] : [])
                  ).map((obj, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-mono text-[10px]">
                  Team: {selectedExp.members || selectedExp.team || 0} scientists
                </span>
                <span className="text-primary font-semibold font-mono text-[10px]">
                  {selectedExp.stationRef || "Field Camp"}
                </span>
              </div>

              <button
                onClick={() => setDetailExpedition(selectedExp)}
                className="w-full mt-2 rounded-xl bg-primary/15 border border-primary/30 py-2.5 px-4 text-xs font-bold text-primary hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center gap-2 cursor-pointer glow-soft"
              >
                <FileText size={14} />
                Open Full Expedition Report & Gallery
              </button>
            </motion.div>
          ) : (
            <div className="glass rounded-2xl p-12 text-center text-muted-foreground">
              Select an expedition marker on the polar map to view field telemetry.
            </div>
          )}
        </div>
      </div>

      {/* Full Expedition Detail Modal */}
      <ExpeditionDetailModal
        expedition={detailExpedition}
        onClose={() => setDetailExpedition(null)}
      />

      {/* Field Operations Stream */}
      <div>
        <SectionTitle title="Active Field Operations Log" />
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              mission: "44th IAE Maitri Wintering Team",
              station: "Maitri Station",
              log: "Continuous ozone sonde launches and boundary-layer meteorological recording completed. Sub-zero generator maintenance nominal.",
              time: "2 hours ago",
              status: "Nominal",
            },
            {
              mission: "Kongsfjorden IndARC Mooring Service",
              station: "Himadri Station (Arctic)",
              log: "Acoustic Doppler Current Profiler (ADCP) telemetry synced. Deep-water salinity anomaly detected at 180m depth.",
              time: "6 hours ago",
              status: "Data Synced",
            },
            {
              mission: "Larsemann Hills Coastal Radar",
              station: "Bharati Station",
              log: "ISRO Earth Observation satellite pass received at X-band terminal. Automated ice-edge tracking feed uploaded to VEDAS.",
              time: "12 hours ago",
              status: "Relayed",
            },
          ].map((item, idx) => (
            <div key={idx} className="glass rounded-2xl p-5 glow-soft border border-border">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase font-bold text-primary">
                  {item.station}
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">{item.time}</span>
              </div>
              <h4 className="mt-2 font-display text-sm font-bold text-foreground">
                {item.mission}
              </h4>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{item.log}</p>
              <div className="mt-4 pt-2 border-t border-border flex items-center justify-between text-[10px] font-mono">
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <Activity size={12} /> {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
