import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Compass,
  FlaskConical,
  Globe2,
  Landmark,
  Library,
  MessageSquareText,
  Rocket,
  Satellite,
  ShieldCheck,
  Sparkles,
  Telescope,
  User,
} from "lucide-react";
import { AnimatedNumber, Logo, WaterSurface } from "@/components/polaris/core";
import { InteractiveGlobe } from "@/components/polaris/interactive-globe";
import { timelinePeriods } from "@/lib/data/timeline";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: "/login" });
  },
  head: () => ({
    meta: [
      { title: "POLARIS — One Gateway to Polar Science" },
      {
        name: "description",
        content:
          "POLARIS is an integrated polar science outreach, knowledge repository and media dissemination platform connecting research, expeditions and media for the Arctic and Antarctic.",
      },
      { property: "og:title", content: "POLARIS — One Gateway to Polar Science" },
      {
        property: "og:description",
        content:
          "Discover, understand and explore polar science: research, expeditions and media in one interactive platform.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

/* Interactive 3D Earth visualization */
function PolarOrb() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md">
      <InteractiveGlobe className="h-full w-full" />
    </div>
  );
}

const roles = [
  {
    role: "user" as const,
    icon: <User size={22} />,
    title: "User",
    tagline: "Explore polar science",
    desc: "Discover research, expeditions, media galleries and the Polar Assistant.",
  },
  {
    role: "researcher" as const,
    icon: <FlaskConical size={22} />,
    title: "Researcher",
    tagline: "Discover and contribute research",
    desc: "Submit publications, track review status, manage expeditions and analyse engagement.",
  },
  {
    role: "admin" as const,
    icon: <ShieldCheck size={22} />,
    title: "Admin",
    tagline: "Manage the ecosystem",
    desc: "Approve submissions, moderate content, manage users and monitor platform analytics.",
  },
];

const pillars = [
  { icon: <Library size={18} />, label: "Research", desc: "Papers, reports & datasets" },
  { icon: <Compass size={18} />, label: "Expeditions", desc: "Live polar missions" },
  { icon: <Globe2 size={18} />, label: "Media", desc: "Images, video & infographics" },
  { icon: <MessageSquareText size={18} />, label: "AI Discovery", desc: "Ask the Polar Assistant" },
];

const defaultSignal = {
  label: "Maitri Station",
  value: "-31.4°C",
  detail: "Wind 18 km/h",
  tone: "text-primary",
};

const liveSignals = [
  defaultSignal,
  { label: "Arctic Sea Ice", value: "12.8M km²", detail: "Telemetry synced", tone: "text-chart-2" },
  { label: "Bharati Station", value: "98.7%", detail: "Systems nominal", tone: "text-success" },
];

function Landing() {
  const [signalIndex, setSignalIndex] = useState(0);
  const signal = liveSignals[signalIndex] ?? defaultSignal;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSignalIndex((current) => (current + 1) % liveSignals.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="ambient-grid min-h-screen bg-background bg-radial-fade">
      {/* nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <Logo />
        <div className="flex items-center gap-2">
          <Link
            to="/login"
            search={{ role: "user" }}
            className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Launch Portal
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5">
        <WaterSurface className="shimmer-border glass flex flex-wrap items-center justify-between gap-3 rounded-2xl px-4 py-3 text-xs">
          <div className="flex items-center gap-2 font-mono uppercase tracking-[0.18em] text-muted-foreground">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-70" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-success" />
            </span>
            Live polar network
          </div>
          <motion.div
            key={signal.label}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <span className="font-semibold text-foreground">{signal.label}</span>
            <span className={`font-mono font-bold ${signal.tone}`}>{signal.value}</span>
            <span className="hidden text-muted-foreground sm:inline">{signal.detail}</span>
          </motion.div>
          <span className="font-mono text-[10px] text-muted-foreground">
            Updated just now · 3 stations online
          </span>
        </WaterSurface>
      </div>

      {/* hero */}
      <section className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 pt-8 md:grid-cols-2 md:pt-14">
        <div className="bg-grid absolute inset-0 -z-10 opacity-40" />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
            <Sparkles size={12} /> Integrated Polar Science Platform
          </p>
          <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight text-foreground md:text-6xl">
            POLAR<span className="text-aurora">SPHERE</span>
          </h1>
          <p className="mt-3 font-display text-xl font-semibold text-foreground/90">
            One Gateway to Polar Science
          </p>
          <p className="mt-1 font-mono text-xs uppercase tracking-[0.3em] text-primary">
            Discover · Understand · Explore
          </p>
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-muted-foreground">
            Polar science knowledge is fragmented across institutions and formats. POLARIS connects{" "}
            <span className="text-foreground">
              research + expeditions + media + AI-assisted discovery
            </span>{" "}
            into one interactive ecosystem — from NPDC datasets and NCPOR expedition reports to
            ISRO/VEDAS satellite resources.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/login"
              search={{ role: "user" }}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-all hover:opacity-90 glow-primary"
            >
              Explore Polar Science <ArrowRight size={16} />
            </Link>
            <Link
              to="/user/expeditions"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-secondary/60 px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/40"
            >
              <Telescope size={16} className="text-primary" /> Explore Expeditions
            </Link>
          </div>
          {/* animated stats */}
          <div className="mt-9 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { v: 1250, s: "+", l: "Research Resources" },
              { v: 85, s: "+", l: "Expeditions" },
              { v: 3400, s: "+", l: "Media Assets" },
              { v: 120, s: "+", l: "Learning Resources" },
            ].map((st) => (
              <div key={st.l} className="rounded-xl border border-border/60 bg-background/20 p-3">
                <p className="font-display text-2xl font-bold text-foreground">
                  <AnimatedNumber value={st.v} suffix={st.s} />
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{st.l}</p>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="animate-float-soft"
        >
          <PolarOrb />
        </motion.div>
      </section>

      {/* role selection */}
      <section className="mx-auto max-w-6xl px-5 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-center font-display text-2xl font-bold text-foreground">
            Choose your experience
          </h2>
          <p className="mx-auto mt-2 max-w-md text-center text-sm text-muted-foreground">
            Three role-based portals, one connected knowledge ecosystem.
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {roles.map((r, i) => (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
              >
                <Link
                  to="/login"
                  search={{ role: r.role }}
                  className="glass card-hover-lift group flex h-full flex-col rounded-2xl p-6 glow-soft"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/25 bg-primary/12 text-primary">
                    {r.icon}
                  </span>
                  <h3 className="mt-4 font-display text-lg font-bold uppercase tracking-wider text-foreground">
                    {r.title}
                  </h3>
                  <p className="mt-0.5 text-sm font-medium text-primary">{r.tagline}</p>
                  <p className="mt-2 flex-1 text-[13px] leading-relaxed text-muted-foreground">
                    {r.desc}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-primary">
                    Enter portal{" "}
                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* pillars */}
      <section className="border-y border-border bg-secondary/20">
        <div className="mx-auto grid max-w-6xl gap-4 px-5 py-12 sm:grid-cols-3 lg:grid-cols-5">
          {pillars.map((p) => (
            <div key={p.label} className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
                {p.icon}
              </span>
              <div>
                <p className="text-sm font-bold text-foreground">{p.label}</p>
                <p className="text-xs text-muted-foreground">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* timeline teaser */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary">
              1900 → 2026
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold text-foreground">
              A century of polar science
            </h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              From the Heroic Age of exploration to the integrated, satellite-observed polar decade
              — ride the timeline.
            </p>
          </div>
          <Link
            to="/user/timeline"
            className="inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-4 py-2.5 text-xs font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            <Rocket size={15} /> Open Timeline
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {timelinePeriods.slice(0, 4).map((p) => (
            <div key={p.id} className="glass card-hover-lift rounded-2xl p-5">
              <p className="font-mono text-xs font-bold text-primary">{p.label}</p>
              <p className="mt-2 font-display text-sm font-semibold leading-snug text-foreground">
                {p.title}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                {p.summary}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* data sources */}
      <section className="border-t border-border bg-secondary/20">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-4 px-5 py-8">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            Data informed by
          </span>
          {["NPDC", "NCPOR", "ISRO / VEDAS", "Maitri · Bharati · Himadri", "Aditya-L1"].map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-2 text-sm font-semibold text-foreground/70"
            >
              <Landmark size={14} className="text-primary" /> {s}
            </span>
          ))}
        </div>
      </section>

      {/* footer */}
      <footer className="border-t border-border">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-3">
          <div>
            <Logo />
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Integrated Polar Science Outreach & Knowledge Platform.
            </p>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Platform
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <Link
                to="/user/repository"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                Knowledge Repository
              </Link>
              <Link
                to="/user/expeditions"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                Expeditions
              </Link>
              <Link
                to="/user/media"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                Media
              </Link>
              <Link
                to="/user/timeline"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                Timeline
              </Link>
              <Link
                to="/user/assistant"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                Polar Assistant
              </Link>
            </div>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              About
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Integrated Polar Science Outreach & Knowledge Platform
            </p>
          </div>
        </div>
        <div className="border-t border-border py-4 text-center font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          POLARIS · Discover · Understand · Explore
        </div>
      </footer>
    </div>
  );
}
