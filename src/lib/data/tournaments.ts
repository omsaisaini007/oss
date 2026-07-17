// FIFA World Cup historical data 1930-2026
// Source: Wikipedia, FIFA archives
// Comprehensive tournament-by-tournament record

export interface Tournament {
  year: number;
  host: string;
  hostCode: string;
  continent: string;
  winner: string;
  winnerCode: string;
  runnerUp: string;
  runnerUpCode: string;
  thirdPlace: string;
  fourthPlace: string;
  goldenBall: string;
  goldenBoot: string;
  goldenBootGoals: number;
  bestGoalkeeper: string;
  teams: number;
  matches: number;
  goals: number;
  avgGoals: number;
  topAttendance: number;
  finalScore: string;
  finalStadium: string;
  finalCity: string;
}

export const tournaments: Tournament[] = [
  {
    year: 1930, host: "Uruguay", hostCode: "UY", continent: "South America",
    winner: "Uruguay", winnerCode: "UY", runnerUp: "Argentina", runnerUpCode: "AR",
    thirdPlace: "USA", fourthPlace: "Yugoslavia",
    goldenBall: "José Nasazzi", goldenBoot: "Guillermo Stábile", goldenBootGoals: 8,
    bestGoalkeeper: "Enrique Ballestrero",
    teams: 13, matches: 18, goals: 70, avgGoals: 3.89, topAttendance: 93000,
    finalScore: "4–2", finalStadium: "Estadio Centenario", finalCity: "Montevideo",
  },
  {
    year: 1934, host: "Italy", hostCode: "IT", continent: "Europe",
    winner: "Italy", winnerCode: "IT", runnerUp: "Czechoslovakia", runnerUpCode: "CS",
    thirdPlace: "Germany", fourthPlace: "Austria",
    goldenBall: "Giuseppe Meazza", goldenBoot: "Oldřich Nejedlý", goldenBootGoals: 5,
    bestGoalkeeper: "Ricardo Zamora",
    teams: 16, matches: 17, goals: 70, avgGoals: 4.12, topAttendance: 55000,
    finalScore: "2–1 (aet)", finalStadium: "Stadio Nazionale PNF", finalCity: "Rome",
  },
  {
    year: 1938, host: "France", hostCode: "FR", continent: "Europe",
    winner: "Italy", winnerCode: "IT", runnerUp: "Hungary", runnerUpCode: "HU",
    thirdPlace: "Brazil", fourthPlace: "Sweden",
    goldenBall: "Leônidas", goldenBoot: "Leônidas", goldenBootGoals: 7,
    bestGoalkeeper: "Aldo Olivieri",
    teams: 15, matches: 18, goals: 84, avgGoals: 4.67, topAttendance: 60000,
    finalScore: "4–2", finalStadium: "Stade Olympique de Colombes", finalCity: "Paris",
  },
  {
    year: 1950, host: "Brazil", hostCode: "BR", continent: "South America",
    winner: "Uruguay", winnerCode: "UY", runnerUp: "Brazil", runnerUpCode: "BR",
    thirdPlace: "Sweden", fourthPlace: "Spain",
    goldenBall: "Zizinho", goldenBoot: "Ademir", goldenBootGoals: 8,
    bestGoalkeeper: "Roque Máspoli",
    teams: 13, matches: 22, goals: 88, avgGoals: 4.0, topAttendance: 173850,
    finalScore: "2–1", finalStadium: "Maracanã Stadium", finalCity: "Rio de Janeiro",
  },
  {
    year: 1954, host: "Switzerland", hostCode: "CH", continent: "Europe",
    winner: "West Germany", winnerCode: "DE", runnerUp: "Hungary", runnerUpCode: "HU",
    thirdPlace: "Austria", fourthPlace: "Uruguay",
    goldenBall: "Ferenc Puskás", goldenBoot: "Sándor Kocsis", goldenBootGoals: 11,
    bestGoalkeeper: "Gyula Grosics",
    teams: 16, matches: 26, goals: 140, avgGoals: 5.38, topAttendance: 64000,
    finalScore: "3–2", finalStadium: "Wankdorf Stadium", finalCity: "Bern",
  },
  {
    year: 1958, host: "Sweden", hostCode: "SE", continent: "Europe",
    winner: "Brazil", winnerCode: "BR", runnerUp: "Sweden", runnerUpCode: "SE",
    thirdPlace: "France", fourthPlace: "West Germany",
    goldenBall: "Didi", goldenBoot: "Just Fontaine", goldenBootGoals: 13,
    bestGoalkeeper: "Harry Gregg",
    teams: 16, matches: 35, goals: 126, avgGoals: 3.6, topAttendance: 49471,
    finalScore: "5–2", finalStadium: "Råsunda Stadium", finalCity: "Solna",
  },
  {
    year: 1962, host: "Chile", hostCode: "CL", continent: "South America",
    winner: "Brazil", winnerCode: "BR", runnerUp: "Czechoslovakia", runnerUpCode: "CS",
    thirdPlace: "Chile", fourthPlace: "Yugoslavia",
    goldenBall: "Garrincha", goldenBoot: "Garrincha", goldenBootGoals: 4,
    bestGoalkeeper: "Viliam Schrojf",
    teams: 16, matches: 32, goals: 89, avgGoals: 2.78, topAttendance: 69694,
    finalScore: "3–1", finalStadium: "Estadio Nacional", finalCity: "Santiago",
  },
  {
    year: 1966, host: "England", hostCode: "GB", continent: "Europe",
    winner: "England", winnerCode: "GB", runnerUp: "West Germany", runnerUpCode: "DE",
    thirdPlace: "Portugal", fourthPlace: "Soviet Union",
    goldenBall: "Bobby Charlton", goldenBoot: "Eusébio", goldenBootGoals: 9,
    bestGoalkeeper: "Gordon Banks",
    teams: 16, matches: 32, goals: 89, avgGoals: 2.78, topAttendance: 96924,
    finalScore: "4–2 (aet)", finalStadium: "Wembley Stadium", finalCity: "London",
  },
  {
    year: 1970, host: "Mexico", hostCode: "MX", continent: "North America",
    winner: "Brazil", winnerCode: "BR", runnerUp: "Italy", runnerUpCode: "IT",
    thirdPlace: "West Germany", fourthPlace: "Uruguay",
    goldenBall: "Pelé", goldenBoot: "Gerd Müller", goldenBootGoals: 10,
    bestGoalkeeper: "Felix",
    teams: 16, matches: 32, goals: 95, avgGoals: 2.97, topAttendance: 107412,
    finalScore: "4–1", finalStadium: "Estadio Azteca", finalCity: "Mexico City",
  },
  {
    year: 1974, host: "West Germany", hostCode: "DE", continent: "Europe",
    winner: "West Germany", winnerCode: "DE", runnerUp: "Netherlands", runnerUpCode: "NL",
    thirdPlace: "Poland", fourthPlace: "Brazil",
    goldenBall: "Johan Cruyff", goldenBoot: "Grzegorz Lato", goldenBootGoals: 7,
    bestGoalkeeper: "Sepp Maier",
    teams: 16, matches: 38, goals: 97, avgGoals: 2.55, topAttendance: 78000,
    finalScore: "2–1", finalStadium: "Olympiastadion", finalCity: "Munich",
  },
  {
    year: 1978, host: "Argentina", hostCode: "AR", continent: "South America",
    winner: "Argentina", winnerCode: "AR", runnerUp: "Netherlands", runnerUpCode: "NL",
    thirdPlace: "Brazil", fourthPlace: "Italy",
    goldenBall: "Mario Kempes", goldenBoot: "Mario Kempes", goldenBootGoals: 6,
    bestGoalkeeper: "Ubaldo Fillol",
    teams: 16, matches: 38, goals: 102, avgGoals: 2.68, topAttendance: 71612,
    finalScore: "3–1 (aet)", finalStadium: "Estadio Monumental", finalCity: "Buenos Aires",
  },
  {
    year: 1982, host: "Spain", hostCode: "ES", continent: "Europe",
    winner: "Italy", winnerCode: "IT", runnerUp: "West Germany", runnerUpCode: "DE",
    thirdPlace: "Poland", fourthPlace: "France",
    goldenBall: "Paolo Rossi", goldenBoot: "Paolo Rossi", goldenBootGoals: 6,
    bestGoalkeeper: "Dino Zoff",
    teams: 24, matches: 52, goals: 146, avgGoals: 2.81, topAttendance: 90000,
    finalScore: "3–1", finalStadium: "Santiago Bernabéu", finalCity: "Madrid",
  },
  {
    year: 1986, host: "Mexico", hostCode: "MX", continent: "North America",
    winner: "Argentina", winnerCode: "AR", runnerUp: "West Germany", runnerUpCode: "DE",
    thirdPlace: "France", fourthPlace: "Belgium",
    goldenBall: "Diego Maradona", goldenBoot: "Gary Lineker", goldenBootGoals: 6,
    bestGoalkeeper: "Jean-Marie Pfaff",
    teams: 24, matches: 52, goals: 132, avgGoals: 2.54, topAttendance: 114580,
    finalScore: "3–2", finalStadium: "Estadio Azteca", finalCity: "Mexico City",
  },
  {
    year: 1990, host: "Italy", hostCode: "IT", continent: "Europe",
    winner: "West Germany", winnerCode: "DE", runnerUp: "Argentina", runnerUpCode: "AR",
    thirdPlace: "Italy", fourthPlace: "England",
    goldenBall: "Salvatore Schillaci", goldenBoot: "Salvatore Schillaci", goldenBootGoals: 6,
    bestGoalkeeper: "Luis Arconada",
    teams: 24, matches: 52, goals: 115, avgGoals: 2.21, topAttendance: 73603,
    finalScore: "1–0", finalStadium: "Stadio Olimpico", finalCity: "Rome",
  },
  {
    year: 1994, host: "United States", hostCode: "US", continent: "North America",
    winner: "Brazil", winnerCode: "BR", runnerUp: "Italy", runnerUpCode: "IT",
    thirdPlace: "Sweden", fourthPlace: "Bulgaria",
    goldenBall: "Romário", goldenBoot: "Hristo Stoichkov", goldenBootGoals: 6,
    bestGoalkeeper: "Michel Preud'homme",
    teams: 24, matches: 52, goals: 141, avgGoals: 2.71, topAttendance: 94194,
    finalScore: "0–0 (3–2 pen)", finalStadium: "Rose Bowl", finalCity: "Pasadena",
  },
  {
    year: 1998, host: "France", hostCode: "FR", continent: "Europe",
    winner: "France", winnerCode: "FR", runnerUp: "Brazil", runnerUpCode: "BR",
    thirdPlace: "Croatia", fourthPlace: "Netherlands",
    goldenBall: "Ronaldo", goldenBoot: "Davor Šuker", goldenBootGoals: 6,
    bestGoalkeeper: "Fabien Barthez",
    teams: 32, matches: 64, goals: 171, avgGoals: 2.67, topAttendance: 80000,
    finalScore: "3–0", finalStadium: "Stade de France", finalCity: "Saint-Denis",
  },
  {
    year: 2002, host: "South Korea / Japan", hostCode: "KR", continent: "Asia",
    winner: "Brazil", winnerCode: "BR", runnerUp: "Germany", runnerUpCode: "DE",
    thirdPlace: "Turkey", fourthPlace: "South Korea",
    goldenBall: "Oliver Kahn", goldenBoot: "Ronaldo", goldenBootGoals: 8,
    bestGoalkeeper: "Oliver Kahn",
    teams: 32, matches: 64, goals: 161, avgGoals: 2.52, topAttendance: 69029,
    finalScore: "2–0", finalStadium: "International Stadium Yokohama", finalCity: "Yokohama",
  },
  {
    year: 2006, host: "Germany", hostCode: "DE", continent: "Europe",
    winner: "Italy", winnerCode: "IT", runnerUp: "France", runnerUpCode: "FR",
    thirdPlace: "Germany", fourthPlace: "Portugal",
    goldenBall: "Zinedine Zidane", goldenBoot: "Miroslav Klose", goldenBootGoals: 5,
    bestGoalkeeper: "Gianluigi Buffon",
    teams: 32, matches: 64, goals: 147, avgGoals: 2.30, topAttendance: 72000,
    finalScore: "1–1 (5–3 pen)", finalStadium: "Olympiastadion", finalCity: "Berlin",
  },
  {
    year: 2010, host: "South Africa", hostCode: "ZA", continent: "Africa",
    winner: "Spain", winnerCode: "ES", runnerUp: "Netherlands", runnerUpCode: "NL",
    thirdPlace: "Germany", fourthPlace: "Uruguay",
    goldenBall: "Diego Forlán", goldenBoot: "Thomas Müller", goldenBootGoals: 5,
    bestGoalkeeper: "Iker Casillas",
    teams: 32, matches: 64, goals: 145, avgGoals: 2.27, topAttendance: 84490,
    finalScore: "1–0 (aet)", finalStadium: "Soccer City", finalCity: "Johannesburg",
  },
  {
    year: 2014, host: "Brazil", hostCode: "BR", continent: "South America",
    winner: "Germany", winnerCode: "DE", runnerUp: "Argentina", runnerUpCode: "AR",
    thirdPlace: "Netherlands", fourthPlace: "Brazil",
    goldenBall: "Lionel Messi", goldenBoot: "James Rodríguez", goldenBootGoals: 6,
    bestGoalkeeper: "Manuel Neuer",
    teams: 32, matches: 64, goals: 171, avgGoals: 2.67, topAttendance: 74738,
    finalScore: "1–0 (aet)", finalStadium: "Maracanã Stadium", finalCity: "Rio de Janeiro",
  },
  {
    year: 2018, host: "Russia", hostCode: "RU", continent: "Europe",
    winner: "France", winnerCode: "FR", runnerUp: "Croatia", runnerUpCode: "HR",
    thirdPlace: "Belgium", fourthPlace: "England",
    goldenBall: "Luka Modrić", goldenBoot: "Harry Kane", goldenBootGoals: 6,
    bestGoalkeeper: "Thibaut Courtois",
    teams: 32, matches: 64, goals: 169, avgGoals: 2.64, topAttendance: 78011,
    finalScore: "4–2", finalStadium: "Luzhniki Stadium", finalCity: "Moscow",
  },
  {
    year: 2022, host: "Qatar", hostCode: "QA", continent: "Asia",
    winner: "Argentina", winnerCode: "AR", runnerUp: "France", runnerUpCode: "FR",
    thirdPlace: "Croatia", fourthPlace: "Morocco",
    goldenBall: "Lionel Messi", goldenBoot: "Kylian Mbappé", goldenBootGoals: 8,
    bestGoalkeeper: "Emiliano Martínez",
    teams: 32, matches: 64, goals: 172, avgGoals: 2.69, topAttendance: 88966,
    finalScore: "3–3 (4–2 pen)", finalStadium: "Lusail Stadium", finalCity: "Lusail",
  },
  {
    year: 2026, host: "USA / Canada / Mexico", hostCode: "US", continent: "North America",
    winner: "TBD", winnerCode: "TBD", runnerUp: "TBD", runnerUpCode: "TBD",
    thirdPlace: "TBD", fourthPlace: "TBD",
    goldenBall: "TBD", goldenBoot: "TBD", goldenBootGoals: 0,
    bestGoalkeeper: "TBD",
    teams: 48, matches: 104, goals: 0, avgGoals: 0, topAttendance: 82500,
    finalScore: "TBD", finalStadium: "MetLife Stadium", finalCity: "New York/New Jersey",
  },
  {
    year: 2030, host: "Spain / Portugal / Morocco", hostCode: "ES", continent: "Europe/Africa",
    winner: "TBD", winnerCode: "TBD", runnerUp: "TBD", runnerUpCode: "TBD",
    thirdPlace: "TBD", fourthPlace: "TBD",
    goldenBall: "TBD", goldenBoot: "TBD", goldenBootGoals: 0,
    bestGoalkeeper: "TBD",
    teams: 48, matches: 104, goals: 0, avgGoals: 0, topAttendance: 90000,
    finalScore: "TBD", finalStadium: "Santiago Bernabéu", finalCity: "Madrid",
  },
];

// Aggregated totals (2026 World Cup currently ongoing — in knockout stage as of July 2026)
export const tournamentStats = {
  totalWorldCups: tournaments.length - 2, // exclude 2026 (ongoing) + 2030 (upcoming)
  totalMatches: tournaments.reduce((sum, t) => sum + (t.year >= 2026 ? 0 : t.matches), 0),
  totalGoals: tournaments.reduce((sum, t) => sum + t.goals, 0),
  totalTeams: 48, // current format
  totalAttendance: 38500000, // through 2022 (2026 still in progress)
  totalCountries: 84, // countries that have appeared (48-team era expanded)
};

// Most successful nations (champions)
export interface ChampionTally {
  country: string;
  code: string;
  titles: number;
  years: number[];
  runnerUps: number;
  confederation: string;
}

export const champions: ChampionTally[] = [
  { country: "Brazil", code: "BR", titles: 5, years: [1958, 1962, 1970, 1994, 2002], runnerUps: 2, confederation: "CONMEBOL" },
  { country: "Germany", code: "DE", titles: 4, years: [1954, 1974, 1990, 2014], runnerUps: 4, confederation: "UEFA" },
  { country: "Italy", code: "IT", titles: 4, years: [1934, 1938, 1982, 2006], runnerUps: 2, confederation: "UEFA" },
  { country: "Argentina", code: "AR", titles: 3, years: [1978, 1986, 2022], runnerUps: 3, confederation: "CONMEBOL" },
  { country: "France", code: "FR", titles: 2, years: [1998, 2018], runnerUps: 2, confederation: "UEFA" },
  { country: "Uruguay", code: "UY", titles: 2, years: [1930, 1950], runnerUps: 0, confederation: "CONMEBOL" },
  { country: "England", code: "GB", titles: 1, years: [1966], runnerUps: 0, confederation: "UEFA" },
  { country: "Spain", code: "ES", titles: 1, years: [2010], runnerUps: 0, confederation: "UEFA" },
];

// Helper: get tournament by year
export function getTournamentByYear(year: number): Tournament | undefined {
  return tournaments.find((t) => t.year === year);
}

// Helper: count titles per nation
export function getTitlesForNation(country: string): number {
  return tournaments.filter((t) => t.winner === country).length;
}

// Helper: list of all unique host countries
export const allHosts = Array.from(new Set(tournaments.map((t) => t.host)));
