import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/polaris/core";
import { SavedGrid } from "@/components/polaris/explorers";

export const Route = createFileRoute("/user/saved")({
  head: () => ({
    meta: [
      { title: "Saved Library — POLARIS" },
      {
        name: "description",
        content: "Your bookmarked polar science research, ready for quick access.",
      },
      { property: "og:title", content: "Saved Library — POLARIS" },
      { property: "og:description", content: "Your bookmarked polar research." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SavedPage,
});

function SavedPage() {
  return (
    <div>
      <PageHeader
        eyebrow="User Portal"
        title="Saved Library"
        description="Everything you've bookmarked from the repository, in one place."
      />
      <SavedGrid />
    </div>
  );
}
