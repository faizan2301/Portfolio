/**
 * Countries used by the flag game.
 *
 * Included: UN member states, plus Holy See (VA), Palestine (PS), and Taiwan (TW).
 * PS and TW are included because they have official ISO 3166-1 codes and distinct flags.
 * Territories and entities without an official ISO code (including Kosovo) are omitted.
 *
 * Flag artwork lives in public/flags/{alpha2}.svg and comes from the MIT-licensed
 * flag-icons set. See public/flags/LICENSE.
 *
 * Coordinates are approximate geographic centroids, used only for distance clues.
 */

export type Continent =
  | "Africa"
  | "Asia"
  | "Europe"
  | "North America"
  | "Oceania"
  | "South America";

export interface Country {
  name: string;
  alpha2: string;
  alpha3: string;
  continent: Continent;
  lat: number;
  lng: number;
  aliases: readonly string[];
}

type CountryRow = readonly [
  name: string,
  alpha2: string,
  alpha3: string,
  continent: Continent,
  lat: number,
  lng: number,
];

const ROWS: readonly CountryRow[] = [
  ["Afghanistan", "AF", "AFG", "Asia", 33.94, 67.71],
  ["Albania", "AL", "ALB", "Europe", 41.15, 20.17],
  ["Algeria", "DZ", "DZA", "Africa", 28.03, 1.66],
  ["Andorra", "AD", "AND", "Europe", 42.55, 1.6],
  ["Angola", "AO", "AGO", "Africa", -11.2, 17.87],
  ["Antigua and Barbuda", "AG", "ATG", "North America", 17.06, -61.8],
  ["Argentina", "AR", "ARG", "South America", -38.42, -63.62],
  ["Armenia", "AM", "ARM", "Asia", 40.07, 45.04],
  ["Australia", "AU", "AUS", "Oceania", -25.27, 133.78],
  ["Austria", "AT", "AUT", "Europe", 47.52, 14.55],
  ["Azerbaijan", "AZ", "AZE", "Asia", 40.14, 47.58],
  ["Bahamas", "BS", "BHS", "North America", 25.03, -77.4],
  ["Bahrain", "BH", "BHR", "Asia", 26.07, 50.56],
  ["Bangladesh", "BD", "BGD", "Asia", 23.68, 90.36],
  ["Barbados", "BB", "BRB", "North America", 13.19, -59.54],
  ["Belarus", "BY", "BLR", "Europe", 53.71, 27.95],
  ["Belgium", "BE", "BEL", "Europe", 50.5, 4.47],
  ["Belize", "BZ", "BLZ", "North America", 17.19, -88.5],
  ["Benin", "BJ", "BEN", "Africa", 9.31, 2.32],
  ["Bhutan", "BT", "BTN", "Asia", 27.51, 90.43],
  ["Bolivia", "BO", "BOL", "South America", -16.29, -63.59],
  ["Bosnia and Herzegovina", "BA", "BIH", "Europe", 43.92, 17.68],
  ["Botswana", "BW", "BWA", "Africa", -22.33, 24.68],
  ["Brazil", "BR", "BRA", "South America", -14.24, -51.93],
  ["Brunei", "BN", "BRN", "Asia", 4.54, 114.73],
  ["Bulgaria", "BG", "BGR", "Europe", 42.73, 25.49],
  ["Burkina Faso", "BF", "BFA", "Africa", 12.24, -1.56],
  ["Burundi", "BI", "BDI", "Africa", -3.37, 29.92],
  ["Cabo Verde", "CV", "CPV", "Africa", 16.0, -24.01],
  ["Cambodia", "KH", "KHM", "Asia", 12.57, 104.99],
  ["Cameroon", "CM", "CMR", "Africa", 7.37, 12.35],
  ["Canada", "CA", "CAN", "North America", 56.13, -106.35],
  ["Central African Republic", "CF", "CAF", "Africa", 6.61, 20.94],
  ["Chad", "TD", "TCD", "Africa", 15.45, 18.73],
  ["Chile", "CL", "CHL", "South America", -35.68, -71.54],
  ["China", "CN", "CHN", "Asia", 35.86, 104.2],
  ["Colombia", "CO", "COL", "South America", 4.57, -74.3],
  ["Comoros", "KM", "COM", "Africa", -11.88, 43.87],
  ["Congo", "CG", "COG", "Africa", -0.23, 15.83],
  ["Costa Rica", "CR", "CRI", "North America", 9.75, -83.75],
  ["Côte d'Ivoire", "CI", "CIV", "Africa", 7.54, -5.55],
  ["Croatia", "HR", "HRV", "Europe", 45.1, 15.2],
  ["Cuba", "CU", "CUB", "North America", 21.52, -77.78],
  ["Cyprus", "CY", "CYP", "Asia", 35.13, 33.43],
  ["Czechia", "CZ", "CZE", "Europe", 49.82, 15.47],
  ["DR Congo", "CD", "COD", "Africa", -4.04, 21.76],
  ["Denmark", "DK", "DNK", "Europe", 56.26, 9.5],
  ["Djibouti", "DJ", "DJI", "Africa", 11.83, 42.59],
  ["Dominica", "DM", "DMA", "North America", 15.41, -61.37],
  ["Dominican Republic", "DO", "DOM", "North America", 18.74, -70.16],
  ["Ecuador", "EC", "ECU", "South America", -1.83, -78.18],
  ["Egypt", "EG", "EGY", "Africa", 26.82, 30.8],
  ["El Salvador", "SV", "SLV", "North America", 13.79, -88.9],
  ["Equatorial Guinea", "GQ", "GNQ", "Africa", 1.65, 10.27],
  ["Eritrea", "ER", "ERI", "Africa", 15.18, 39.78],
  ["Estonia", "EE", "EST", "Europe", 58.6, 25.01],
  ["Eswatini", "SZ", "SWZ", "Africa", -26.52, 31.47],
  ["Ethiopia", "ET", "ETH", "Africa", 9.15, 40.49],
  ["Fiji", "FJ", "FJI", "Oceania", -17.71, 178.07],
  ["Finland", "FI", "FIN", "Europe", 61.92, 25.75],
  ["France", "FR", "FRA", "Europe", 46.23, 2.21],
  ["Gabon", "GA", "GAB", "Africa", -0.8, 11.61],
  ["Gambia", "GM", "GMB", "Africa", 13.44, -15.31],
  ["Georgia", "GE", "GEO", "Asia", 42.32, 43.36],
  ["Germany", "DE", "DEU", "Europe", 51.17, 10.45],
  ["Ghana", "GH", "GHA", "Africa", 7.95, -1.02],
  ["Greece", "GR", "GRC", "Europe", 39.07, 21.82],
  ["Grenada", "GD", "GRD", "North America", 12.12, -61.68],
  ["Guatemala", "GT", "GTM", "North America", 15.78, -90.23],
  ["Guinea", "GN", "GIN", "Africa", 9.95, -9.7],
  ["Guinea-Bissau", "GW", "GNB", "Africa", 11.8, -15.18],
  ["Guyana", "GY", "GUY", "South America", 4.86, -58.93],
  ["Haiti", "HT", "HTI", "North America", 18.97, -72.29],
  ["Honduras", "HN", "HND", "North America", 15.2, -86.24],
  ["Hungary", "HU", "HUN", "Europe", 47.16, 19.5],
  ["Iceland", "IS", "ISL", "Europe", 64.96, -19.02],
  ["India", "IN", "IND", "Asia", 20.59, 78.96],
  ["Indonesia", "ID", "IDN", "Asia", -0.79, 113.92],
  ["Iran", "IR", "IRN", "Asia", 32.43, 53.69],
  ["Iraq", "IQ", "IRQ", "Asia", 33.22, 43.68],
  ["Ireland", "IE", "IRL", "Europe", 53.14, -7.69],
  ["Israel", "IL", "ISR", "Asia", 31.05, 34.85],
  ["Italy", "IT", "ITA", "Europe", 41.87, 12.57],
  ["Jamaica", "JM", "JAM", "North America", 18.11, -77.3],
  ["Japan", "JP", "JPN", "Asia", 36.2, 138.25],
  ["Jordan", "JO", "JOR", "Asia", 30.59, 36.24],
  ["Kazakhstan", "KZ", "KAZ", "Asia", 48.02, 66.92],
  ["Kenya", "KE", "KEN", "Africa", -0.02, 37.91],
  ["Kiribati", "KI", "KIR", "Oceania", 1.87, -157.36],
  ["Kuwait", "KW", "KWT", "Asia", 29.31, 47.48],
  ["Kyrgyzstan", "KG", "KGZ", "Asia", 41.2, 74.77],
  ["Laos", "LA", "LAO", "Asia", 19.86, 102.5],
  ["Latvia", "LV", "LVA", "Europe", 56.88, 24.6],
  ["Lebanon", "LB", "LBN", "Asia", 33.85, 35.86],
  ["Lesotho", "LS", "LSO", "Africa", -29.61, 28.23],
  ["Liberia", "LR", "LBR", "Africa", 6.43, -9.43],
  ["Libya", "LY", "LBY", "Africa", 26.34, 17.23],
  ["Liechtenstein", "LI", "LIE", "Europe", 47.17, 9.56],
  ["Lithuania", "LT", "LTU", "Europe", 55.17, 23.88],
  ["Luxembourg", "LU", "LUX", "Europe", 49.82, 6.13],
  ["Madagascar", "MG", "MDG", "Africa", -18.77, 46.87],
  ["Malawi", "MW", "MWI", "Africa", -13.25, 34.3],
  ["Malaysia", "MY", "MYS", "Asia", 4.21, 101.98],
  ["Maldives", "MV", "MDV", "Asia", 3.2, 73.22],
  ["Mali", "ML", "MLI", "Africa", 17.57, -4.0],
  ["Malta", "MT", "MLT", "Europe", 35.94, 14.38],
  ["Marshall Islands", "MH", "MHL", "Oceania", 7.13, 171.18],
  ["Mauritania", "MR", "MRT", "Africa", 21.01, -10.94],
  ["Mauritius", "MU", "MUS", "Africa", -20.35, 57.55],
  ["Mexico", "MX", "MEX", "North America", 23.63, -102.55],
  ["Micronesia", "FM", "FSM", "Oceania", 6.89, 158.22],
  ["Moldova", "MD", "MDA", "Europe", 47.41, 28.37],
  ["Monaco", "MC", "MCO", "Europe", 43.75, 7.41],
  ["Mongolia", "MN", "MNG", "Asia", 46.86, 103.85],
  ["Montenegro", "ME", "MNE", "Europe", 42.71, 19.37],
  ["Morocco", "MA", "MAR", "Africa", 31.79, -7.09],
  ["Mozambique", "MZ", "MOZ", "Africa", -18.67, 35.53],
  ["Myanmar", "MM", "MMR", "Asia", 21.91, 95.96],
  ["Namibia", "NA", "NAM", "Africa", -22.96, 18.49],
  ["Nauru", "NR", "NRU", "Oceania", -0.52, 166.93],
  ["Nepal", "NP", "NPL", "Asia", 28.39, 84.12],
  ["Netherlands", "NL", "NLD", "Europe", 52.13, 5.29],
  ["New Zealand", "NZ", "NZL", "Oceania", -40.9, 174.89],
  ["Nicaragua", "NI", "NIC", "North America", 12.87, -85.21],
  ["Niger", "NE", "NER", "Africa", 17.61, 8.08],
  ["Nigeria", "NG", "NGA", "Africa", 9.08, 8.68],
  ["North Korea", "KP", "PRK", "Asia", 40.34, 127.51],
  ["North Macedonia", "MK", "MKD", "Europe", 41.51, 21.75],
  ["Norway", "NO", "NOR", "Europe", 60.47, 8.47],
  ["Oman", "OM", "OMN", "Asia", 21.47, 55.98],
  ["Pakistan", "PK", "PAK", "Asia", 30.38, 69.35],
  ["Palau", "PW", "PLW", "Oceania", 7.51, 134.58],
  ["Palestine", "PS", "PSE", "Asia", 31.95, 35.23],
  ["Panama", "PA", "PAN", "North America", 8.54, -80.78],
  ["Papua New Guinea", "PG", "PNG", "Oceania", -6.31, 143.96],
  ["Paraguay", "PY", "PRY", "South America", -23.44, -58.44],
  ["Peru", "PE", "PER", "South America", -9.19, -75.02],
  ["Philippines", "PH", "PHL", "Asia", 12.88, 121.77],
  ["Poland", "PL", "POL", "Europe", 51.92, 19.15],
  ["Portugal", "PT", "PRT", "Europe", 39.4, -8.22],
  ["Qatar", "QA", "QAT", "Asia", 25.35, 51.18],
  ["Romania", "RO", "ROU", "Europe", 45.94, 24.97],
  ["Russia", "RU", "RUS", "Europe", 61.52, 105.32],
  ["Rwanda", "RW", "RWA", "Africa", -1.94, 29.87],
  ["Saint Kitts and Nevis", "KN", "KNA", "North America", 17.36, -62.78],
  ["Saint Lucia", "LC", "LCA", "North America", 13.91, -60.98],
  ["Saint Vincent and the Grenadines", "VC", "VCT", "North America", 13.25, -61.2],
  ["Samoa", "WS", "WSM", "Oceania", -13.76, -172.1],
  ["San Marino", "SM", "SMR", "Europe", 43.94, 12.46],
  ["São Tomé and Príncipe", "ST", "STP", "Africa", 0.19, 6.61],
  ["Saudi Arabia", "SA", "SAU", "Asia", 23.89, 45.08],
  ["Senegal", "SN", "SEN", "Africa", 14.5, -14.45],
  ["Serbia", "RS", "SRB", "Europe", 44.02, 21.01],
  ["Seychelles", "SC", "SYC", "Africa", -4.68, 55.49],
  ["Sierra Leone", "SL", "SLE", "Africa", 8.46, -11.78],
  ["Singapore", "SG", "SGP", "Asia", 1.35, 103.82],
  ["Slovakia", "SK", "SVK", "Europe", 48.67, 19.7],
  ["Slovenia", "SI", "SVN", "Europe", 46.15, 14.99],
  ["Solomon Islands", "SB", "SLB", "Oceania", -9.65, 160.16],
  ["Somalia", "SO", "SOM", "Africa", 5.15, 46.2],
  ["South Africa", "ZA", "ZAF", "Africa", -30.56, 22.94],
  ["South Korea", "KR", "KOR", "Asia", 35.91, 127.77],
  ["South Sudan", "SS", "SSD", "Africa", 6.88, 31.31],
  ["Spain", "ES", "ESP", "Europe", 40.46, -3.75],
  ["Sri Lanka", "LK", "LKA", "Asia", 7.87, 80.77],
  ["Sudan", "SD", "SDN", "Africa", 12.86, 30.22],
  ["Suriname", "SR", "SUR", "South America", 3.92, -56.03],
  ["Sweden", "SE", "SWE", "Europe", 60.13, 18.64],
  ["Switzerland", "CH", "CHE", "Europe", 46.82, 8.23],
  ["Syria", "SY", "SYR", "Asia", 34.8, 39.0],
  ["Taiwan", "TW", "TWN", "Asia", 23.7, 120.96],
  ["Tajikistan", "TJ", "TJK", "Asia", 38.86, 71.28],
  ["Tanzania", "TZ", "TZA", "Africa", -6.37, 34.89],
  ["Thailand", "TH", "THA", "Asia", 15.87, 100.99],
  ["Timor-Leste", "TL", "TLS", "Asia", -8.87, 125.73],
  ["Togo", "TG", "TGO", "Africa", 8.62, 0.82],
  ["Tonga", "TO", "TON", "Oceania", -21.18, -175.2],
  ["Trinidad and Tobago", "TT", "TTO", "North America", 10.69, -61.22],
  ["Tunisia", "TN", "TUN", "Africa", 33.89, 9.54],
  ["Turkey", "TR", "TUR", "Asia", 38.96, 35.24],
  ["Turkmenistan", "TM", "TKM", "Asia", 38.97, 59.56],
  ["Tuvalu", "TV", "TUV", "Oceania", -7.11, 177.65],
  ["Uganda", "UG", "UGA", "Africa", 1.37, 32.29],
  ["Ukraine", "UA", "UKR", "Europe", 48.38, 31.17],
  ["United Arab Emirates", "AE", "ARE", "Asia", 23.42, 53.85],
  ["United Kingdom", "GB", "GBR", "Europe", 55.38, -3.44],
  ["United States", "US", "USA", "North America", 37.09, -95.71],
  ["Uruguay", "UY", "URY", "South America", -32.52, -55.77],
  ["Uzbekistan", "UZ", "UZB", "Asia", 41.38, 64.59],
  ["Vanuatu", "VU", "VUT", "Oceania", -15.38, 166.96],
  ["Vatican City", "VA", "VAT", "Europe", 41.9, 12.45],
  ["Venezuela", "VE", "VEN", "South America", 6.42, -66.59],
  ["Vietnam", "VN", "VNM", "Asia", 14.06, 108.28],
  ["Yemen", "YE", "YEM", "Asia", 15.55, 48.52],
  ["Zambia", "ZM", "ZMB", "Africa", -13.13, 27.85],
  ["Zimbabwe", "ZW", "ZWE", "Africa", -19.02, 29.15],
];

const ALIASES: Readonly<Record<string, readonly string[]>> = {
  AE: ["UAE", "Emirates"],
  BA: ["Bosnia"],
  BN: ["Brunei Darussalam"],
  BO: ["Bolivia Plurinational State"],
  CD: ["DRC", "Democratic Republic of the Congo", "Congo Kinshasa"],
  CG: ["Republic of the Congo", "Congo Brazzaville"],
  CI: ["Ivory Coast", "Cote d'Ivoire"],
  CV: ["Cape Verde"],
  CZ: ["Czech Republic"],
  FM: ["Federated States of Micronesia"],
  GB: ["UK", "Britain", "Great Britain"],
  GM: ["The Gambia"],
  IR: ["Persia"],
  KP: ["DPRK"],
  KR: ["Korea Republic"],
  LA: ["Lao"],
  MD: ["Moldavia"],
  MK: ["Macedonia"],
  MM: ["Burma"],
  NL: ["Holland"],
  PS: ["State of Palestine"],
  RU: ["Russian Federation"],
  ST: ["Sao Tome", "Sao Tome and Principe"],
  SZ: ["Swaziland"],
  TL: ["East Timor"],
  TR: ["Turkiye", "Türkiye"],
  TW: ["Republic of China"],
  TZ: ["United Republic of Tanzania"],
  US: ["USA", "America", "United States of America"],
  VA: ["Holy See", "Vatican"],
  VC: ["Saint Vincent"],
  VE: ["Venezuela Bolivarian Republic"],
  VN: ["Viet Nam"],
};

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function normalizeCountryQuery(value: string): string {
  return normalize(value);
}

export const COUNTRIES: readonly Country[] = ROWS.map((row) => {
  const [name, alpha2, alpha3, continent, lat, lng] = row;
  return {
    name,
    alpha2,
    alpha3,
    continent,
    lat,
    lng,
    aliases: ALIASES[alpha2] ?? [],
  };
});

export const COUNTRY_BY_ALPHA2: ReadonlyMap<string, Country> = new Map(
  COUNTRIES.map((country) => [country.alpha2, country])
);

export function getCountry(alpha2: string): Country | undefined {
  return COUNTRY_BY_ALPHA2.get(alpha2.toUpperCase());
}

export function resolveCountryQuery(query: string): Country | null {
  const normalized = normalize(query);
  if (!normalized) return null;

  const matches = COUNTRIES.filter((country) => {
    if (normalize(country.name) === normalized) return true;
    if (country.alpha2.toLowerCase() === normalized) return true;
    if (country.alpha3.toLowerCase() === normalized) return true;
    return country.aliases.some((alias) => normalize(alias) === normalized);
  });

  return matches.length === 1 ? matches[0] : null;
}

export function searchCountries(
  query: string,
  options?: { exclude?: ReadonlySet<string>; limit?: number }
): Country[] {
  const normalized = normalize(query);
  if (!normalized) return [];

  const exclude = options?.exclude ?? new Set<string>();
  const limit = options?.limit ?? 8;
  const scored: { country: Country; score: number }[] = [];

  for (const country of COUNTRIES) {
    if (exclude.has(country.alpha2)) continue;

    const name = normalize(country.name);
    const aliases = country.aliases.map((alias) => normalize(alias));
    const codes = [country.alpha2.toLowerCase(), country.alpha3.toLowerCase()];
    let score = 0;

    if (name === normalized || aliases.includes(normalized) || codes.includes(normalized)) {
      score = 100;
    } else if (name.startsWith(normalized) || aliases.some((alias) => alias.startsWith(normalized))) {
      score = 80;
    } else if (
      name.split(" ").some((word) => word.startsWith(normalized)) ||
      aliases.some((alias) => alias.split(" ").some((word) => word.startsWith(normalized)))
    ) {
      score = 60;
    } else if (name.includes(normalized) || aliases.some((alias) => alias.includes(normalized))) {
      score = 40;
    } else if (normalized.length >= 2 && codes.some((code) => code.startsWith(normalized))) {
      score = 30;
    }

    if (score > 0) scored.push({ country, score });
  }

  scored.sort(
    (a, b) => b.score - a.score || a.country.name.localeCompare(b.country.name)
  );

  return scored.slice(0, limit).map((entry) => entry.country);
}
