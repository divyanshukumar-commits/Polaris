import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/polaris/core";
import { ExpeditionsExplorer } from "@/components/polaris/explorers";

export const Route = createFileRoute("/user/expeditions")({
  head: () => ({
    meta: [
      { title: "Interactive Expedition Map — POLARIS" },
      { name: "description", content: "Track active, upcoming and completed polar expeditions on an interactive Arctic and Antarctic map." },
      { property: "og:title", content: "Interactive Expedition Map — POLARIS" },
      { property: "og:description", content: "Explore polar expeditions on the interactive polar map." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ExpeditionsPage,
});

function ExpeditionsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="User Portal"
        title="Polar Expeditions"
        description="Live missions across both poles. Select a marker to inspect the research team, objectives and timeline."
      />
      <ExpeditionsExplorer />
    </div>
  );
}
