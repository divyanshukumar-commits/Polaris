import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/polaris/core";
import { ResearchBrowser } from "@/components/polaris/explorers";

export const Route = createFileRoute("/user/repository")({
  head: () => ({
    meta: [
      { title: "Polar Knowledge Repository — POLARIS" },
      { name: "description", content: "Search and filter polar science research papers, reports, articles, datasets and educational resources across the Arctic and Antarctic." },
      { property: "og:title", content: "Polar Knowledge Repository — POLARIS" },
      { property: "og:description", content: "Search the integrated polar science knowledge repository." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: RepositoryPage,
});

function RepositoryPage() {
  return (
    <div>
      <PageHeader
        eyebrow="User Portal"
        title="Polar Knowledge Repository"
        description="Search papers, reports, datasets and educational resources from NPDC, NCPOR, ISRO/VEDAS and partner institutions — all in one place."
      />
      <ResearchBrowser />
    </div>
  );
}
