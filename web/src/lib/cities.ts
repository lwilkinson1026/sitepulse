// Annual-average peak sun hours (kWh/m²/day) by city. These are planning
// approximations drawn from typical NREL/PVWatts annual figures — good enough
// for a sizing estimate, and every value still flows through the system derate.
export type City = {
  name: string;
  state: string;
  sun: number;
  featured?: boolean;
};

export const CITIES: ReadonlyArray<City> = [
  // Inland Northwest / North Idaho (home turf)
  { name: "Coeur d'Alene", state: "ID", sun: 4.3, featured: true },
  { name: "Post Falls", state: "ID", sun: 4.3 },
  { name: "Sandpoint", state: "ID", sun: 4.0 },
  { name: "Bonners Ferry", state: "ID", sun: 3.9 },
  { name: "Moscow", state: "ID", sun: 4.3 },
  { name: "Lewiston", state: "ID", sun: 4.4 },
  { name: "Spokane", state: "WA", sun: 4.4, featured: true },
  { name: "Pullman", state: "WA", sun: 4.3 },

  // Idaho
  { name: "Boise", state: "ID", sun: 5.0, featured: true },
  { name: "Nampa", state: "ID", sun: 5.0 },
  { name: "Twin Falls", state: "ID", sun: 4.9 },
  { name: "Idaho Falls", state: "ID", sun: 4.8 },
  { name: "Pocatello", state: "ID", sun: 5.0 },
  { name: "Sun Valley", state: "ID", sun: 4.9 },

  // Washington
  { name: "Yakima", state: "WA", sun: 4.8, featured: true },
  { name: "Wenatchee", state: "WA", sun: 4.5 },
  { name: "Walla Walla", state: "WA", sun: 4.6 },
  { name: "Kennewick", state: "WA", sun: 4.8 },
  { name: "Seattle", state: "WA", sun: 3.6, featured: true },
  { name: "Tacoma", state: "WA", sun: 3.6 },
  { name: "Bellingham", state: "WA", sun: 3.5 },
  { name: "Olympia", state: "WA", sun: 3.6 },

  // Oregon
  { name: "Portland", state: "OR", sun: 3.9, featured: true },
  { name: "Bend", state: "OR", sun: 4.8 },
  { name: "Eugene", state: "OR", sun: 3.9 },
  { name: "Medford", state: "OR", sun: 4.6 },
  { name: "Klamath Falls", state: "OR", sun: 4.9 },
  { name: "Pendleton", state: "OR", sun: 4.5 },

  // Montana
  { name: "Bozeman", state: "MT", sun: 4.6, featured: true },
  { name: "Missoula", state: "MT", sun: 4.2 },
  { name: "Kalispell", state: "MT", sun: 4.1 },
  { name: "Helena", state: "MT", sun: 4.5 },
  { name: "Billings", state: "MT", sun: 4.7 },
  { name: "Great Falls", state: "MT", sun: 4.6 },

  // Wyoming
  { name: "Cheyenne", state: "WY", sun: 5.4 },
  { name: "Casper", state: "WY", sun: 5.2 },
  { name: "Jackson", state: "WY", sun: 4.6 },

  // Colorado
  { name: "Denver", state: "CO", sun: 5.5, featured: true },
  { name: "Colorado Springs", state: "CO", sun: 5.5 },
  { name: "Grand Junction", state: "CO", sun: 5.4 },
  { name: "Durango", state: "CO", sun: 5.6 },
  { name: "Fort Collins", state: "CO", sun: 5.3 },

  // Utah
  { name: "Salt Lake City", state: "UT", sun: 5.3 },
  { name: "Provo", state: "UT", sun: 5.2 },
  { name: "Moab", state: "UT", sun: 5.6 },
  { name: "St. George", state: "UT", sun: 6.0 },

  // Nevada
  { name: "Reno", state: "NV", sun: 5.8 },
  { name: "Elko", state: "NV", sun: 5.3 },
  { name: "Las Vegas", state: "NV", sun: 6.4, featured: true },

  // Arizona
  { name: "Phoenix", state: "AZ", sun: 6.5, featured: true },
  { name: "Tucson", state: "AZ", sun: 6.6 },
  { name: "Prescott", state: "AZ", sun: 6.2 },
  { name: "Flagstaff", state: "AZ", sun: 5.9 },

  // New Mexico
  { name: "Albuquerque", state: "NM", sun: 6.4 },
  { name: "Santa Fe", state: "NM", sun: 6.2 },
  { name: "Las Cruces", state: "NM", sun: 6.5 },

  // California
  { name: "Los Angeles", state: "CA", sun: 5.6 },
  { name: "San Diego", state: "CA", sun: 5.7 },
  { name: "San Francisco", state: "CA", sun: 5.0 },
  { name: "Sacramento", state: "CA", sun: 5.5 },
  { name: "Fresno", state: "CA", sun: 5.6 },
  { name: "Bakersfield", state: "CA", sun: 5.7 },
  { name: "Redding", state: "CA", sun: 5.3 },

  // Texas
  { name: "Austin", state: "TX", sun: 5.2 },
  { name: "Dallas", state: "TX", sun: 5.3 },
  { name: "San Antonio", state: "TX", sun: 5.3 },
  { name: "Houston", state: "TX", sun: 4.8 },
  { name: "El Paso", state: "TX", sun: 6.4 },
  { name: "Lubbock", state: "TX", sun: 5.8 },

  // Plains & Midwest
  { name: "Rapid City", state: "SD", sun: 4.8 },
  { name: "Bismarck", state: "ND", sun: 4.6 },
  { name: "Omaha", state: "NE", sun: 4.7 },
  { name: "Kansas City", state: "MO", sun: 4.8 },
  { name: "Oklahoma City", state: "OK", sun: 5.2 },
  { name: "Des Moines", state: "IA", sun: 4.5 },
  { name: "Minneapolis", state: "MN", sun: 4.5 },
  { name: "Chicago", state: "IL", sun: 4.2 },

  // Southeast
  { name: "Atlanta", state: "GA", sun: 4.7 },
  { name: "Nashville", state: "TN", sun: 4.5 },
  { name: "Charlotte", state: "NC", sun: 4.7 },
  { name: "Asheville", state: "NC", sun: 4.5 },
  { name: "Raleigh", state: "NC", sun: 4.6 },
  { name: "Orlando", state: "FL", sun: 5.2 },
  { name: "Miami", state: "FL", sun: 5.2 },
  { name: "Richmond", state: "VA", sun: 4.5 },

  // Northeast
  { name: "Boston", state: "MA", sun: 4.2 },
  { name: "New York", state: "NY", sun: 4.2 },
  { name: "Philadelphia", state: "PA", sun: 4.3 },
  { name: "Pittsburgh", state: "PA", sun: 3.9 },
  { name: "Portland", state: "ME", sun: 4.3 },
  { name: "Burlington", state: "VT", sun: 4.0 },

  // Alaska
  { name: "Anchorage", state: "AK", sun: 3.0 },
  { name: "Fairbanks", state: "AK", sun: 3.0 },
];

export function cityLabel(c: City): string {
  return `${c.name}, ${c.state}`;
}

// Filter cities by a free-text query. Empty query returns the featured set so
// focusing the field immediately shows useful suggestions.
export function searchCities(query: string, limit = 8): City[] {
  const q = query.trim().toLowerCase();
  if (!q) {
    const featured = CITIES.filter((c) => c.featured);
    return (featured.length ? featured : CITIES).slice(0, limit);
  }
  return CITIES.filter((c) =>
    cityLabel(c).toLowerCase().includes(q) ||
    c.name.toLowerCase().includes(q) ||
    c.state.toLowerCase().includes(q),
  ).slice(0, limit);
}
