// National team profiles with detailed stats
// ELO ratings (approximate as of 2026 pre-tournament), FIFA rankings, squad data

export interface TeamProfile {
  code: string;
  name: string;
  confederation: string;
  fifaRank: number;
  eloRating: number;
  worldCupAppearances: number;
  titles: number;
  titleYears: number[];
  runnerUps: number;
  thirdPlaces: number;
  totalMatches: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  cleanSheets: number;
  squadValue: number; // in millions EUR
  avgPlayerRating: number; // FIFA-style rating
  formRating: number; // 0-100 last 10 matches form
  attackRating: number; // 0-100
  defenseRating: number; // 0-100
  midfieldRating: number; // 0-100
  legendaryPlayers: string[];
  bestResult: string;
  bestYear: number;
  manager: string;
  flag: string; // emoji
  primaryColor: string;
  secondaryColor: string;
}

export const teams: TeamProfile[] = [
  {
    code: "BR", name: "Brazil", confederation: "CONMEBOL",
    fifaRank: 5, eloRating: 1928,
    worldCupAppearances: 22, titles: 5, titleYears: [1958, 1962, 1970, 1994, 2002],
    runnerUps: 2, thirdPlaces: 2,
    totalMatches: 109, wins: 76, draws: 18, losses: 19,
    goalsFor: 237, goalsAgainst: 96, cleanSheets: 51,
    squadValue: 1020, avgPlayerRating: 84.5,
    formRating: 78, attackRating: 92, defenseRating: 78, midfieldRating: 88,
    legendaryPlayers: ["Pelé", "Garrincha", "Ronaldo", "Ronaldinho", "Rivaldo", "Cafu", "Romário", "Neymar", "Kaká"],
    bestResult: "Champions", bestYear: 2002,
    manager: "Carlo Ancelotti",
    flag: "🇧🇷", primaryColor: "#FFCC29", secondaryColor: "#009C3B",
  },
  {
    code: "AR", name: "Argentina", confederation: "CONMEBOL",
    fifaRank: 1, eloRating: 2001,
    worldCupAppearances: 18, titles: 3, titleYears: [1978, 1986, 2022],
    runnerUps: 3, thirdPlaces: 0,
    totalMatches: 86, wins: 47, draws: 19, losses: 20,
    goalsFor: 152, goalsAgainst: 78, cleanSheets: 39,
    squadValue: 820, avgPlayerRating: 85.2,
    formRating: 92, attackRating: 90, defenseRating: 82, midfieldRating: 88,
    legendaryPlayers: ["Diego Maradona", "Lionel Messi", "Gabriel Batistuta", "Daniel Passarella", "Mario Kempes", "Javier Zanetti"],
    bestResult: "Champions", bestYear: 2022,
    manager: "Lionel Scaloni",
    flag: "🇦🇷", primaryColor: "#75AADB", secondaryColor: "#FCBF49",
  },
  {
    code: "FR", name: "France", confederation: "UEFA",
    fifaRank: 2, eloRating: 1985,
    worldCupAppearances: 16, titles: 2, titleYears: [1998, 2018],
    runnerUps: 2, thirdPlaces: 2,
    totalMatches: 73, wins: 39, draws: 14, losses: 20,
    goalsFor: 136, goalsAgainst: 76, cleanSheets: 31,
    squadValue: 1230, avgPlayerRating: 86.1,
    formRating: 88, attackRating: 91, defenseRating: 84, midfieldRating: 89,
    legendaryPlayers: ["Zinedine Zidane", "Michel Platini", "Thierry Henry", "Just Fontaine", "Lilian Thuram", "Kylian Mbappé", "Antoine Griezmann"],
    bestResult: "Champions", bestYear: 2018,
    manager: "Didier Deschamps",
    flag: "🇫🇷", primaryColor: "#0055A4", secondaryColor: "#EF4135",
  },
  {
    code: "DE", name: "Germany", confederation: "UEFA",
    fifaRank: 9, eloRating: 1889,
    worldCupAppearances: 20, titles: 4, titleYears: [1954, 1974, 1990, 2014],
    runnerUps: 4, thirdPlaces: 4,
    totalMatches: 109, wins: 68, draws: 20, losses: 21,
    goalsFor: 226, goalsAgainst: 121, cleanSheets: 42,
    squadValue: 880, avgPlayerRating: 83.8,
    formRating: 75, attackRating: 84, defenseRating: 80, midfieldRating: 85,
    legendaryPlayers: ["Franz Beckenbauer", "Gerd Müller", "Lothar Matthäus", "Miroslav Klose", "Philipp Lahm", "Manuel Neuer", "Thomas Müller"],
    bestResult: "Champions", bestYear: 2014,
    manager: "Julian Nagelsmann",
    flag: "🇩🇪", primaryColor: "#000000", secondaryColor: "#DD0000",
  },
  {
    code: "IT", name: "Italy", confederation: "UEFA",
    fifaRank: 10, eloRating: 1872,
    worldCupAppearances: 18, titles: 4, titleYears: [1934, 1938, 1982, 2006],
    runnerUps: 2, thirdPlaces: 1,
    totalMatches: 83, wins: 45, draws: 21, losses: 17,
    goalsFor: 128, goalsAgainst: 77, cleanSheets: 40,
    squadValue: 640, avgPlayerRating: 82.5,
    formRating: 72, attackRating: 80, defenseRating: 86, midfieldRating: 81,
    legendaryPlayers: ["Giuseppe Meazza", "Paolo Maldini", "Roberto Baggio", "Fabio Cannavaro", "Gianluigi Buffon", "Andrea Pirlo", "Francesco Totti"],
    bestResult: "Champions", bestYear: 2006,
    manager: "Luciano Spalletti",
    flag: "🇮🇹", primaryColor: "#008C45", secondaryColor: "#CD212A",
  },
  {
    code: "ES", name: "Spain", confederation: "UEFA",
    fifaRank: 3, eloRating: 1968,
    worldCupAppearances: 16, titles: 1, titleYears: [2010],
    runnerUps: 0, thirdPlaces: 0,
    totalMatches: 64, wins: 31, draws: 17, losses: 16,
    goalsFor: 108, goalsAgainst: 64, cleanSheets: 30,
    squadValue: 950, avgPlayerRating: 84.9,
    formRating: 89, attackRating: 87, defenseRating: 83, midfieldRating: 90,
    legendaryPlayers: ["Xavi", "Andrés Iniesta", "Iker Casillas", "Raúl", "David Villa", "Fernando Torres", "Sergio Ramos"],
    bestResult: "Champions", bestYear: 2010,
    manager: "Luis de la Fuente",
    flag: "🇪🇸", primaryColor: "#AA151B", secondaryColor: "#F1BF00",
  },
  {
    code: "GB", name: "England", confederation: "UEFA",
    fifaRank: 4, eloRating: 1957,
    worldCupAppearances: 16, titles: 1, titleYears: [1966],
    runnerUps: 0, thirdPlaces: 0,
    totalMatches: 71, wins: 32, draws: 22, losses: 17,
    goalsFor: 91, goalsAgainst: 64, cleanSheets: 28,
    squadValue: 1180, avgPlayerRating: 84.3,
    formRating: 86, attackRating: 88, defenseRating: 81, midfieldRating: 84,
    legendaryPlayers: ["Bobby Charlton", "Bobby Moore", "Gary Lineker", "Wayne Rooney", "David Beckham", "Steven Gerrard", "Harry Kane"],
    bestResult: "Champions", bestYear: 1966,
    manager: "Thomas Tuchel",
    flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", primaryColor: "#FFFFFF", secondaryColor: "#CE1124",
  },
  {
    code: "UY", name: "Uruguay", confederation: "CONMEBOL",
    fifaRank: 14, eloRating: 1841,
    worldCupAppearances: 14, titles: 2, titleYears: [1930, 1950],
    runnerUps: 0, thirdPlaces: 0,
    totalMatches: 56, wins: 24, draws: 14, losses: 18,
    goalsFor: 88, goalsAgainst: 71, cleanSheets: 19,
    squadValue: 380, avgPlayerRating: 80.2,
    formRating: 70, attackRating: 82, defenseRating: 78, midfieldRating: 80,
    legendaryPlayers: ["José Nasazzi", "Enzo Francescoli", "Luis Suárez", "Diego Forlán", "Edinson Cavani", "Juan Alberto Schiaffino"],
    bestResult: "Champions", bestYear: 1950,
    manager: "Marcelo Bielsa",
    flag: "🇺🇾", primaryColor: "#7BB7E1", secondaryColor: "#FFD700",
  },
  {
    code: "NL", name: "Netherlands", confederation: "UEFA",
    fifaRank: 6, eloRating: 1918,
    worldCupAppearances: 11, titles: 0, titleYears: [],
    runnerUps: 3, thirdPlaces: 1,
    totalMatches: 55, wins: 30, draws: 11, losses: 14,
    goalsFor: 96, goalsAgainst: 60, cleanSheets: 22,
    squadValue: 760, avgPlayerRating: 83.6,
    formRating: 82, attackRating: 86, defenseRating: 81, midfieldRating: 83,
    legendaryPlayers: ["Johan Cruyff", "Johan Neeskens", "Marco van Basten", "Ruud Gullit", "Dennis Bergkamp", "Robin van Persie", "Arjen Robben"],
    bestResult: "Runner-up", bestYear: 1974,
    manager: "Ronald Koeman",
    flag: "🇳🇱", primaryColor: "#FF6200", secondaryColor: "#1F2A44",
  },
  {
    code: "PT", name: "Portugal", confederation: "UEFA",
    fifaRank: 7, eloRating: 1908,
    worldCupAppearances: 8, titles: 0, titleYears: [],
    runnerUps: 0, thirdPlaces: 1,
    totalMatches: 36, wins: 16, draws: 8, losses: 12,
    goalsFor: 56, goalsAgainst: 44, cleanSheets: 14,
    squadValue: 870, avgPlayerRating: 83.9,
    formRating: 84, attackRating: 87, defenseRating: 79, midfieldRating: 84,
    legendaryPlayers: ["Eusébio", "Luís Figo", "Cristiano Ronaldo", "Rui Costa", "Deco", "Pepe", "Bernardo Silva"],
    bestResult: "3rd Place", bestYear: 1966,
    manager: "Roberto Martínez",
    flag: "🇵🇹", primaryColor: "#006600", secondaryColor: "#FF0000",
  },
  {
    code: "HR", name: "Croatia", confederation: "UEFA",
    fifaRank: 10, eloRating: 1858,
    worldCupAppearances: 6, titles: 0, titleYears: [],
    runnerUps: 1, thirdPlaces: 2,
    totalMatches: 30, wins: 16, draws: 7, losses: 7,
    goalsFor: 50, goalsAgainst: 33, cleanSheets: 13,
    squadValue: 420, avgPlayerRating: 81.4,
    formRating: 76, attackRating: 78, defenseRating: 82, midfieldRating: 85,
    legendaryPlayers: ["Davor Šuker", "Luka Modrić", "Ivan Rakitić", "Mario Mandžukić", "Ivan Perišić", "Zvonimir Boban"],
    bestResult: "Runner-up", bestYear: 2018,
    manager: "Zlatko Dalić",
    flag: "🇭🇷", primaryColor: "#FF0000", secondaryColor: "#FFFFFF",
  },
  {
    code: "BE", name: "Belgium", confederation: "UEFA",
    fifaRank: 8, eloRating: 1894,
    worldCupAppearances: 14, titles: 0, titleYears: [],
    runnerUps: 0, thirdPlaces: 1,
    totalMatches: 56, wins: 23, draws: 13, losses: 20,
    goalsFor: 80, goalsAgainst: 70, cleanSheets: 18,
    squadValue: 690, avgPlayerRating: 83.1,
    formRating: 79, attackRating: 85, defenseRating: 78, midfieldRating: 82,
    legendaryPlayers: ["Paul Van Himst", "Enzo Scifo", "Marc Wilmots", "Eden Hazard", "Kevin De Bruyne", "Romelu Lukaku", "Thibaut Courtois"],
    bestResult: "3rd Place", bestYear: 2018,
    manager: "Domenico Tedesco",
    flag: "🇧🇪", primaryColor: "#FFD700", secondaryColor: "#000000",
  },
  {
    code: "MA", name: "Morocco", confederation: "CAF",
    fifaRank: 13, eloRating: 1832,
    worldCupAppearances: 6, titles: 0, titleYears: [],
    runnerUps: 0, thirdPlaces: 0,
    totalMatches: 22, wins: 7, draws: 7, losses: 8,
    goalsFor: 22, goalsAgainst: 28, cleanSheets: 8,
    squadValue: 320, avgPlayerRating: 79.8,
    formRating: 80, attackRating: 78, defenseRating: 85, midfieldRating: 79,
    legendaryPlayers: ["Noureddine Naybet", "Mustapha Hadji", "Achraf Hakimi", "Hakim Ziyech", "Sofyan Amrabat", "Yassine Bounou"],
    bestResult: "4th Place", bestYear: 2022,
    manager: "Walid Regragui",
    flag: "🇲🇦", primaryColor: "#C1272D", secondaryColor: "#006233",
  },
  {
    code: "MX", name: "Mexico", confederation: "CONCACAF",
    fifaRank: 17, eloRating: 1801,
    worldCupAppearances: 17, titles: 0, titleYears: [],
    runnerUps: 0, thirdPlaces: 0,
    totalMatches: 60, wins: 16, draws: 16, losses: 28,
    goalsFor: 60, goalsAgainst: 92, cleanSheets: 16,
    squadValue: 220, avgPlayerRating: 77.5,
    formRating: 68, attackRating: 75, defenseRating: 72, midfieldRating: 76,
    legendaryPlayers: ["Hugo Sánchez", "Cuauhtémoc Blanco", "Rafael Márquez", "Javier Hernández", "Jorge Campos", "Claudio Suárez"],
    bestResult: "Quarter-finals", bestYear: 1970,
    manager: "Javier Aguirre",
    flag: "🇲🇽", primaryColor: "#006847", secondaryColor: "#CE1126",
  },
  {
    code: "US", name: "United States", confederation: "CONCACAF",
    fifaRank: 16, eloRating: 1812,
    worldCupAppearances: 11, titles: 0, titleYears: [],
    runnerUps: 0, thirdPlaces: 1,
    totalMatches: 36, wins: 8, draws: 8, losses: 20,
    goalsFor: 35, goalsAgainst: 60, cleanSheets: 12,
    squadValue: 280, avgPlayerRating: 78.2,
    formRating: 74, attackRating: 79, defenseRating: 75, midfieldRating: 76,
    legendaryPlayers: ["Landon Donovan", "Clint Dempsey", "Tim Howard", "Brian McBride", "Christian Pulisic", "Michael Bradley"],
    bestResult: "3rd Place", bestYear: 1930,
    manager: "Mauricio Pochettino",
    flag: "🇺🇸", primaryColor: "#BF0A30", secondaryColor: "#002868",
  },
  {
    code: "JP", name: "Japan", confederation: "AFC",
    fifaRank: 18, eloRating: 1798,
    worldCupAppearances: 7, titles: 0, titleYears: [],
    runnerUps: 0, thirdPlaces: 0,
    totalMatches: 28, wins: 9, draws: 7, losses: 12,
    goalsFor: 32, goalsAgainst: 40, cleanSheets: 10,
    squadValue: 260, avgPlayerRating: 78.6,
    formRating: 81, attackRating: 80, defenseRating: 75, midfieldRating: 80,
    legendaryPlayers: ["Hidetoshi Nakata", "Shunsuke Nakamura", "Keisuke Honda", "Kagawa Shinji", "Takefusa Kubo", "Wataru Endo"],
    bestResult: "Round of 16", bestYear: 2002,
    manager: "Hajime Moriyasu",
    flag: "🇯🇵", primaryColor: "#BC002D", secondaryColor: "#FFFFFF",
  },
  {
    code: "KR", name: "South Korea", confederation: "AFC",
    fifaRank: 23, eloRating: 1768,
    worldCupAppearances: 11, titles: 0, titleYears: [],
    runnerUps: 0, thirdPlaces: 0,
    totalMatches: 38, wins: 7, draws: 10, losses: 21,
    goalsFor: 35, goalsAgainst: 70, cleanSheets: 8,
    squadValue: 180, avgPlayerRating: 76.4,
    formRating: 72, attackRating: 76, defenseRating: 71, midfieldRating: 74,
    legendaryPlayers: ["Hong Myung-bo", "Park Ji-sung", "Lee Woon-jae", "Son Heung-min", "Cha Bum-kun", "Hwang Sun-hong"],
    bestResult: "4th Place", bestYear: 2002,
    manager: "Hong Myung-bo",
    flag: "🇰🇷", primaryColor: "#CD2E3A", secondaryColor: "#0047A0",
  },
];

export function getTeamByCode(code: string): TeamProfile | undefined {
  return teams.find((t) => t.code === code);
}

export function getAllTeams(): TeamProfile[] {
  return [...teams].sort((a, b) => a.fifaRank - b.fifaRank);
}
