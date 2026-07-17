/**
 * Host Cities & Stadiums Dataset
 * ============================================================
 *
 * Real geographic coordinates for every World Cup host city and stadium
 * since 1930. Used to plot pins on the interactive world map.
 */

export interface HostCity {
  year: number;
  hostCountry: string;
  city: string;
  stadium: string;
  lat: number;
  lng: number;
  attendance: number;
  isFinal: boolean;
}

export const hostCities: HostCity[] = [
  // 1930 Uruguay
  { year: 1930, hostCountry: "Uruguay", city: "Montevideo", stadium: "Estadio Centenario", lat: -34.8553, lng: -56.1875, attendance: 93000, isFinal: true },
  // 1934 Italy
  { year: 1934, hostCountry: "Italy", city: "Rome", stadium: "Stadio Nazionale PNF", lat: 41.9028, lng: 12.4964, attendance: 55000, isFinal: true },
  // 1938 France
  { year: 1938, hostCountry: "France", city: "Paris", stadium: "Stade Olympique de Colombes", lat: 48.8566, lng: 2.3522, attendance: 60000, isFinal: true },
  // 1950 Brazil
  { year: 1950, hostCountry: "Brazil", city: "Rio de Janeiro", stadium: "Maracanã", lat: -22.9121, lng: -43.2302, attendance: 173850, isFinal: true },
  // 1954 Switzerland
  { year: 1954, hostCountry: "Switzerland", city: "Bern", stadium: "Wankdorf Stadium", lat: 46.9481, lng: 7.4474, attendance: 64000, isFinal: true },
  // 1958 Sweden
  { year: 1958, hostCountry: "Sweden", city: "Solna", stadium: "Råsunda Stadium", lat: 59.3686, lng: 18.0204, attendance: 49471, isFinal: true },
  // 1962 Chile
  { year: 1962, hostCountry: "Chile", city: "Santiago", stadium: "Estadio Nacional", lat: -33.4647, lng: -70.6652, attendance: 69694, isFinal: true },
  // 1966 England
  { year: 1966, hostCountry: "England", city: "London", stadium: "Wembley Stadium", lat: 51.5560, lng: -0.2796, attendance: 96924, isFinal: true },
  // 1970 Mexico
  { year: 1970, hostCountry: "Mexico", city: "Mexico City", stadium: "Estadio Azteca", lat: 19.3371, lng: -99.0995, attendance: 107412, isFinal: true },
  // 1974 West Germany
  { year: 1974, hostCountry: "West Germany", city: "Munich", stadium: "Olympiastadion", lat: 48.1731, lng: 11.5463, attendance: 78000, isFinal: true },
  // 1978 Argentina
  { year: 1978, hostCountry: "Argentina", city: "Buenos Aires", stadium: "Estadio Monumental", lat: -34.5453, lng: -58.4497, attendance: 71612, isFinal: true },
  // 1982 Spain
  { year: 1982, hostCountry: "Spain", city: "Madrid", stadium: "Santiago Bernabéu", lat: 40.4531, lng: -3.6884, attendance: 90000, isFinal: true },
  // 1986 Mexico
  { year: 1986, hostCountry: "Mexico", city: "Mexico City", stadium: "Estadio Azteca", lat: 19.3371, lng: -99.0995, attendance: 114580, isFinal: true },
  // 1990 Italy
  { year: 1990, hostCountry: "Italy", city: "Rome", stadium: "Stadio Olimpico", lat: 41.9341, lng: 12.4547, attendance: 73603, isFinal: true },
  // 1994 USA
  { year: 1994, hostCountry: "United States", city: "Pasadena", stadium: "Rose Bowl", lat: 34.1613, lng: -118.1676, attendance: 94194, isFinal: true },
  // 1998 France
  { year: 1998, hostCountry: "France", city: "Saint-Denis", stadium: "Stade de France", lat: 48.9245, lng: 2.3601, attendance: 80000, isFinal: true },
  // 2002 South Korea / Japan
  { year: 2002, hostCountry: "Japan", city: "Yokohama", stadium: "International Stadium Yokohama", lat: 35.5093, lng: 139.6166, attendance: 69029, isFinal: true },
  // 2006 Germany
  { year: 2006, hostCountry: "Germany", city: "Berlin", stadium: "Olympiastadion", lat: 52.5145, lng: 13.2390, attendance: 72000, isFinal: true },
  // 2010 South Africa
  { year: 2010, hostCountry: "South Africa", city: "Johannesburg", stadium: "Soccer City", lat: -26.2333, lng: 27.9833, attendance: 84490, isFinal: true },
  // 2014 Brazil
  { year: 2014, hostCountry: "Brazil", city: "Rio de Janeiro", stadium: "Maracanã", lat: -22.9121, lng: -43.2302, attendance: 74738, isFinal: true },
  // 2018 Russia
  { year: 2018, hostCountry: "Russia", city: "Moscow", stadium: "Luzhniki Stadium", lat: 55.7155, lng: 37.5515, attendance: 78011, isFinal: true },
  // 2022 Qatar
  { year: 2022, hostCountry: "Qatar", city: "Lusail", stadium: "Lusail Stadium", lat: 25.4128, lng: 51.5014, attendance: 88966, isFinal: true },
  // 2026 USA / Canada / Mexico (multiple host cities)
  { year: 2026, hostCountry: "United States", city: "New York/New Jersey", stadium: "MetLife Stadium", lat: 40.8128, lng: -74.0742, attendance: 82500, isFinal: true },
  { year: 2026, hostCountry: "United States", city: "Los Angeles", stadium: "SoFi Stadium", lat: 33.9537, lng: -118.3387, attendance: 70000, isFinal: false },
  { year: 2026, hostCountry: "United States", city: "Dallas", stadium: "AT&T Stadium", lat: 32.7473, lng: -97.0945, attendance: 80000, isFinal: false },
  { year: 2026, hostCountry: "Canada", city: "Toronto", stadium: "BMO Field", lat: 43.6332, lng: -79.4170, attendance: 45000, isFinal: false },
  { year: 2026, hostCountry: "Mexico", city: "Mexico City", stadium: "Estadio Azteca", lat: 19.3371, lng: -99.0995, attendance: 83000, isFinal: false },
  // 2030 Spain / Portugal / Morocco
  { year: 2030, hostCountry: "Spain", city: "Madrid", stadium: "Santiago Bernabéu", lat: 40.4531, lng: -3.6884, attendance: 90000, isFinal: true },
  { year: 2030, hostCountry: "Portugal", city: "Lisbon", stadium: "Estádio da Luz", lat: 38.7528, lng: -9.1847, attendance: 65000, isFinal: false },
  { year: 2030, hostCountry: "Morocco", city: "Casablanca", stadium: "Grand Stade de Casablanca", lat: 33.5731, lng: -7.5898, attendance: 76000, isFinal: false },
];
