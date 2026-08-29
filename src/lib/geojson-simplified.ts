// Simplified world topology data for globe rendering
// Contains continent outlines and major geographic features
export const worldGeoData = {
  continents: [
    // North America
    {
      name: "North America",
      points: [
        [-125, 49],
        [-125, 25],
        [-80, 25],
        [-80, 49],
        [-125, 49],
      ],
    },
    // South America
    {
      name: "South America",
      points: [
        [-82, 12],
        [-82, -56],
        [-34, -56],
        [-34, 12],
        [-82, 12],
      ],
    },
    // Europe
    {
      name: "Europe",
      points: [
        [-10, 36],
        [-10, 71],
        [40, 71],
        [40, 36],
        [-10, 36],
      ],
    },
    // Africa
    {
      name: "Africa",
      points: [
        [-20, 37],
        [-20, -35],
        [55, -35],
        [55, 37],
        [-20, 37],
      ],
    },
    // Asia
    {
      name: "Asia",
      points: [
        [26, 71],
        [26, -10],
        [160, -10],
        [160, 71],
        [26, 71],
      ],
    },
    // Australia
    {
      name: "Australia",
      points: [
        [113, -10],
        [113, -44],
        [154, -44],
        [154, -10],
        [113, -10],
      ],
    },
    // Antarctica (top)
    {
      name: "Antarctica",
      points: [
        [-180, -60],
        [-180, -90],
        [180, -90],
        [180, -60],
        [-180, -60],
      ],
    },
    // Greenland
    {
      name: "Greenland",
      points: [
        [-73, 60],
        [-73, 83],
        [-11, 83],
        [-11, 60],
        [-73, 60],
      ],
    },
  ],
  // Major cities for hover detection
  cities: [
    { name: "New York", lat: 40.7128, lon: -74.006 },
    { name: "London", lat: 51.5074, lon: -0.1278 },
    { name: "Tokyo", lat: 35.6762, lon: 139.6503 },
    { name: "Sydney", lat: -33.8688, lon: 151.2093 },
    { name: "Dubai", lat: 25.2048, lon: 55.2708 },
    { name: "Mumbai", lat: 19.076, lon: 72.8855 },
  ],
  // Polar regions for highlighting
  polarRegions: [
    {
      name: "Arctic Circle",
      center: { lat: 66.56, lon: 0 },
      radius: 15,
    },
    {
      name: "Antarctic Circle",
      center: { lat: -66.56, lon: 0 },
      radius: 15,
    },
  ],
};

// Convert lat/lon to 3D coordinates on unit sphere
export function latLonToVec3(lat: number, lon: number): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return [Math.sin(phi) * Math.cos(theta), Math.cos(phi), Math.sin(phi) * Math.sin(theta)];
}

// Calculate distance between two points on sphere (in radians)
export function sphericalDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a = Math.sin((φ2 - φ1) / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  return 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
