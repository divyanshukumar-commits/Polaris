import type {
  ResearchAttachment,
  ResearchGalleryItem,
  ResearchItem,
  ResearchTimelineEvent,
} from "./types";

export const researchItems: ResearchItem[] = [
  {
    id: "res-001",
    title: "Accelerated Mass Loss of the Antarctic Ice Sheet from GRACE-FO Gravimetry",
    authors: ["Dr. Thamban Meloth", "Dr. Anitha Krishnan", "Prof. Helen Fricker"],
    institution: "National Centre for Polar and Ocean Research (NCPOR), Goa",
    year: 2025,
    region: "Antarctic",
    topic: "Glaciology",
    type: "Research Paper",
    abstract:
      "Two decades of satellite gravimetry reveal that the Antarctic Ice Sheet lost over 2,700 Gt of ice between 2002 and 2024, with the rate of loss tripling in West Antarctica. This synthesis combines GRACE-FO observations with regional climate model output to partition surface mass balance and ice-dynamical drivers.",
    keyFindings: [
      "West Antarctica accounts for ~82% of total mass loss since 2002.",
      "Pine Island and Thwaites glaciers show sustained dynamic thinning of 2–4 m/yr.",
      "East Antarctic mass gains from snowfall do not offset coastal discharge.",
    ],
    tags: ["ice sheet", "GRACE-FO", "mass balance", "sea level"],
    views: 18420,
    status: "Published",
    dateAdded: "2025-03-14",
    expeditionId: "exp-01",
    doi: "10.1038/s41561-025-01420-x",
    downloadUrl: "https://doi.org/10.1038/s41561-025-01420-x",
    imageUrl:
      "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=800&q=80",
    imageSourceUrl: "https://unsplash.com/photos/3c6PswZ_Bc4",
  },
  {
    id: "res-002",
    title: "Atlantification of Kongsfjorden: A Decade of Mooring Observations from Himadri",
    authors: ["Dr. Geeta Nair", "Dr. Svein Osterhus"],
    institution: "NCPOR & Norwegian Polar Institute",
    year: 2024,
    region: "Arctic",
    topic: "Oceanography",
    type: "Research Paper",
    abstract:
      "Continuous mooring records from India's Himadri station document the transformation of Kongsfjorden from an Arctic to an Atlantic-dominated system. Warm-water intrusions now reach the inner fjord in every season, reshaping stratification and winter sea-ice formation.",
    keyFindings: [
      "Winter Atlantic water temperature rose 1.1 °C over the decade.",
      "Seasonal fast-ice duration shortened by 31 days since 2014.",
      "Zooplankton community shifted toward boreal Atlantic species.",
    ],
    tags: ["Atlantification", "fjord", "mooring", "Svalbard"],
    views: 9210,
    status: "Published",
    dateAdded: "2024-11-02",
    expeditionId: "exp-08",
    doi: "10.1029/2024JC020941",
    downloadUrl: "https://doi.org/10.1029/2024JC020941",
    imageUrl:
      "https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=800&q=80",
    imageSourceUrl: "https://unsplash.com/photos/mkT7D4HeC8M",
  },
  {
    id: "res-003",
    title: "Black Carbon Deposition on Svalbard Glaciers and its Radiative Forcing",
    authors: ["Dr. Rahul Dey", "Dr. Maria Kask"],
    institution: "NCPOR & University Centre in Svalbard (UNIS)",
    year: 2023,
    region: "Arctic",
    topic: "Climate",
    type: "Research Paper",
    abstract:
      "Snow-pit and aerosol measurements across four Svalbard glaciers show that long-range transported black carbon, augmented by regional shipping, lowers snow albedo measurably during the melt season. Radiative transfer modelling estimates a forcing of 2.8 W/m² during peak melt.",
    keyFindings: [
      "Peak BC concentrations of 42 ng/g observed in late spring snowpacks.",
      "Albedo reduction advances snowmelt onset by 6–10 days.",
      "Shipping emissions contribute ~18% of deposited BC in western Spitsbergen.",
    ],
    tags: ["black carbon", "aerosols", "albedo", "radiative forcing"],
    views: 6540,
    status: "Published",
    dateAdded: "2023-07-19",
    expeditionId: "exp-02",
    doi: "10.5194/acp-23-8821-2023",
    downloadUrl: "https://doi.org/10.5194/acp-23-8821-2023",
    imageUrl:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80",
    imageSourceUrl: "https://unsplash.com/photos/2Xox-_fQr8k",
  },
  {
    id: "res-004",
    title: "Basal Melting of the Amery Ice Shelf from Oceanographic Moorings",
    authors: ["Dr. Anoop Mahajan", "Dr. Laura Herraiz-Borreguero"],
    institution: "NCPOR & CSIRO",
    year: 2025,
    region: "Antarctic",
    topic: "Oceanography",
    type: "Report",
    abstract:
      "The first year-long mooring record beneath the Amery Ice Shelf front shows seasonal pulses of modified Circumpolar Deep Water reaching the grounding-line region. Basal melt rates peak in late austral summer, with meltwater export freshening Prydz Bay Bottom Water formation.",
    keyFindings: [
      "Basal melt peaks at 1.9 m/yr near the deep grounding line.",
      "Meltwater export contributes to a 12% freshening of shelf water.",
      "Warm intrusions follow a trough aligned with the Prydz Channel.",
    ],
    tags: ["ice shelf", "basal melt", "Prydz Bay", "mooring"],
    views: 7300,
    status: "Published",
    dateAdded: "2025-05-30",
    expeditionId: "exp-03",
    doi: "10.1016/j.dsr2.2025.105421",
    downloadUrl: "https://doi.org/10.1016/j.dsr2.2025.105421",
    imageUrl:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80",
    imageSourceUrl: "https://unsplash.com/photos/91n_a9B4mQk",
  },
  {
    id: "res-005",
    title: "Polar-Orbiting Satellite Retrievals of Sea-Ice Thickness: VEDAS Validation Study",
    authors: ["Dr. K. S. Rajesh", "Dr. P. L. N. Murthy"],
    institution: "ISRO Space Applications Centre (SAC), Ahmedabad",
    year: 2024,
    region: "Arctic",
    topic: "Space & Satellite",
    type: "Dataset",
    abstract:
      "A validated Arctic sea-ice thickness product derived from CryoSat-2 and AltiKa altimetry, curated for ISRO's VEDAS visualization platform. The dataset spans 2013–2024 with monthly 25 km gridding and uncertainty fields suitable for assimilation into ice-ocean models.",
    keyFindings: [
      "AltiKa-CryoSat fusion reduces freeboard uncertainty by 22%.",
      "September mean thickness declined from 2.1 m (2013) to 1.4 m (2024).",
      "Open VEDAS layers enable public exploration of 11 years of change.",
    ],
    tags: ["VEDAS", "ISRO", "sea ice", "altimetry", "dataset"],
    views: 15030,
    status: "Published",
    dateAdded: "2024-02-11",
    doi: "10.3390/rs16040682",
    downloadUrl: "https://doi.org/10.3390/rs16040682",
    imageUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
    imageSourceUrl: "https://unsplash.com/photos/5F1Mlkd8t0I",
  },
  {
    id: "res-006",
    title: "Emperor Penguin Colony Decline Linked to Early Sea-Ice Breakup",
    authors: ["Dr. Peter Fretwell", "Dr. Avantika Singh"],
    institution: "British Antarctic Survey & NCPOR",
    year: 2023,
    region: "Antarctic",
    topic: "Wildlife",
    type: "Research Paper",
    abstract:
      "Satellite imagery and guano-stain mapping across the Bellingshausen Sea show unprecedented breeding failure in emperor penguin colonies following record-low sea-ice extent in 2022. Four of five monitored colonies experienced total reproductive failure.",
    keyFindings: [
      "Four colonies suffered total chick loss after early ice breakup.",
      "Colonies on stable fast ice maintained normal breeding success.",
      "Models project 90% of colonies quasi-extinct by 2100 under high emissions.",
    ],
    tags: ["emperor penguin", "sea ice", "breeding", "remote sensing"],
    views: 21500,
    status: "Published",
    dateAdded: "2023-09-08",
    doi: "10.1038/s43247-023-00927-x",
    downloadUrl: "https://doi.org/10.1038/s43247-023-00927-x",
    imageUrl:
      "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=800&q=80",
    imageSourceUrl: "https://unsplash.com/photos/3hN7zOJQzsE",
  },
  {
    id: "res-007",
    title: "Subglacial Lake Hydrology Beneath Recovery Glacier, East Antarctica",
    authors: ["Dr. S. R. Golledge", "Dr. Nivedita Chatterjee"],
    institution: "NCPOR & University of Edinburgh",
    year: 2022,
    region: "Antarctic",
    topic: "Glaciology",
    type: "Article",
    abstract:
      "Radar sounding and surface-height anomalies reveal an active subglacial hydrological network beneath Recovery Glacier. Periodic lake drainage events coincide with transient ice-flow acceleration, demonstrating hydrological control on one of East Antarctica's largest outlet glaciers.",
    keyFindings: [
      "Three active subglacial lakes drain on 3–5 year cycles.",
      "Drainage events raise ice velocity by up to 12% for several months.",
      "Basal water routing channels flow toward the Filchner Ice Shelf.",
    ],
    tags: ["subglacial lakes", "ice dynamics", "radar", "hydrology"],
    views: 5800,
    status: "Published",
    dateAdded: "2022-12-01",
    doi: "10.1029/2022GL099182",
    downloadUrl: "https://doi.org/10.1029/2022GL099182",
    imageUrl:
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80",
    imageSourceUrl: "https://unsplash.com/photos/8hP-AA90k2Y",
  },
  {
    id: "res-008",
    title: "Permafrost Thaw and Greenhouse Gas Fluxes in the High Arctic",
    authors: ["Dr. Ingrid Bakken", "Dr. Vivek Sharma"],
    institution: "University of Tromsø & NCPOR",
    year: 2025,
    region: "Arctic",
    topic: "Geology",
    type: "Report",
    abstract:
      "Eddy-covariance towers and soil cores across Svalbard's permafrost landscapes quantify a shift from carbon sink to source during thaw years. Abrupt thaw features (thermokarst) emit methane at rates an order of magnitude higher than gradual thaw areas.",
    keyFindings: [
      "Thermokarst wetlands emit 14× more CH₄ per unit area than intact tundra.",
      "Growing-season CO₂ uptake fell 35% after the warm winter of 2024.",
      "Active-layer thickness increased 8 cm on average since 2018.",
    ],
    tags: ["permafrost", "methane", "carbon cycle", "thermokarst"],
    views: 4970,
    status: "Published",
    dateAdded: "2025-01-25",
    doi: "10.1038/s41558-024-02189-w",
    downloadUrl: "https://doi.org/10.1038/s41558-024-02189-w",
    imageUrl:
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=800&q=80",
    imageSourceUrl: "https://unsplash.com/photos/AAuQscvR0Q4",
  },
  {
    id: "res-009",
    title: "Atmospheric Rivers Drive Extreme Snowfall Events over Dronning Maud Land",
    authors: ["Dr. Anitha Krishnan", "Prof. Irina Gorodetskaya"],
    institution: "NCPOR & KU Leuven",
    year: 2024,
    region: "Antarctic",
    topic: "Meteorology",
    type: "Research Paper",
    abstract:
      "Using radar and radiosonde data from Bharati station, this study shows that atmospheric rivers deliver up to 40% of annual snowfall to coastal Dronning Maud Land. While these events temporarily add ice-sheet mass, they also trigger rain-on-snow and surface melt anomalies.",
    keyFindings: [
      "12–18 atmospheric river events reach the coast each year.",
      "Two events in 2024 delivered 35% of the annual accumulation.",
      "Rain-on-snow days have tripled since the 1990s at Bharati.",
    ],
    tags: ["atmospheric river", "snowfall", "Bharati", "extremes"],
    views: 6120,
    status: "Published",
    dateAdded: "2024-08-16",
    expeditionId: "exp-01",
    doi: "10.1029/2024GL108744",
    downloadUrl: "https://doi.org/10.1029/2024GL108744",
    imageUrl:
      "https://images.unsplash.com/photo-1482192505345-5655af888cc4?auto=format&fit=crop&w=800&q=80",
    imageSourceUrl: "https://unsplash.com/photos/1Dk3p2LkK4E",
  },
  {
    id: "res-010",
    title: "Polar Science for Schools: An Outreach Curriculum Built on NPDC Open Data",
    authors: ["Dr. Meena Krishnamurthy", "Polar Outreach Cell, NCPOR"],
    institution: "National Polar Data Centre (NPDC)",
    year: 2025,
    region: "Antarctic",
    topic: "Climate",
    type: "Educational Resource",
    abstract:
      "A classroom-ready curriculum translating NCPOR expedition data into inquiry-based modules for grades 8–12. Students work with real ice-core isotope records, satellite sea-ice charts from VEDAS, and penguin population time series to learn the scientific method through polar science.",
    keyFindings: [
      "12 modular lessons aligned with national curriculum frameworks.",
      "Pilot deployment reached 4,800 students across 64 schools.",
      "Pre/post testing shows 41% improvement in climate-data literacy.",
    ],
    tags: ["outreach", "education", "NPDC", "curriculum"],
    views: 12800,
    status: "Published",
    dateAdded: "2025-06-05",
    doi: "10.1080/10899995.2025.2448911",
    downloadUrl: "https://doi.org/10.1080/10899995.2025.2448911",
    imageUrl:
      "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=800&q=80",
    imageSourceUrl: "https://unsplash.com/photos/3EpXn5xwA7A",
  },
  {
    id: "res-011",
    title: "Gondwana Breakup Signatures in the Granulites of Schirmacher Oasis",
    authors: ["Dr. M. J. Beg", "Dr. K. R. Gupta"],
    institution: "Geological Survey of India & NCPOR",
    year: 2021,
    region: "Antarctic",
    topic: "Geology",
    type: "Research Paper",
    abstract:
      "Geochronology of granulite-facies rocks from the Schirmacher Oasis constrains the timing of Gondwana assembly and breakup. Zircon U-Pb ages of ~550 Ma link these terrains to the Eastern Ghats belt of India, providing a geological bridge across the Indian Ocean.",
    keyFindings: [
      "Zircon ages confirm Pan-African metamorphism at 545–560 Ma.",
      "Schirmacher terrains correlate directly with the Eastern Ghats.",
      "New mapping refines reconstructions of Indo-Antarctic fit.",
    ],
    tags: ["Gondwana", "geochronology", "Schirmacher", "bedrock"],
    views: 3890,
    status: "Published",
    dateAdded: "2021-10-12",
    doi: "10.1016/j.precamres.2021.106412",
    downloadUrl: "https://doi.org/10.1016/j.precamres.2021.106412",
    imageUrl:
      "https://images.unsplash.com/photo-1516912481808-3406841bd33c?auto=format&fit=crop&w=800&q=80",
    imageSourceUrl: "https://unsplash.com/photos/2Xox-_fQr8k",
  },
  {
    id: "res-012",
    title: "Arctic Amplification and its Teleconnection to the Indian Summer Monsoon",
    authors: ["Dr. Rasik Ravindra", "Dr. Sourav Chatterjee"],
    institution: "NCPOR & Indian Institute of Tropical Meteorology",
    year: 2024,
    region: "Arctic",
    topic: "Climate",
    type: "Research Paper",
    abstract:
      "Reanalysis and coupled-model experiments indicate that rapid Arctic warming weakens the meridional temperature gradient, altering upper-level jet dynamics that steer monsoon depressions. Reduced September sea-ice extent correlates with a 7% decline in central-India monsoon rainfall in recent decades.",
    keyFindings: [
      "Arctic warming is proceeding 3.8× faster than the global average.",
      "Low sea-ice years correspond to weakened monsoon jet dynamics.",
      "Teleconnection strength has increased since the mid-1990s.",
    ],
    tags: ["Arctic amplification", "monsoon", "teleconnection", "jet stream"],
    views: 16400,
    status: "Published",
    dateAdded: "2024-04-20",
    doi: "10.1038/s41612-024-00620-3",
    downloadUrl: "https://doi.org/10.1038/s41612-024-00620-3",
    imageUrl:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80",
    imageSourceUrl: "https://unsplash.com/photos/2Xox-_fQr8k",
  },
];

export function getResearchTimeline(item: ResearchItem): ResearchTimelineEvent[] {
  if (item.timeline && item.timeline.length > 0) {
    return item.timeline;
  }

  const primaryAuthor = item.authors[0] || item.publisherName || "Lead Researcher";
  const pubYear = item.year || 2025;
  const isPublished = item.status === "Published";
  const isUnderReview = item.status === "Under Review" || item.status === "Pending Review";
  const isDraft = item.status === "Draft";

  const events: ResearchTimelineEvent[] = [
    {
      id: `${item.id}-evt-1`,
      date: `${pubYear}-01-12 09:30 UTC`,
      actor: `${primaryAuthor}`,
      actorRole: "Author / Principal Investigator",
      action: "Research Project Initiated & Draft Created",
      note: "Initial manuscript structure, telemetry dataset mapping, and abstract drafted.",
      status: "info",
      iconType: "created",
    },
    {
      id: `${item.id}-evt-2`,
      date: `${pubYear}-01-28 14:15 UTC`,
      actor: `${primaryAuthor}`,
      actorRole: "Author / Principal Investigator",
      action: "Field Telemetry & Primary Data Files Uploaded",
      note: "Attached sensor matrices, observation figures, and processed NetCDF/CSV packages.",
      status: "info",
      iconType: "upload",
    },
    {
      id: `${item.id}-evt-3`,
      date: `${pubYear}-02-10 11:00 UTC`,
      actor: item.authors[1] || `${primaryAuthor}`,
      actorRole: "Co-Author / Research Collaborator",
      action: "Collaborator Review & Revisions Completed",
      note: "Methodology validation, uncertainty intervals, and figure captions updated.",
      status: "info",
      iconType: "collaborator",
    },
    {
      id: `${item.id}-evt-4`,
      date: `${pubYear}-02-24 16:45 UTC`,
      actor: `${primaryAuthor}`,
      actorRole: "Submitting Author",
      action: "Submitted to NCPOR Peer Review & Moderation Cell",
      note: "Official verification submission under Ministry of Earth Sciences standards.",
      status: isDraft ? "pending" : "success",
      iconType: "submitted",
    },
  ];

  if (!isDraft) {
    events.push({
      id: `${item.id}-evt-5`,
      date: `${pubYear}-03-05 10:20 UTC`,
      actor: "NCPOR Editorial & Scientific Review Board",
      actorRole: "Independent Peer Review Panel",
      action: isUnderReview ? "Peer Review In Progress" : "Peer Review Accepted with Minor Remarks",
      note: isUnderReview
        ? "Cryosphere telemetry under validation by polar atmospheric working group."
        : "Methodology verified. DOI allocated and archival compliance satisfied.",
      status: isUnderReview ? "warning" : "success",
      iconType: "review",
    });
  }

  if (isPublished) {
    events.push({
      id: `${item.id}-evt-6`,
      date: item.dateAdded ? `${item.dateAdded} 12:00 UTC` : `${pubYear}-03-14 18:00 UTC`,
      actor: "National Polar Data Centre (NPDC)",
      actorRole: "Repository Custodian",
      action: "Published to Open Access Polar Repository",
      note: `Published with DOI ${item.doi || "10.1016/j.polaris.2025.01"}. Verified and indexable across global polar databases.`,
      status: "success",
      iconType: "published",
    });
    events.push({
      id: `${item.id}-evt-7`,
      date: "2026-08-20 08:30 UTC",
      actor: "POLARIS Analytics Engine",
      actorRole: "Automated Telemetry Relay",
      action: "Active Repository Citation & Telemetry Sync",
      note: `Over ${item.views.toLocaleString()} verified views recorded. Telemetry linkage active.`,
      status: "info",
      iconType: "activity",
    });
  }

  // Return newest first
  return events.reverse();
}

export function getResearchGallery(item: ResearchItem): ResearchGalleryItem[] {
  if (item.gallery && item.gallery.length > 0) {
    return item.gallery;
  }

  if (item.imageUrl) {
    return [
      {
        id: `${item.id}-img-1`,
        url: item.imageUrl,
        caption: `Figure 1: ${item.title} — Primary field observation and monitoring setup.`,
        credit: item.institution || "NCPOR Scientific Archives",
        tag: "Field Observation",
      },
    ];
  }

  return [];
}

export function getResearchAttachments(item: ResearchItem): ResearchAttachment[] {
  if (item.attachments && item.attachments.length > 0) {
    return item.attachments;
  }

  return [
    {
      id: `${item.id}-att-pdf`,
      name: `${item.title.slice(0, 40).replace(/[^a-zA-Z0-9]+/g, "_")}_Manuscript.pdf`,
      size: 4820000,
      sizeFormatted: "4.8 MB",
      type: "application/pdf",
      category: "document",
      url: item.downloadUrl || "https://example.com/polaris-sample.pdf",
      uploadedAt: item.dateAdded || "2025-03-14",
    },
    {
      id: `${item.id}-att-data`,
      name: `${item.id}_Raw_Sensor_Telemetry.csv`,
      size: 1420000,
      sizeFormatted: "1.4 MB",
      type: "text/csv",
      category: "dataset",
      uploadedAt: item.dateAdded || "2025-03-14",
    },
  ];
}

export const researchById = (id: string) => researchItems.find((r) => r.id === id);
