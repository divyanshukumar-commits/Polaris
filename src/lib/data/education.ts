import type { EducationTopic, QuizQuestion } from "./types";

export const educationTopics: EducationTopic[] = [
  {
    id: "edu-01",
    title: "Why is Antarctica important?",
    icon: "Globe2",
    region: "Antarctic",
    topic: "Climate",
    simple:
      "Antarctica is like Earth's freezer and thermostat. Its massive ice sheet holds about 60% of all fresh water on the planet, and its bright white surface reflects sunlight back to space, helping keep the whole planet cool. What happens there affects sea levels and weather everywhere — including the Indian monsoon.",
    scientific:
      "The Antarctic Ice Sheet stores ~26.5 million km³ of ice, equivalent to ~58 m of global sea-level rise. Its high albedo and the surrounding Southern Ocean regulate planetary heat distribution and drive the global thermohaline circulation. Antarctic Bottom Water formation ventilates the deep ocean, sequestering heat and carbon on centennial timescales.",
    facts: [
      "Antarctica holds ~90% of the world's ice and ~60% of its fresh water.",
      "The coldest temperature ever recorded on Earth was −89.2 °C at Vostok Station.",
      "The Southern Ocean absorbs ~40% of human-produced CO₂ taken up by oceans.",
      "If all Antarctic ice melted, sea level would rise by about 58 metres.",
    ],
    relatedResearchIds: ["res-001", "res-004"],
  },
  {
    id: "edu-02",
    title: "How do ice sheets change?",
    icon: "MountainSnow",
    region: "Antarctic",
    topic: "Glaciology",
    simple:
      "Ice sheets grow when more snow falls than melts, and shrink when melting and iceberg calving outpace snowfall. Scientists weigh them from space, measure their height with lasers and radar, and drill ice cores to read their history — like tree rings, but for climate.",
    scientific:
      "Ice-sheet mass balance is the difference between accumulation (snowfall) and ablation (surface melt, sublimation, basal melt and iceberg calving). Satellite gravimetry (GRACE-FO), altimetry (ICESat-2, CryoSat-2) and interferometric SAR track changes at monthly resolution, while ice-flow models project future behaviour under emission scenarios.",
    facts: [
      "Antarctica lost ~2,700 billion tonnes of ice between 2002 and 2024.",
      "Ice sheets flow like very slow rivers — a few metres to kilometres per year.",
      "Ice cores preserve air bubbles up to 800,000 years old.",
      "Satellites can detect ice-sheet weight changes equivalent to a few cm of water.",
    ],
    relatedResearchIds: ["res-001", "res-007"],
  },
  {
    id: "edu-03",
    title: "What causes sea-level rise?",
    icon: "Waves",
    region: "Antarctic",
    topic: "Oceanography",
    simple:
      "Sea levels rise for two main reasons: warmer ocean water expands, and melting land ice adds new water to the ocean. Melting floating sea ice doesn't raise sea level — just like ice melting in a full glass — but melting glaciers and ice sheets on land do.",
    scientific:
      "Global mean sea-level rise (~4.5 mm/yr currently) is driven by thermal expansion of warming ocean water and mass input from land ice — glaciers, Greenland and Antarctica. Melting floating ice shelves contributes indirectly by removing buttressing that restrains land-ice discharge. Regional patterns are modified by gravity, rotation and ocean dynamics.",
    facts: [
      "Global sea level has risen ~21–24 cm since 1900, and the rate is accelerating.",
      "Thermal expansion accounts for roughly 40% of current rise.",
      "Thwaites Glacier alone holds enough ice to raise seas by ~65 cm.",
      "Every centimetre of rise exposes ~6 million more people to coastal flooding.",
    ],
    relatedResearchIds: ["res-001", "res-004"],
  },
  {
    id: "edu-04",
    title: "How do satellites monitor polar regions?",
    icon: "Satellite",
    region: "Arctic",
    topic: "Space & Satellite",
    simple:
      "Satellites are the polar regions' watchful eyes. They measure ice thickness with radar, weigh ice sheets by sensing gravity, photograph penguin colonies, and track sea ice every single day — even through the dark polar winter. India's VEDAS platform lets anyone explore this data.",
    scientific:
      "Polar-orbiting satellites carry radar and laser altimeters (CryoSat-2, ICESat-2, AltiKa), gravimeters (GRACE-FO), scatterometers and multispectral imagers. Radar penetrates clouds and darkness, enabling year-round observation. ISRO's VEDAS platform curates these products for visualization, while NPDC archives expedition-validated datasets.",
    facts: [
      "CryoSat-2 measures ice thickness to within centimetres from 700 km up.",
      "GRACE-FO 'weighs' ice sheets by measuring tiny gravity changes.",
      "Satellites first spotted emperor penguin colonies by their guano stains.",
      "Polar orbits pass over the poles ~14 times per day.",
    ],
    relatedResearchIds: ["res-005", "res-020"],
  },
  {
    id: "edu-05",
    title: "What happens beneath Antarctic ice?",
    icon: "Layers",
    region: "Antarctic",
    topic: "Glaciology",
    simple:
      "Hidden under kilometres of ice is a secret world: mountain ranges, rivers and over 400 lakes sealed off for millions of years. Water at the base acts like a lubricant that can speed up glaciers, so scientists map this hidden plumbing with radar to predict how fast ice reaches the sea.",
    scientific:
      "The subglacial environment hosts hydrological networks of lakes, channels and saturated sediments. Basal water modulates friction at the ice-bed interface, controlling sliding velocity. Over 400 subglacial lakes — including Lake Vostok — harbour isolated ecosystems and preserve records of pre-glacial climates.",
    facts: [
      "Lake Vostok has been isolated under 4 km of ice for ~15 million years.",
      "Subglacial floods can temporarily speed glaciers by over 10%.",
      "Radar surveys revealed mountain ranges as tall as the Alps under the ice.",
      "Some subglacial lakes exchange water every few years.",
    ],
    relatedResearchIds: ["res-007"],
  },
  {
    id: "edu-06",
    title: "Why is Arctic sea ice important?",
    icon: "Snowflake",
    region: "Arctic",
    topic: "Climate",
    simple:
      "Arctic sea ice is a giant mirror and a global air conditioner. It reflects sunlight, keeps the Arctic cold, and drives ocean currents. It's also a hunting platform for polar bears and a highway for Arctic communities. As it shrinks, the whole planet feels the change — even India's monsoon.",
    scientific:
      "Sea ice regulates planetary albedo, insulates the ocean from the atmosphere, and drives brine rejection that powers deep-water formation. Its decline amplifies Arctic warming (Arctic amplification, ~3.8× global rate), weakens meridional temperature gradients, and is linked to jet-stream meanders affecting mid-latitude and monsoon weather.",
    facts: [
      "September Arctic sea ice has shrunk ~40% since satellite records began in 1979.",
      "The Arctic is warming nearly 4× faster than the global average.",
      "Multi-year ice older than 4 years has declined by over 90%.",
      "Low sea-ice years correlate with weaker Indian monsoon rainfall.",
    ],
    relatedResearchIds: ["res-012", "res-005"],
  },
  {
    id: "edu-07",
    title: "Who lives at the poles?",
    icon: "Bird",
    region: "Antarctic",
    topic: "Wildlife",
    simple:
      "The poles host incredible wildlife built for the cold: penguins and seals in Antarctica, polar bears and walrus in the Arctic. Tiny krill power the whole Southern Ocean food web. And yes — penguins and polar bears never meet; they live at opposite ends of the Earth!",
    scientific:
      "Polar ecosystems are structured by extreme seasonality and ice dynamics. Antarctic krill (Euphausia superba, biomass ~300–500 Mt) underpins Southern Ocean food webs. Arctic systems couple ice-associated algae to fish, marine mammals and ~4 million human residents, including Indigenous communities with millennia of polar knowledge.",
    facts: [
      "Antarctic krill swarms can be seen from space.",
      "Polar bears are marine mammals — they depend on sea ice to hunt.",
      "Eight penguin species breed in Antarctica; none live in the Arctic.",
      "About 4 million people live in the Arctic; Antarctica has only researchers.",
    ],
    relatedResearchIds: ["res-006", "res-019"],
  },
  {
    id: "edu-08",
    title: "What are auroras?",
    icon: "Sparkles",
    region: "Arctic",
    topic: "Space & Satellite",
    simple:
      "Auroras are nature's greatest light show. Charged particles from the Sun ride the solar wind to Earth, get funnelled by our magnetic field toward the poles, and crash into the atmosphere — making oxygen glow green and red, and nitrogen glow purple and blue.",
    scientific:
      "Auroras result from magnetospheric precipitation of energetic electrons and protons along open and closed field lines into the upper atmosphere (100–300 km). Collisional excitation of atomic oxygen (557.7 nm green, 630 nm red) and molecular nitrogen produces characteristic emissions. India's Aditya-L1 mission monitors the solar wind drivers of these events.",
    facts: [
      "Auroras occur in both hemispheres — borealis (north) and australis (south).",
      "The most common aurora colour, green, comes from oxygen at ~100–150 km.",
      "Strong geomagnetic storms can push auroras to mid-latitudes.",
      "Aditya-L1 watches the Sun to help forecast aurora-driving space weather.",
    ],
    relatedResearchIds: ["res-015"],
  },
];

export const quizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    question: "Which region contains the geographic South Pole?",
    options: ["Arctic", "Antarctica", "Greenland", "Siberia"],
    answer: 1,
    explanation:
      "The South Pole sits on the Antarctic continent at 90°S, atop a ~2,800 m thick ice sheet.",
  },
  {
    id: "q2",
    question: "Approximately how much of Earth's fresh water is stored in Antarctica?",
    options: ["10%", "30%", "60%", "90%"],
    answer: 2,
    explanation:
      "Antarctica's ice sheet holds about 60% of the planet's fresh water — roughly 26.5 million km³ of ice.",
  },
  {
    id: "q3",
    question: "Melting which of these raises global sea level?",
    options: [
      "Floating sea ice",
      "Icebergs already in the ocean",
      "Glaciers and ice sheets on land",
      "Sea ice in the Arctic",
    ],
    answer: 2,
    explanation:
      "Floating ice already displaces its mass of water. Only ice moving from land into the ocean adds new water and raises sea level.",
  },
  {
    id: "q4",
    question: "What is the name of India's research station in the Arctic?",
    options: ["Maitri", "Bharati", "Himadri", "Dakshin Gangotri"],
    answer: 2,
    explanation:
      "Himadri, at Ny-Ålesund in Svalbard, has been India's Arctic research base since 2008. Maitri and Bharati are in Antarctica.",
  },
  {
    id: "q5",
    question: "Which tiny crustacean powers the Southern Ocean food web?",
    options: ["Copepods", "Antarctic krill", "Amphipods", "Squid larvae"],
    answer: 1,
    explanation:
      "Antarctic krill, with a biomass of hundreds of millions of tonnes, sustains whales, seals, penguins and fish.",
  },
  {
    id: "q6",
    question: "Why is the Arctic warming faster than the rest of the planet?",
    options: [
      "More volcanoes in the Arctic",
      "Loss of reflective sea ice amplifies warming",
      "The Arctic is closer to the Sun",
      "Ocean currents stopped completely",
    ],
    answer: 1,
    explanation:
      "As bright sea ice melts, darker ocean absorbs more sunlight — a feedback called Arctic amplification, warming the region ~3.8× faster.",
  },
  {
    id: "q7",
    question: "Which satellite mission 'weighs' ice sheets by measuring gravity?",
    options: ["Hubble", "GRACE-FO", "Chandrayaan-3", "Landsat"],
    answer: 1,
    explanation:
      "GRACE-FO's twin satellites detect tiny changes in Earth's gravity caused by ice mass loss — effectively weighing the ice sheets from orbit.",
  },
  {
    id: "q8",
    question: "What gives most auroras their green colour?",
    options: ["Nitrogen", "Oxygen", "Hydrogen", "Carbon dioxide"],
    answer: 1,
    explanation:
      "Excited oxygen atoms at 100–150 km altitude emit the characteristic green light at 557.7 nm.",
  },
  {
    id: "q9",
    question: "In which year did India launch its first Antarctic expedition?",
    options: ["1957", "1971", "1981", "2001"],
    answer: 2,
    explanation:
      "India's first Antarctic expedition sailed in 1981, leading to the Dakshin Gangotri station in 1983 and Treaty membership.",
  },
  {
    id: "q10",
    question: "Where would penguins and polar bears meet in the wild?",
    options: ["Antarctica", "The Arctic", "Greenland", "Nowhere — opposite poles"],
    answer: 3,
    explanation:
      "Penguins live only in the Southern Hemisphere and polar bears only in the Arctic — they never meet in the wild.",
  },
];
