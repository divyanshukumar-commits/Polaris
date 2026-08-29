import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  Compass,
  Globe2,
  Image as ImageIcon,
  Library,
  MessageSquareText,
  Newspaper,
  Rocket,
  Satellite,
  Sparkles,
  Tag,
  X,
} from "lucide-react";
import { SectionTitle, StatCard } from "@/components/polaris/core";
import {
  ExpeditionCard,
  MediaCard,
  MediaLightbox,
  MediaVisual,
  ResearchCard,
  ResearchDetailModal,
} from "@/components/polaris/cards";
import { useApp } from "@/lib/store";
import { expeditions } from "@/lib/data/expeditions";
import { mediaAssets } from "@/lib/data/media";
import { newsItems } from "@/lib/data/news";
import type { MediaAsset, NewsItem, ResearchItem } from "@/lib/data/types";
import { useState } from "react";
import { InteractiveGlobe } from "@/components/polaris/interactive-globe";

export const Route = createFileRoute("/user/")({
  head: () => ({
    meta: [
      { title: "User Dashboard — POLARIS" },
      {
        name: "description",
        content:
          "Explore the world's polar science: research, expeditions, discoveries and stories from the Arctic and Antarctic.",
      },
      { property: "og:title", content: "User Dashboard — POLARIS" },
      {
        property: "og:description",
        content: "Discover research, expeditions and stories from the Arctic and Antarctic.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: UserDashboard,
});

function UserDashboard() {
  const { allResearch } = useApp();
  const [openResearch, setOpenResearch] = useState<ResearchItem | null>(null);
  const [openMedia, setOpenMedia] = useState<MediaAsset | null>(null);
  const [openNews, setOpenNews] = useState<NewsItem | null>(null);

  const latest = [...allResearch]
    .filter((r) => r.status === "Published")
    .sort((a, b) => b.year - a.year)
    .slice(0, 3);
  const featuredExpeditions = expeditions.filter((e) => e.status === "Active").slice(0, 3);
  const featuredMedia = mediaAssets.slice(0, 4);
  const news = newsItems.slice(0, 4);

  return (
    <div>
      {/* hero */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-strong bg-grid relative overflow-hidden rounded-3xl p-8 glow-primary md:p-12"
      >
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -bottom-24 right-24 h-56 w-56 rounded-full bg-chart-2/10 blur-3xl" />
        <p className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
          <Satellite size={12} /> User Portal
        </p>
        <h1 className="mt-4 max-w-2xl font-display text-3xl font-bold leading-tight text-foreground md:text-5xl">
          Explore the World's <span className="text-aurora">Polar Science</span>
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
          Discover research, expeditions, discoveries and stories from the Arctic and Antarctic.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/user/repository"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Explore Polar Science <ArrowRight size={15} />
          </Link>
          <Link
            to="/user/expeditions"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-secondary/60 px-5 py-3 text-sm font-semibold text-foreground hover:border-primary/40"
          >
            <Compass size={15} className="text-primary" /> Explore Expeditions
          </Link>
        </div>
      </motion.section>

      {/* stats */}
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={<Library size={16} />} label="Research Resources" value={1250} suffix="+" />
        <StatCard icon={<Rocket size={16} />} label="Expeditions" value={85} suffix="+" />
        <StatCard icon={<ImageIcon size={16} />} label="Media Assets" value={3400} suffix="+" />
      </div>

      <section className="mt-10">
        <SectionTitle
          title="Live Polar Earth Observatory"
          action={
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Expeditions & research activity
            </span>
          }
        />
        <InteractiveGlobe className="h-[460px] w-full" />
      </section>

      {/* polar regions */}
      <div className="mt-10">
        <SectionTitle title="Explore Polar Regions" />
        <div className="grid gap-5 md:grid-cols-2">
          {[
            {
              name: "ARCTIC",
              tags: ["Climate", "Ice", "Ocean", "Wildlife"],
              desc: "Sea ice, permafrost, Greenland ice sheet and the rapidly warming High North.",
            },
            {
              name: "ANTARCTIC",
              tags: ["Ice Sheets", "Climate", "Oceanography", "Research Stations"],
              desc: "The coldest continent — ice cores, Southern Ocean and India's Maitri & Bharati stations.",
            },
          ].map((r) => (
            <Link
              key={r.name}
              to="/user/repository"
              className="glass card-hover-lift group relative overflow-hidden rounded-2xl p-6 glow-soft"
            >
              <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-primary/10 blur-2xl transition-all group-hover:bg-primary/20" />
              <Globe2 size={22} className="text-primary" />
              <h3 className="mt-3 font-display text-2xl font-bold tracking-[0.15em] text-foreground group-hover:text-primary transition-colors">
                {r.name}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{r.desc}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {r.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border bg-secondary/60 px-2.5 py-1 text-[11px] font-medium text-secondary-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* latest research */}
      <div className="mt-10">
        <SectionTitle
          title="Latest Published Research"
          action={
            <Link
              to="/user/repository"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              View all <ArrowRight size={12} />
            </Link>
          }
        />
        <div className="no-scrollbar flex snap-x gap-5 overflow-x-auto pb-3">
          {latest.map((r) => (
            <div key={r.id} className="w-[min(86vw,320px)] shrink-0 snap-start">
              <ResearchCard item={r} onOpen={setOpenResearch} />
            </div>
          ))}
        </div>
      </div>

      {/* featured expeditions */}
      <div className="mt-10">
        <SectionTitle
          title="Featured Expeditions"
          action={
            <Link
              to="/user/expeditions"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              Open map <ArrowRight size={12} />
            </Link>
          }
        />
        <div className="no-scrollbar flex snap-x gap-5 overflow-x-auto pb-3">
          {featuredExpeditions.map((e) => (
            <div key={e.id} className="w-[min(86vw,320px)] shrink-0 snap-start">
              <ExpeditionCard expedition={e} />
            </div>
          ))}
        </div>
      </div>

      {/* media strip + news with mini image thumbnails synced */}
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SectionTitle
            title="Featured Media"
            action={
              <Link
                to="/user/media"
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                Gallery <ArrowRight size={12} />
              </Link>
            }
          />
          <div className="no-scrollbar flex snap-x gap-4 overflow-x-auto pb-3">
            {featuredMedia.map((m) => (
              <div key={m.id} className="w-[min(82vw,290px)] shrink-0 snap-start">
                <MediaCard asset={m} onOpen={setOpenMedia} />
              </div>
            ))}
          </div>
        </div>

        {/* News and Updates Column with Mini Images */}
        <div>
          <SectionTitle title="News & Updates" />
          <div className="space-y-3">
            {news.map((n) => (
              <div
                key={n.id}
                onClick={() => setOpenNews(n)}
                className="glass card-hover-lift flex gap-3.5 rounded-2xl p-3.5 cursor-pointer border border-border/70 hover:border-primary/40 transition-all"
              >
                {/* Mini Image Thumbnail */}
                <div className="h-16 w-20 shrink-0 overflow-hidden rounded-xl border border-border/60 bg-slate-900">
                  <MediaVisual seed={n.seed || 101} className="h-full w-full" />
                </div>

                {/* News Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-primary font-bold">
                      {n.category}
                    </span>
                    <span className="text-muted-foreground text-[10px]">· {n.date}</span>
                  </div>
                  <h4 className="mt-1 text-xs font-bold leading-snug text-foreground line-clamp-2 hover:text-primary transition-colors">
                    {n.title}
                  </h4>
                  <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground line-clamp-1">
                    {n.summary}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* assistant promo banner */}
      <Link
        to="/user/assistant"
        className="glass-strong card-hover-lift mt-10 flex flex-wrap items-center gap-4 rounded-3xl p-6 glow-soft border border-primary/30"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/40 bg-primary/20 text-primary glow-primary">
          <MessageSquareText size={22} />
        </span>
        <div className="flex-1">
          <p className="font-display text-base font-bold text-foreground">
            Meet the POLARIS Hatbot & Voice Assistant
          </p>
          <p className="text-sm text-muted-foreground">
            Ask anything about polar science via voice or text — answers come with verified research
            citations.
          </p>
        </div>
        <ArrowRight size={18} className="text-primary" />
      </Link>

      {/* Synchronized News Detail Modal */}
      <AnimatePresence>
        {openNews && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-strong relative w-full max-w-xl overflow-hidden rounded-3xl p-6 md:p-8 glow-primary border border-primary/30"
            >
              <button
                onClick={() => setOpenNews(null)}
                className="absolute right-4 top-4 rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <X size={18} />
              </button>

              <div className="h-44 w-full overflow-hidden rounded-2xl border border-border">
                <MediaVisual seed={openNews.seed || 101} className="h-full w-full" />
              </div>

              <div className="mt-4 flex items-center gap-2 font-mono text-xs">
                <span className="rounded-md bg-primary/15 px-2 py-0.5 font-bold text-primary uppercase text-[10px]">
                  {openNews.category}
                </span>
                <span className="text-muted-foreground">{openNews.date}</span>
                <span className="text-muted-foreground uppercase">· {openNews.region}</span>
              </div>

              <h3 className="mt-3 font-display text-xl font-bold text-foreground">
                {openNews.title}
              </h3>

              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                {openNews.content || openNews.summary}
              </p>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setOpenNews(null)}
                  className="rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-md hover:opacity-90 glow-primary"
                >
                  Close Article
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ResearchDetailModal item={openResearch} onClose={() => setOpenResearch(null)} />
      <MediaLightbox asset={openMedia} onClose={() => setOpenMedia(null)} />
    </div>
  );
}
