import type { ResearchItem } from "./data/types";

function safeFileName(value: string) {
  return value
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

export function downloadResearchItem(item: ResearchItem) {
  const url = item.downloadUrl;
  if (!url || !canDownloadResearchItem(item)) return false;
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${safeFileName(item.title) || item.id}.pdf`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  return true;
}

export function canDownloadResearchItem(item: ResearchItem) {
  return Boolean(
    item.downloadUrl &&
    item.verified !== false &&
    item.access !== "restricted" &&
    item.access !== "confidential" &&
    item.downloadAllowed !== false,
  );
}
