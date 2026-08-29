import type { TimelinePeriod } from "./types";

export const timelinePeriods: TimelinePeriod[] = [
  {
    id: "p-1900",
    label: "1900–1920",
    range: [1900, 1919],
    title: "The Heroic Age of Antarctic Exploration",
    summary:
      "The race to the poles defined this era. Amundsen reached the South Pole in 1911, Scott's Terra Nova expedition followed weeks later, and Shackleton's Endurance survival epic became legend — while scientists collected the first systematic polar observations.",
    imageUrl: "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=800&q=80",
    imageSourceUrl: "https://unsplash.com/photos/3c6PswZ_Bc4",
    events: [
      {
        year: 1902,
        text: "Scott's Discovery expedition establishes the first Antarctic research huts.",
      },
      { year: 1909, text: "Peary claims the North Pole; Shackleton reaches 88°23′S." },
      { year: 1911, text: "Roald Amundsen's team reaches the South Pole on 14 December." },
      {
        year: 1912,
        text: "Scott's polar party perishes on the return; their meteorological logbooks survive.",
      },
      { year: 1915, text: "Shackleton's Endurance is crushed by pack ice — all 28 men survive." },
    ],
  },
  {
    id: "p-1920",
    label: "1920–1940",
    range: [1920, 1939],
    title: "The Mechanical Age Reaches the Ice",
    summary:
      "Aircraft and radio transformed polar work. Byrd flew over both poles, the first systematic whale and ocean surveys began, and nations started viewing the poles through a scientific — not just exploratory — lens.",
    imageUrl: "https://images.unsplash.com/photo-1482192505345-5655af888cc4?auto=format&fit=crop&w=800&q=80",
    imageSourceUrl: "https://unsplash.com/photos/3fD4rWj2gkQ",
    events: [
      { year: 1926, text: "Amundsen and Ellsworth cross the Arctic by airship Norge." },
      { year: 1929, text: "Richard Byrd makes the first flight over the South Pole." },
      { year: 1931, text: "The first International Polar Year follow-up studies begin." },
      { year: 1935, text: "Caroline Mikkelsen becomes the first woman to set foot on Antarctica." },
    ],
  },
  {
    id: "p-1940",
    label: "1940–1960",
    range: [1940, 1959],
    title: "Science Goes Global: The IGY and the Treaty",
    summary:
      "The International Geophysical Year (1957–58) united 67 nations in coordinated polar science, establishing permanent stations across Antarctica. It culminated in the 1959 Antarctic Treaty — reserving an entire continent for peace and science.",
    imageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
    imageSourceUrl: "https://unsplash.com/photos/5F1Mlkd8t0I",
    events: [
      { year: 1947, text: "Operation Highjump conducts the largest Antarctic survey to date." },
      { year: 1957, text: "IGY begins: 12 nations build 55 Antarctic stations in 18 months." },
      { year: 1958, text: "Fuchs and Hillary complete the first overland crossing of Antarctica." },
      { year: 1959, text: "The Antarctic Treaty is signed in Washington." },
    ],
  },
  {
    id: "p-1960",
    label: "1960–1980",
    range: [1960, 1979],
    title: "Deep Ice and Deep Time",
    summary:
      "Ice-core drilling at Byrd and Vostok opened the archive of past atmospheres. Plate tectonics explained Gondwana, satellites began watching sea ice, and the first hints of human impacts on polar chemistry emerged.",
    imageUrl: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=800&q=80",
    imageSourceUrl: "https://unsplash.com/photos/AAuQscvR0Q4",
    events: [
      { year: 1966, text: "First deep ice core through the Greenland ice sheet at Camp Century." },
      {
        year: 1968,
        text: "Byrd Station core reaches bedrock at 2,164 m — 100,000 years of climate.",
      },
      { year: 1972, text: "Landsat begins continuous satellite imaging of the polar regions." },
      {
        year: 1979,
        text: "Continuous satellite sea-ice record begins — the baseline for all modern studies.",
      },
    ],
  },
  {
    id: "p-1980",
    label: "1980–2000",
    range: [1980, 1999],
    title: "India Joins the Ice; The Ozone Alarm",
    summary:
      "India's first Antarctic expedition in 1981 led to Dakshin Gangotri (1983) and Maitri (1989). The discovery of the ozone hole shocked the world and drove the Montreal Protocol — proof that polar science changes global policy.",
    imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80",
    imageSourceUrl: "https://unsplash.com/photos/8hP-AA90k2Y",
    events: [
      {
        year: 1981,
        text: "India's first Antarctic expedition sails from Goa under Dr. S. Z. Qasim.",
      },
      {
        year: 1983,
        text: "Dakshin Gangotri station commissioned; India joins the Antarctic Treaty.",
      },
      { year: 1985, text: "British Antarctic Survey announces the discovery of the ozone hole." },
      { year: 1989, text: "India's Maitri station opens in the Schirmacher Oasis." },
      {
        year: 1998,
        text: "NCPOR (then NCAOR) is established in Goa to lead Indian polar research.",
      },
    ],
  },
  {
    id: "p-2000",
    label: "2000–2020",
    range: [2000, 2019],
    title: "The Satellite Revolution and a Warming Signal",
    summary:
      "GRACE, CryoSat-2 and ICESat began weighing and measuring the ice sheets from orbit. India expanded to Bharati station (2012) and Himadri in the Arctic (2008), while record Arctic sea-ice lows made polar change front-page news.",
    imageUrl: "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=800&q=80",
    imageSourceUrl: "https://unsplash.com/photos/3EpXn5xwA7A",
    events: [
      {
        year: 2002,
        text: "GRACE satellites begin tracking ice-sheet mass from orbit; Larsen B ice shelf collapses.",
      },
      { year: 2008, text: "India's Himadri station opens at Ny-Ålesund, Svalbard." },
      {
        year: 2012,
        text: "Bharati becomes India's third Antarctic station; Arctic sea ice hits record low.",
      },
      {
        year: 2014,
        text: "IndARC India's first underwater Arctic mooring deployed at Kongsfjorden.",
      },
      { year: 2019, text: "NPDC launches as India's national polar data repository." },
    ],
  },
  {
    id: "p-2020",
    label: "2020–2026",
    range: [2020, 2026],
    title: "The Integrated Polar Decade",
    summary:
      "Polar science is now connected, open and AI-assisted. Record-low Antarctic sea ice, Aditya-L1 space-weather monitoring, VEDAS open data platforms and portals like POLARIS link research, expeditions, media and education into one ecosystem.",
    imageUrl: "https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=800&q=80",
    imageSourceUrl: "https://unsplash.com/photos/mkT7D4HeC8M",
    events: [
      {
        year: 2023,
        text: "Antarctic winter sea ice hits its lowest extent in the satellite record.",
      },
      {
        year: 2023,
        text: "ISRO's Aditya-L1 begins solar wind monitoring for polar space weather.",
      },
      { year: 2025, text: "44th Indian Antarctic Expedition deploys year-round ocean moorings." },
      {
        year: 2026,
        text: "POLARIS launches as an integrated polar knowledge and outreach platform.",
      },
    ],
  },
];
