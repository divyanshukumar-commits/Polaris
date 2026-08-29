import type { Expedition } from "./data/types";
import { toast } from "sonner";

export function generateExpeditionPDF(expedition: Expedition) {
  if (typeof window === "undefined") return;

  try {
    const reportDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const statusBadgeColor =
      expedition.status === "Active"
        ? "#059669"
        : expedition.status === "Upcoming"
          ? "#2563eb"
          : "#64748b";

    const printHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>POLARIS Expedition Report — ${expedition.name}</title>
  <style>
    @page {
      size: A4;
      margin: 18mm 16mm 18mm 16mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      line-height: 1.45;
      font-size: 11pt;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2.5px solid #0891b2;
      padding-bottom: 12px;
      margin-bottom: 16px;
    }
    .logo-area h1 {
      font-size: 18pt;
      font-weight: 800;
      color: #082f49;
      letter-spacing: -0.5px;
      text-transform: uppercase;
    }
    .logo-area p {
      font-size: 8.5pt;
      font-weight: 600;
      color: #0891b2;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-top: 2px;
    }
    .report-meta {
      text-align: right;
      font-size: 8.5pt;
      color: #64748b;
    }
    .report-meta strong {
      color: #0f172a;
    }
    .title-section {
      margin-bottom: 14px;
    }
    .title-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 4px;
    }
    .status-badge {
      display: inline-block;
      font-size: 8pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: white;
      background: ${statusBadgeColor};
      padding: 2px 8px;
      border-radius: 4px;
    }
    .region-badge {
      display: inline-block;
      font-size: 8pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #0891b2;
      background: #ecfeff;
      border: 1px solid #a5f3fc;
      padding: 2px 8px;
      border-radius: 4px;
    }
    .expedition-name {
      font-size: 16pt;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.2;
      margin-top: 6px;
    }
    .expedition-location {
      font-size: 9.5pt;
      color: #475569;
      margin-top: 4px;
      font-weight: 500;
    }
    .summary-box {
      background: #f8fafc;
      border-left: 3.5px solid #0891b2;
      padding: 10px 14px;
      border-radius: 4px;
      margin-bottom: 16px;
    }
    .summary-box h3 {
      font-size: 9pt;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #0891b2;
      font-weight: 700;
      margin-bottom: 4px;
    }
    .summary-box p {
      font-size: 9.5pt;
      color: #1e293b;
      line-height: 1.5;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 16px;
    }
    .card {
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 10px 12px;
      background: #ffffff;
    }
    .card h4 {
      font-size: 8.5pt;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #64748b;
      margin-bottom: 8px;
      font-weight: 700;
    }
    .lead-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .lead-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      object-fit: cover;
      border: 1.5px solid #0891b2;
      background: #e2e8f0;
    }
    .lead-text h5 {
      font-size: 10.5pt;
      font-weight: 700;
      color: #0f172a;
    }
    .lead-text p {
      font-size: 8.5pt;
      color: #475569;
      margin-top: 1px;
    }
    .meta-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 9pt;
    }
    .meta-table td {
      padding: 3px 0;
      vertical-align: top;
    }
    .meta-table .label {
      color: #64748b;
      width: 40%;
      font-weight: 500;
    }
    .meta-table .value {
      color: #0f172a;
      font-weight: 600;
      width: 60%;
    }
    .section-title {
      font-size: 11pt;
      font-weight: 700;
      color: #082f49;
      border-bottom: 1.5px solid #e2e8f0;
      padding-bottom: 4px;
      margin: 16px 0 10px 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .objectives-list {
      list-style-type: none;
      padding-left: 0;
      margin-bottom: 16px;
    }
    .objectives-list li {
      position: relative;
      padding-left: 18px;
      margin-bottom: 6px;
      font-size: 9.5pt;
      color: #334155;
    }
    .objectives-list li::before {
      content: "•";
      position: absolute;
      left: 4px;
      top: -1px;
      color: #0891b2;
      font-size: 14pt;
    }
    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      margin-bottom: 16px;
    }
    .gallery-item {
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      overflow: hidden;
      background: #f8fafc;
    }
    .gallery-item img {
      width: 100%;
      height: 140px;
      object-fit: cover;
      display: block;
    }
    .gallery-caption {
      padding: 6px 8px;
      font-size: 8pt;
      color: #334155;
      line-height: 1.35;
    }
    .gallery-caption strong {
      color: #0f172a;
      display: block;
      margin-bottom: 1px;
    }
    .gallery-credit {
      font-size: 7pt;
      color: #64748b;
      margin-top: 2px;
    }
    .footer {
      border-top: 1.5px solid #e2e8f0;
      padding-top: 10px;
      margin-top: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 8pt;
      color: #64748b;
    }
    @media print {
      body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .page-break {
        page-break-before: always;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo-area">
      <h1>POLARIS</h1>
      <p>Indian Polar Science & Ocean Research Portal</p>
    </div>
    <div class="report-meta">
      <div>Mission Record: <strong>${expedition.id.toUpperCase()}</strong></div>
      <div>Generated: <strong>${reportDate}</strong></div>
      <div>Agency: <strong>${expedition.leadAgency || "NCPOR / MoES"}</strong></div>
    </div>
  </div>

  <div class="title-section">
    <div class="title-row">
      <span class="status-badge">${expedition.status}</span>
      <span class="region-badge">${expedition.region}</span>
      ${expedition.stationRef ? `<span class="region-badge" style="color: #475569; border-color: #cbd5e1;">${expedition.stationRef}</span>` : ""}
    </div>
    <h2 class="expedition-name">${expedition.name}</h2>
    <p class="expedition-location">📍 ${expedition.location} · (${expedition.lat > 0 ? `${expedition.lat}°N` : `${Math.abs(expedition.lat)}°S`}, ${expedition.lon > 0 ? `${expedition.lon}°E` : `${Math.abs(expedition.lon)}°W`})</p>
  </div>

  <div class="summary-box">
    <h3>Executive Plain-Language Summary</h3>
    <p>${expedition.plainSummary || expedition.summary || expedition.description || "Long-term polar environmental and cryosphere monitoring mission under the Ministry of Earth Sciences."}</p>
  </div>

  <div class="grid-2">
    <div class="card">
      <h4>Lead Researcher & Personnel</h4>
      <div class="lead-info">
        ${expedition.leadAvatar ? `<img class="lead-avatar" src="${expedition.leadAvatar}" alt="${expedition.lead || "Lead Scientist"}" />` : `<div class="lead-avatar" style="display:flex;align-items:center;justify-content:center;font-weight:bold;color:#0891b2;">${(expedition.lead || "Lead").slice(0, 2).toUpperCase()}</div>`}
        <div class="lead-text">
          <h5>${expedition.lead || "Lead Scientist"}</h5>
          <p>${expedition.leadRole || "Principal Investigator"}</p>
          <p style="font-size: 8pt; color: #0891b2; font-weight: 600; margin-top: 3px;">👥 ${expedition.members || expedition.team || 0} Expedition Scientists & Technicians</p>
        </div>
      </div>
    </div>

    <div class="card">
      <h4>Expedition Parameters</h4>
      <table class="meta-table">
        <tr>
          <td class="label">Research Discipline:</td>
          <td class="value">${expedition.researchArea || "Polar Sciences & Cryosphere"}</td>
        </tr>
        <tr>
          <td class="label">Operational Period:</td>
          <td class="value">${expedition.startDate || expedition.startYear} → ${expedition.endDate || expedition.endYear || "Ongoing"}</td>
        </tr>
        <tr>
          <td class="label">Station Depot:</td>
          <td class="value">${expedition.stationRef || expedition.location}</td>
        </tr>
        <tr>
          <td class="label">Telemetry Status:</td>
          <td class="value" style="color: #059669;">${expedition.telemetryStatus || "Operational (Verified)"}</td>
        </tr>
      </table>
    </div>
  </div>

  <div class="section-title">Scientific Objectives & Work Packages</div>
  <ul class="objectives-list">
    ${(expedition.objectives ?? (expedition.objective ? [expedition.objective] : [])).map((obj) => `<li>${obj}</li>`).join("")}
  </ul>

  ${
    expedition.keyFindings && expedition.keyFindings.length > 0
      ? `
  <div class="section-title">Field Findings & Observational Highlights</div>
  <ul class="objectives-list">
    ${expedition.keyFindings.map((finding) => `<li>${finding}</li>`).join("")}
  </ul>
  `
      : ""
  }

  ${
    expedition.gallery && expedition.gallery.length > 0
      ? `
  <div class="section-title">Expedition Field Imagery & Documentation</div>
  <div class="gallery-grid">
    ${expedition.gallery
      .map(
        (img, idx) => `
      <div class="gallery-item">
        <img src="${img.url}" alt="${img.caption}" />
        <div class="gallery-caption">
          <strong>Figure ${idx + 1}: ${img.tag || "Field Record"}</strong>
          ${img.caption}
          ${img.credit ? `<div class="gallery-credit">Credit: ${img.credit}</div>` : ""}
        </div>
      </div>
    `,
      )
      .join("")}
  </div>
  `
      : ""
  }

  <div class="footer">
    <div>National Centre for Polar and Ocean Research (NCPOR) · Ministry of Earth Sciences, Govt. of India</div>
    <div>POLARIS Digital Record · polaris.gov.in · Official Scientific Report</div>
  </div>
</body>
</html>
    `;

    // Create an invisible iframe to execute the print preview
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "none";
    document.body.appendChild(iframe);

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) {
      toast.error("Unable to generate PDF preview");
      return;
    }

    doc.open();
    doc.write(printHtml);
    doc.close();

    toast.info("Preparing printable PDF document...", {
      description: "Opening system print & PDF save dialog.",
    });

    iframe.onload = () => {
      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        setTimeout(() => {
          iframe.remove();
        }, 3000);
      }, 500);
    };
  } catch (err) {
    console.error("PDF generation failed:", err);
    toast.error("Failed to generate PDF report");
  }
}
