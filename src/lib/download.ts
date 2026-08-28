import type { ResearchItem } from "./data/types";

function safeFileName(value: string) {
  return value.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase();
}

export function downloadResearchItem(item: ResearchItem) {
  if (!item.downloadUrl) return;
  const anchor = document.createElement("a");
  anchor.href = item.downloadUrl;
  anchor.download = `${safeFileName(item.title) || item.id}.pdf`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}