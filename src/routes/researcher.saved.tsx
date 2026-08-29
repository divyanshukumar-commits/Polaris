import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/polaris/core";
import { SavedGrid } from "@/components/polaris/explorers";

export const Route = createFileRoute("/researcher/saved")({
  head: () => ({
    meta: [
      { title: "Saved Library — POLARIS" },
      {
        name: "description",
        content: "Your bookmarked polar science research and dataset references.",
      },
      { property: "og:title", content: "Saved Library — POLARIS" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ResearcherSavedPage,
});

function ResearcherSavedPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Researcher Portal · Bookmarks"
        title="Saved Research & References"
        description="Quick access to all publications, dataset records, and expedition summaries bookmarked for active study."
      />
      <SavedGrid />
    </div>
  );
}
