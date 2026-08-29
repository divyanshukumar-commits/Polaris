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
    objectives: [
      "Extract shallow and intermediate ice cores (up to 250m) along the Princess Elizabeth Land coastal margin.",
      "Service and calibrate 12 Automatic Weather Stations (AWS) across Schirmacher Oasis and Larsemann Hills.",
      "Deploy deep-sea moorings in Prydz Bay to monitor Circumpolar Deep Water (CDW) warm intrusions.",
      "Continuous atmospheric sampling of black carbon and aerosol optical depth under polar night conditions.",
    ],
    lead: "Dr. Thamban Meloth",
    leadRole: "Chief Scientist & Polar Paleoclimatologist (Director, NCPOR)",
    leadAvatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    leadAgency: "National Centre for Polar and Ocean Research (NCPOR), MoES",
    researchArea: "Glaciology, Paleoclimatology & Atmospheric Aerosols",
    plainSummary:
      "The 44th ISEA team is investigating how rapid atmospheric warming and shifting ocean currents affect East Antarctic ice sheets. Researchers are extracting ancient ice cores to reconstruct 50,000 years of climate history while maintaining real-time sensor networks across India's Maitri and Bharati bases. These field records feed directly into global climate models used to forecast sea-level rise.",
    team: 38,
    members: 38,
    startDate: "2025-11-02",
    endDate: "2026-03-28",
    startYear: 2025,
    endYear: 2026,
    status: "Active",
    stationRef: "Maitri & Bharati Bases",
    imageUrl:
      "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1200&q=80",
    imageSourceUrl: "https://unsplash.com/photos/3c6PswZ_Bc4",
    telemetryStatus: "12 of 12 stations transmitting live telemetry via satellite uplink",
    keyFindings: [
      "220-meter ice core successfully retrieved from coastal plateau with visible volcanic ash marker horizons.",
      "Atmospheric aerosol concentrations over Queen Maud Land remain at baseline pristine levels (0.02 AOD).",
      "Prydz Bay bottom water temperature measured at -1.82°C, within normal seasonal parameters.",
    ],
    gallery: [
      {
        id: "gal-01-1",
        url: "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=900&q=80",
        caption:
          "Field scientists assembling the electromechanical ice-core drill mast at Princess Elizabeth Land margin.",
        credit: "44th ISEA Glaciology Unit / NCPOR",
        creditUrl: "https://unsplash.com/photos/3c6PswZ_Bc4",
        tag: "Drilling Rig",
      },
      {
        id: "gal-01-2",
        url: "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=900&q=80",
        caption:
          "Aurora Australis lighting up the winter sky above the Bharati main station module.",
        credit: "Bharati Overwintering Team",
        creditUrl: "https://unsplash.com/photos/3EpXn5xwA7A",
        tag: "Station Operations",
      },
      {
        id: "gal-01-3",
        url: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=900&q=80",
        caption:
          "Glaciologist inspecting annual firn stratigraphy and density profiles in a clean snow pit.",
        credit: "EPICA-NCPOR Joint Lab",
        creditUrl: "https://unsplash.com/photos/AAuQscvR0Q4",
        tag: "Snow Physics",
      },
      {
        id: "gal-01-4",
        url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
        caption:
          "Satellite telemetry dish receiving X-band Earth observation SAR passes at Bharati base.",
        credit: "ISRO Ground Segment",
        creditUrl: "https://unsplash.com/photos/5F1Mlkd8t0I",
        tag: "Space Telemetry",
      },
    ],
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
    objectives: [
      "Quantify seasonal mass balance of the Kongsvegen and Midtre Lovénbreen glaciers using LiDAR drones.",
      "Continuous trace gas monitoring (methane and CO₂) from permafrost active layers.",
      "Monitor sea-ice coverage and Atlantic water inflow through the high-latitude Kongsfjorden system.",
    ],
    lead: "Dr. Rasik Ravindra",
    leadRole: "Lead Polar Geologist & Former Director, NCAOR",
    leadAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    leadAgency: "National Centre for Polar and Ocean Research (NCPOR)",
    researchArea: "Arctic Glaciology, Permafrost & Asian Monsoon Teleconnections",
    plainSummary:
      "Based at Himadri in Svalbard, this expedition tracks the accelerating thaw of Arctic glaciers and permafrost. By combining autonomous sensors and airborne surveys, researchers study how changing Arctic temperatures influence extreme weather and the Indian summer monsoon. The findings help improve long-range monsoon forecasting and climate risk resilience.",
    team: 14,
    members: 14,
    startDate: "2026-04-15",
    endDate: "2026-09-30",
    startYear: 2026,
    endYear: 2026,
    status: "Upcoming",
    stationRef: "Himadri Arctic Base",
    imageUrl:
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80",
    imageSourceUrl: "https://unsplash.com/photos/8hP-AA90k2Y",
    telemetryStatus: "Payload preparation underway at Tromsø logistics staging facility",
    keyFindings: [
      "Permafrost thaw depth reached a record 1.15m in late summer 2025 at Bayelva observation plot.",
      "Black carbon concentrations spike during springtime Arctic haze events sourced from mid-latitudes.",
    ],
    gallery: [
      {
        id: "gal-02-1",
        url: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=900&q=80",
        caption:
          "View of Ny-Ålesund research village with Mount Zeppelin and Kongsfjorden in the background.",
        credit: "NCPOR Arctic Archive",
        creditUrl: "https://unsplash.com/photos/8hP-AA90k2Y",
        tag: "Station View",
      },
      {
        id: "gal-02-2",
        url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=80",
        caption:
          "Glacier meltwater torrents carving supraglacial canyons into the blue ice of Kronebreen.",
        credit: "UNIS Glaciology Group",
        creditUrl: "https://unsplash.com/photos/2Xox-_fQr8k",
        tag: "Melt Dynamics",
      },
      {
        id: "gal-02-3",
        url: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=900&q=80",
        caption: "Polar bear family crossing fast-ice floes near the snout of Blomstrandbreen.",
        credit: "Norwegian Polar Institute",
        creditUrl: "https://unsplash.com/photos/3hN7zOJQzsE",
        tag: "Wildlife Survey",
      },
    ],
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
    objectives: [
      "Perform full-depth CTD and nutrient casts across 40 oceanographic stations.",
      "Deploy 6 autonomous biogeochemical Argo profiling floats in the southern gyre.",
      "Map benthic topography with multi-beam sonar to locate submarine troughs guiding warm water.",
    ],
    lead: "Dr. Anoop Mahajan",
    leadRole: "Senior Scientist & Marine Biogeochemist",
    leadAvatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    leadAgency: "NCPOR & Ministry of Earth Sciences (MoES)",
    researchArea: "Physical Oceanography & Sub-Ice Shelf Dynamics",
    plainSummary:
      "This marine campaign investigates warm deep ocean currents that seep under East Antarctica's massive Amery Ice Shelf. Oceanographers measure water salinity, temperature, and nutrients from research vessels to detect how quickly the bottom of the ice is melting. The resulting datasets are vital for predicting future Antarctic ice sheet collapse.",
    team: 22,
    members: 22,
    startDate: "2025-12-10",
    endDate: "2026-02-20",
    startYear: 2025,
    endYear: 2026,
    status: "Active",
    stationRef: "R/V SA Agulhas II / Bharati Offshore",
    imageUrl:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80",
    imageSourceUrl: "https://unsplash.com/photos/91n_a9B4mQk",
    telemetryStatus: "Moorings logging acoustic telemetry and current velocities continuously",
    keyFindings: [
      "Identified a 350m-deep submarine trench allowing modified Warm Deep Water to reach shelf grounding line.",
      "Phytoplankton bloom biomass is 20% higher along ice shelf calving edges due to iron enrichment.",
    ],
    gallery: [
      {
        id: "gal-03-1",
        url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80",
        caption:
          "Hydrographic winch lowering a 24-bottle CTD rosette into icy sub-zero Southern Ocean waters.",
        credit: "NCPOR Marine Technology Cell",
        creditUrl: "https://unsplash.com/photos/91n_a9B4mQk",
        tag: "Ocean Profiling",
      },
      {
        id: "gal-03-2",
        url: "https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=900&q=80",
        caption:
          "Towering 60m ice cliffs of the Amery Ice Shelf calving front viewed from the ship deck.",
        credit: "ISEA Marine Survey",
        creditUrl: "https://unsplash.com/photos/mkT7D4HeC8M",
        tag: "Ice Front",
      },
    ],
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
    objectives: [
      "Measure spectral albedo from 350 to 2500 nm using high-precision field spectroradiometers.",
      "Sample microalgae species diversity and biomass across western ablation zones.",
      "Correlate drone hyperspectral imaging with Sentinel-2 satellite albedo products.",
    ],
    lead: "Dr. Marie Larsen",
    leadRole: "Principal Investigator, Cryosphere Biology (GEUS / Indo-Danish Collab)",
    leadAvatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80",
    leadAgency: "GEUS & NCPOR International Partnership",
    researchArea: "Bio-Glaciology & Surface Energy Balance",
    plainSummary:
      "This study examines how microscopic algae and wind-blown dust darken the surface of the Greenland Ice Sheet. Darker ice absorbs more solar radiation, dramatically accelerating melt rates during the short polar summer. By mapping these biological blooms, researchers are calibrating regional climate models to more accurately forecast meltwater runoff.",
    team: 9,
    members: 9,
    startDate: "2025-06-01",
    endDate: "2025-08-25",
    startYear: 2025,
    endYear: 2025,
    status: "Completed",
    stationRef: "Summit & Kangerlussuaq Field Camps",
    imageUrl:
      "https://images.unsplash.com/photo-1516912481808-3406841bd33c?auto=format&fit=crop&w=1200&q=80",
    imageSourceUrl: "https://unsplash.com/photos/2Xox-_fQr8k",
    telemetryStatus: "Dataset verified and published to NPDC Open Data Repository",
    keyFindings: [
      "Glacier algae presence reduces bare ice albedo by up to 13%, increasing net melt energy by 28 W/m².",
      "Dust deposition events in early June primed the snowpack for accelerated mid-summer algae blooms.",
    ],
    gallery: [
      {
        id: "gal-04-1",
        url: "https://images.unsplash.com/photo-1516912481808-3406841bd33c?auto=format&fit=crop&w=900&q=80",
        caption: "Researcher measuring spectral reflectance over dark algae-colonized ice surface.",
        credit: "Indo-Danish Field Team",
        creditUrl: "https://unsplash.com/photos/2Xox-_fQr8k",
        tag: "Spectrometry",
      },
      {
        id: "gal-04-2",
        url: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=900&q=80",
        caption: "Deep blue supraglacial river flowing across the western Greenland ablation zone.",
        credit: "GEUS Cryo Science",
        creditUrl: "https://unsplash.com/photos/AAuQscvR0Q4",
        tag: "Hydrology",
      },
    ],
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
    objectives: [
      "Maintain 14 autonomous continuous GPS stations along the main rift margins.",
      "Deploy phase-sensitive radar (pRES) to measure annual basal melt rates.",
      "Integrate Sentinel-1 SAR interferometry for strain rate inversion modeling.",
    ],
    lead: "Dr. Sofia Andersson",
    leadRole: "Lead Glacial Dynamicist (British Antarctic Survey / NCPOR Guest Scientist)",
    leadAvatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
    leadAgency: "BAS & NCPOR Polar Observation Network",
    researchArea: "Ice Shelf Fracture Mechanics & Radar Glaciology",
    plainSummary:
      "Following the giant A-68 iceberg detachment, scientists tracked the stability of the remaining Larsen C Ice Shelf using precision GPS and radar. The team monitored how fractures grow and measured the thinning of the floating ice from beneath. Their measurements reveal how ice shelves act as protective buffers holding back upstream glaciers.",
    team: 11,
    members: 11,
    startDate: "2024-01-08",
    endDate: "2025-03-15",
    startYear: 2024,
    endYear: 2025,
    status: "Completed",
    stationRef: "Rothera & Larsen C Field Depots",
    imageUrl:
      "https://images.unsplash.com/photo-1482192505345-5655af888cc4?auto=format&fit=crop&w=1200&q=80",
    imageSourceUrl: "https://unsplash.com/photos/1Dk3p2LkK4E",
    telemetryStatus: "Completed mission; telemetry archived in Antarctic Data Centre",
    keyFindings: [
      "Remaining shelf is advancing at 620 m/year, 15% slower than pre-calving equilibrium.",
      "Basal melt rate near Bawden Ice Rise averages 2.8m/yr, concentrated in sub-shelf ocean channels.",
    ],
    gallery: [
      {
        id: "gal-05-1",
        url: "https://images.unsplash.com/photo-1482192505345-5655af888cc4?auto=format&fit=crop&w=900&q=80",
        caption:
          "Airborne radar survey aircraft banking over a 50-meter deep structural rift in Larsen C.",
        credit: "BAS Air Survey / NCPOR",
        creditUrl: "https://unsplash.com/photos/1Dk3p2LkK4E",
        tag: "Aerial Radar",
      },
    ],
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
    objectives: [
      "Deploy 24 Ice-Tethered Profilers (ITP) and ice mass balance buoys across the Beaufort Gyre.",
      "Measure upper ocean heat content changes beneath first-year and multi-year pack ice.",
      "Relay real-time ice drift vectors to Arctic maritime navigation networks.",
    ],
    lead: "Dr. James Kalluk",
    leadRole: "Senior Arctic Oceanographer & Sea-Ice Specialist",
    leadAvatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80",
    leadAgency: "International Arctic Buoy Programme (IABP) / MoES",
    researchArea: "Sea-Ice Physics & Autonomous Sensor Networks",
    plainSummary:
      "This expedition deployed an array of robotic floating buoys that freeze directly into Arctic sea ice. As the ice drifts across the ocean, the sensors measure changing ice thickness, drift speed, and water temperatures below. The real-time data helps shipping vessels navigate safely while tracking how rapidly multi-year ice is disappearing.",
    team: 7,
    members: 7,
    startDate: "2025-09-12",
    endDate: "2026-05-30",
    startYear: 2025,
    endYear: 2026,
    status: "Active",
    stationRef: "CCGS Louis S. St-Laurent / Beaufort Array",
    imageUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    imageSourceUrl: "https://unsplash.com/photos/5F1Mlkd8t0I",
    telemetryStatus:
      "21 of 24 buoys actively transmitting telemetry via Iridium satellite constellation",
    keyFindings: [
      "Multi-year ice thickness in the western Beaufort Sea averaged just 1.4m, the lowest on record.",
      "Pacific Summer Water heat anomaly detected at 65m depth, slowing winter freeze-up rates.",
    ],
    gallery: [
      {
        id: "gal-06-1",
        url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
        caption:
          "Field engineer securing an Iridium satellite antenna on an Ice-Tethered Profiler mast.",
        credit: "IABP Field Tech Cell",
        creditUrl: "https://unsplash.com/photos/5F1Mlkd8t0I",
        tag: "Sensor Deployment",
      },
    ],
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
    objectives: [
      "Extract sediment cores from Lake Priyadarshini and Zub Lake to study Holocene environmental change.",
      "High-precision radiometric dating of charnockitic and enderbitic basement rocks.",
      "Water quality and microbial biodiversity profiling across 30 landlocked oasis water bodies.",
    ],
    lead: "Dr. M. J. Beg",
    leadRole: "Veteran Antarctic Geologist & Head, Antarctic Logistics (NCPOR)",
    leadAvatar:
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80",
    leadAgency: "Geological Survey of India (GSI) & NCPOR",
    researchArea: "Precambrian Geology, Limnology & Gondwana Supercontinent Reconstruction",
    plainSummary:
      "This overland science traverse explores the ice-free oasis near India's Maitri station in East Antarctica. Scientists sample lake bottom sediments to understand past centuries of environmental change and study ancient rock formations. The rock samples help prove how India, Antarctica, and Australia were connected millions of years ago in the Gondwana supercontinent.",
    team: 12,
    members: 12,
    startDate: "2026-11-20",
    endDate: "2027-02-10",
    startYear: 2026,
    endYear: 2027,
    status: "Upcoming",
    stationRef: "Maitri Base Traverse Camp",
    imageUrl:
      "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=1200&q=80",
    imageSourceUrl: "https://unsplash.com/photos/3EpXn5xwA7A",
    telemetryStatus: "Logistical route planning and tracked snowcat preparation completed",
    keyFindings: [
      "Previous sediment cores demonstrate ice-free oasis conditions persisted for at least 8,500 years.",
      "Basement granulites share identical 1.0 Ga metamorphic ages with rocks in India's Eastern Ghats.",
    ],
    gallery: [
      {
        id: "gal-07-1",
        url: "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=900&q=80",
        caption:
          "Overland PistenBully traverse convoy setting out across the polar ice cap toward Schirmacher Oasis.",
        credit: "NCPOR Antarctic Logistics Cell",
        creditUrl: "https://unsplash.com/photos/3EpXn5xwA7A",
        tag: "Traverse",
      },
    ],
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
    objectives: [
      "Perform weekly bio-optical and zooplankton net tows through spring and summer seasons.",
      "Track acoustic signatures of Atlantic cod and polar cod competition using echosounders.",
      "Analyze environmental DNA (eDNA) to detect range expansion of boreal marine species.",
    ],
    lead: "Dr. Geeta Nair",
    leadRole: "Lead Polar Marine Ecologist & Senior Researcher (NCPOR)",
    leadAvatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
    leadAgency: "National Centre for Polar and Ocean Research (NCPOR)",
    researchArea: "Marine Ecology, Zooplankton Phenology & Atlantification",
    plainSummary:
      "This marine ecology mission tracks how warmer Atlantic waters flowing into Arctic fjords alter polar marine life. Scientists collect plankton, fish samples, and water DNA to understand how native Arctic species compete with incoming Atlantic fish. The insights reveal how Arctic ecosystems adapt as sea ice diminishes.",
    team: 16,
    members: 16,
    startDate: "2024-05-05",
    endDate: "2024-10-01",
    startYear: 2024,
    endYear: 2024,
    status: "Completed",
    stationRef: "Himadri Marine Lab & Teisten Vessel",
    imageUrl:
      "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1200&q=80",
    imageSourceUrl: "https://unsplash.com/photos/3hN7zOJQzsE",
    telemetryStatus: "Completed project; eDNA and acoustic databases deposited into NPDC",
    keyFindings: [
      "Documented 30% increase in Atlantic copepod (Calanus finmarchicus) relative to Arctic species.",
      "Phytoplankton spring bloom occurred 14 days earlier than the 10-year historical baseline.",
    ],
    gallery: [
      {
        id: "gal-08-1",
        url: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=900&q=80",
        caption:
          "Marine biologist sorting zooplankton net samples under stereo microscope at Himadri marine lab.",
        credit: "NCPOR Arctic Biology Unit",
        creditUrl: "https://unsplash.com/photos/3hN7zOJQzsE",
        tag: "Plankton Ecology",
      },
      {
        id: "gal-08-2",
        url: "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=900&q=80",
        caption:
          "Research vessel Teisten taking water column CTD casts near the snout of Kongsbreen.",
        credit: "Kings Bay Marine Operations",
        creditUrl: "https://unsplash.com/photos/3c6PswZ_Bc4",
        tag: "Fjord Transect",
      },
    ],
    description:
      "Monthly fjord transects through a full melt season documented an earlier phytoplankton bloom and a northward shift of Atlantic zooplankton species — early signals of ecosystem reorganization as the fjords lose their seasonal ice cover.",
  },
];

export const expeditionById = (id?: string) => expeditions.find((e) => e.id === id);
