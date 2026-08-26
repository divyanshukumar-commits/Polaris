import type { Expedition } from "./types";

export const expeditions: Expedition[] = [
  {
    id: "exp-01",
    name: "44th Indian Scientific Expedition to Antarctica (ISEA)",
    region: "Antarctic",
    location: "Maitri & Bharati Stations, Queen Maud Land",
    lat: -70.77,
    lon: 11.73,
    objective:
      "Long-term climate observation, ice-core drilling and atmospheric aerosol monitoring across the Indian Antarctic stations.",
    lead: "Dr. Thamban Meloth",
    team: 38,
    startDate: "2025-11-02",
    endDate: "2026-03-28",
    status: "Active",
    description:
      "The 44th ISEA, coordinated by NCPOR Goa, continues India's four-decade presence in Antarctica. Teams at Maitri and Bharati are recovering ice cores from the Princess Elizabeth Land margin, servicing the automatic weather station network, and deploying oceanographic moorings in Prydz Bay.",
  },
  {
    id: "exp-02",
    name: "Arctic Climate Observation Mission — Himadri 2026",
    region: "Arctic",
    location: "Himadri Station, Ny-Ålesund, Svalbard",
    lat: 78.92,
    lon: 11.93,
    objective:
      "Measure glacier mass balance, permafrost thaw rates and black-carbon deposition across the Kongsfjorden basin.",
    lead: "Dr. Rasik Ravindra",
    team: 14,
    startDate: "2026-04-15",
    endDate: "2026-09-30",
    status: "Upcoming",
    description:
      "India's Arctic programme at Himadri station focuses on the teleconnection between Arctic warming and the Indian monsoon. The 2026 campaign adds drone-based glacier surface velocity mapping and continuous methane flux towers along the retreating Kongsvegen glacier front.",
  },
  {
    id: "exp-03",
    name: "Prydz Bay Oceanographic Survey",
    region: "Antarctic",
    location: "Prydz Bay, East Antarctica",
    lat: -69.0,
    lon: 76.0,
    objective:
      "Profile Circumpolar Deep Water intrusion onto the continental shelf and its role in basal melting of the Amery Ice Shelf.",
    lead: "Dr. Anoop Mahajan",
    team: 22,
    startDate: "2025-12-10",
    endDate: "2026-02-20",
    status: "Active",
    description:
      "Ship-based CTD transects and Argo float deployments trace warm deep-water pathways beneath the Amery Ice Shelf. Moorings left over winter will capture the first full-year record of shelf-slope exchange in this sector.",
  },
  {
    id: "exp-04",
    name: "Greenland Ice Sheet Albedo Campaign",
    region: "Arctic",
    location: "Summit Station, Greenland Ice Sheet",
    lat: 72.58,
    lon: -38.45,
    objective:
      "Quantify how biological darkening and mineral dust reduce ice-sheet albedo and accelerate surface melt.",
    lead: "Dr. Marie Larsen",
    team: 9,
    startDate: "2025-06-01",
    endDate: "2025-08-25",
    status: "Completed",
    description:
      "A joint Indo-Danish campaign measuring spectral albedo across the western ablation zone. Ice-surface microbiology sampling confirmed that glacier ice algae can lower albedo by up to 13%, a feedback now being added to regional melt models.",
  },
  {
    id: "exp-05",
    name: "Larsen C Ice Shelf Rift Monitoring",
    region: "Antarctic",
    location: "Larsen C Ice Shelf, Antarctic Peninsula",
    lat: -67.5,
    lon: -62.0,
    objective:
      "Track rift propagation and calving dynamics with in-situ GPS, radar and satellite interferometry.",
    lead: "Dr. Sofia Andersson",
    team: 11,
    startDate: "2024-01-08",
    endDate: "2025-03-15",
    status: "Completed",
    description:
      "Following the A-68 calving event, this campaign instrumented the remaining shelf with 14 GPS stations and phase-sensitive radar. Data show the shelf front is re-advancing slower than models predicted, with implications for buttressing of upstream glaciers.",
  },
  {
    id: "exp-06",
    name: "Beaufort Sea Ice Drift Observatory",
    region: "Arctic",
    location: "Beaufort Sea, Arctic Ocean",
    lat: 75.2,
    lon: -140.0,
    objective:
      "Deploy an autonomous buoy network to measure sea-ice drift, thickness and ocean heat content through the freeze-up season.",
    lead: "Dr. James Kalluk",
    team: 7,
    startDate: "2025-09-12",
    endDate: "2026-05-30",
    status: "Active",
    description:
      "A 24-boy array drifting with the Beaufort Gyre is recording the thinnest multi-year ice yet observed in the region. Real-time telemetry feeds directly into seasonal ice forecasts used by Arctic shipping and coastal communities.",
  },
  {
    id: "exp-07",
    name: "Schirmacher Oasis Limnology & Geology Traverse",
    region: "Antarctic",
    location: "Schirmacher Oasis, near Maitri Station",
    lat: -70.75,
    lon: 11.6,
    objective:
      "Survey ice-free oasis lakes as sentinels of climate change and map exposed granulite terrains for Gondwana reconstruction.",
    lead: "Dr. M. J. Beg",
    team: 12,
    startDate: "2026-11-20",
    endDate: "2027-02-10",
    status: "Upcoming",
    description:
      "The Schirmacher Oasis hosts over 100 freshwater lakes whose chemistry records decades of environmental change. This traverse will core lake sediments and sample the exposed bedrock that links India's Eastern Ghats to East Antarctica in the ancient Gondwana supercontinent.",
  },
  {
    id: "exp-08",
    name: "Kongsfjorden–Krossfjorden Marine Ecosystem Study",
    region: "Arctic",
    location: "Svalbard Archipelago, Norway",
    lat: 79.0,
    lon: 12.0,
    objective:
      "Assess Atlantification impacts on fjord food webs, from phytoplankton phenology to polar cod and seabirds.",
    lead: "Dr. Geeta Nair",
    team: 16,
    startDate: "2024-05-05",
    endDate: "2024-10-01",
    status: "Completed",
    description:
      "Monthly fjord transects through a full melt season documented an earlier phytoplankton bloom and a northward shift of Atlantic zooplankton species — early signals of ecosystem reorganization as the fjords lose their seasonal ice cover.",
  },
];

export const expeditionById = (id?: string) => expeditions.find((e) => e.id === id);
