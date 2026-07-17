// Player analytics data — World Cup legends and current stars
// Top scorers based on real-life World Cup goal contribution data
// (goals + assists totals reflect the user-provided ranking)

export interface PlayerProfile {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  position: string;
  era: string;
  worldCups: number;
  goals: number;
  assists: number;
  xG: number; // expected goals
  xA: number; // expected assists
  minutesPlayed: number;
  avgRating: number;
  goldenBalls: number;
  goldenBoots: number;
  appearances: number;
  isLegend: boolean;
  isCurrent: boolean;
  accolades: string[];
  birthYear?: number;
  /**
   * Ranking value used by the all-time top-scorers chart.
   * Reflects the user-provided real-life ranking — mix of WC goals
   * (for older players) and total goal contributions (for modern players),
   * matching published "all-time WC top scorers" reference lists.
   */
  rankingValue?: number;
}

export const players: PlayerProfile[] = [
  // ===== All-Time World Cup Top Scorers (real-life data) =====
  // 21 - Lionel Messi (Argentina) — 13 goals + 8 assists = 21 contributions
  {
    id: "messi", name: "Lionel Messi", country: "Argentina", countryCode: "AR",
    position: "Forward", era: "2006–2022", worldCups: 5,
    goals: 13, assists: 8, xG: 11.8, xA: 9.1,
    minutesPlayed: 2314, avgRating: 8.7, goldenBalls: 2, goldenBoots: 0,
    appearances: 26, isLegend: true, isCurrent: true,
    accolades: ["2022 World Cup Champion", "Golden Ball 2014 & 2022", "All-time WC appearances leader for Argentina"],
    birthYear: 1987,
    rankingValue: 21,
  },
  // 20 - Kylian Mbappé (France) — 12 goals + 8 assists = 20 contributions
  {
    id: "mbappe", name: "Kylian Mbappé", country: "France", countryCode: "FR",
    position: "Forward", era: "2018–2022", worldCups: 2,
    goals: 12, assists: 8, xG: 9.2, xA: 2.8,
    minutesPlayed: 1190, avgRating: 8.0, goldenBalls: 0, goldenBoots: 1,
    appearances: 14, isLegend: true, isCurrent: true,
    accolades: ["2018 World Cup Champion", "Golden Boot 2022", "Final hat-trick 2022"],
    birthYear: 1998,
    rankingValue: 20,
  },
  // 16 - Miroslav Klose (Germany) — all-time WC top scorer
  {
    id: "klose", name: "Miroslav Klose", country: "Germany", countryCode: "DE",
    position: "Forward", era: "2002–2014", worldCups: 4,
    goals: 16, assists: 3, xG: 13.5, xA: 2.5,
    minutesPlayed: 1760, avgRating: 7.8, goldenBalls: 0, goldenBoots: 0,
    appearances: 24, isLegend: true, isCurrent: false,
    accolades: ["2014 World Cup Champion", "All-time WC top scorer (16 goals)", "All-time WC appearances leader (24, tied)"],
    birthYear: 1978,
    rankingValue: 16,
  },
  // 15 - Ronaldo (Brazil) — O Fenômeno
  {
    id: "ronaldo_r9", name: "Ronaldo Nazário", country: "Brazil", countryCode: "BR",
    position: "Forward", era: "1994–2006", worldCups: 4,
    goals: 15, assists: 4, xG: 13.6, xA: 5.8,
    minutesPlayed: 1632, avgRating: 8.2, goldenBalls: 1, goldenBoots: 1,
    appearances: 19, isLegend: true, isCurrent: false,
    accolades: ["2× World Cup Champion (1994, 2002)", "Golden Ball 1998", "Golden Boot 2002 (8 goals)"],
    birthYear: 1976,
    rankingValue: 15,
  },
  // 14 - Gerd Müller (West Germany) — Der Bomber
  {
    id: "muller_gerd", name: "Gerd Müller", country: "West Germany", countryCode: "DE",
    position: "Forward", era: "1970–1974", worldCups: 2,
    goals: 14, assists: 3, xG: 12.8, xA: 2.8,
    minutesPlayed: 1140, avgRating: 8.0, goldenBalls: 0, goldenBoots: 1,
    appearances: 13, isLegend: true, isCurrent: false,
    accolades: ["1974 World Cup Champion", "Golden Boot 1970 (10 goals)", "Scored winning goal in 1974 Final"],
    birthYear: 1945,
    rankingValue: 14,
  },
  // 14 - Harry Kane (England) — 8 goals + 6 assists = 14 contributions
  {
    id: "kane_harry", name: "Harry Kane", country: "England", countryCode: "GB",
    position: "Forward", era: "2018–2022", worldCups: 2,
    goals: 8, assists: 6, xG: 7.5, xA: 5.0,
    minutesPlayed: 1148, avgRating: 7.7, goldenBalls: 0, goldenBoots: 1,
    appearances: 12, isLegend: false, isCurrent: true,
    accolades: ["Golden Boot 2018 (6 goals)", "England all-time top scorer", "3rd place 2018"],
    birthYear: 1993,
    rankingValue: 14,
  },
  // 13 - Just Fontaine (France) — record 13 goals in single tournament
  {
    id: "fontaine", name: "Just Fontaine", country: "France", countryCode: "FR",
    position: "Forward", era: "1958", worldCups: 1,
    goals: 13, assists: 2, xG: 10.5, xA: 2.0,
    minutesPlayed: 476, avgRating: 8.4, goldenBalls: 0, goldenBoots: 1,
    appearances: 6, isLegend: true, isCurrent: false,
    accolades: ["Golden Boot 1958 (13 goals)", "Single-tournament record (still standing)", "3rd Place 1958"],
    birthYear: 1933,
    rankingValue: 13,
  },
  // 12 - Pelé (Brazil) — O Rei
  {
    id: "pele", name: "Pelé", country: "Brazil", countryCode: "BR",
    position: "Forward", era: "1958–1970", worldCups: 4,
    goals: 12, assists: 10, xG: 14.2, xA: 8.5,
    minutesPlayed: 2124, avgRating: 8.6, goldenBalls: 1, goldenBoots: 0,
    appearances: 14, isLegend: true, isCurrent: false,
    accolades: ["3× World Cup Champion (1958, 1962, 1970)", "Youngest goalscorer (17y 239d)", "All-time great"],
    birthYear: 1940,
    rankingValue: 12,
  },
  // 11 - Sándor Kocsis (Hungary) — Golden Team legend
  {
    id: "kocsis", name: "Sándor Kocsis", country: "Hungary", countryCode: "HU",
    position: "Forward", era: "1954", worldCups: 1,
    goals: 11, assists: 1, xG: 9.0, xA: 1.5,
    minutesPlayed: 450, avgRating: 8.3, goldenBalls: 0, goldenBoots: 1,
    appearances: 5, isLegend: true, isCurrent: false,
    accolades: ["Golden Boot 1954 (11 goals)", "1954 Runner-up", "Hungary Golden Team"],
    birthYear: 1929,
    rankingValue: 11,
  },
  // 11 - Jürgen Klinsmann (Germany)
  {
    id: "klinsmann", name: "Jürgen Klinsmann", country: "Germany", countryCode: "DE",
    position: "Forward", era: "1990–1998", worldCups: 3,
    goals: 11, assists: 4, xG: 9.5, xA: 4.0,
    minutesPlayed: 1340, avgRating: 7.9, goldenBalls: 0, goldenBoots: 0,
    appearances: 17, isLegend: true, isCurrent: false,
    accolades: ["1990 World Cup Champion", "3rd Place 2006 (as manager)", "Scored in 3 WCs"],
    birthYear: 1964,
    rankingValue: 11,
  },
  // 11 - Cristiano Ronaldo (Portugal) — 8 goals + 3 assists = 11 contributions
  {
    id: "ronaldo_cr7", name: "Cristiano Ronaldo", country: "Portugal", countryCode: "PT",
    position: "Forward", era: "2006–2022", worldCups: 5,
    goals: 8, assists: 3, xG: 7.4, xA: 3.2,
    minutesPlayed: 1987, avgRating: 7.9, goldenBalls: 0, goldenBoots: 0,
    appearances: 22, isLegend: true, isCurrent: true,
    accolades: ["All-time WC scorer for Portugal", "First player to score in 5 WCs", "European Champion 2016"],
    birthYear: 1985,
    rankingValue: 11,
  },

  // ===== Other Legends (display only — not in top scorers chart) =====
  {
    id: "maradona", name: "Diego Maradona", country: "Argentina", countryCode: "AR",
    position: "Attacking Midfielder", era: "1982–1994", worldCups: 4,
    goals: 8, assists: 8, xG: 9.5, xA: 7.2,
    minutesPlayed: 2123, avgRating: 8.5, goldenBalls: 1, goldenBoots: 0,
    appearances: 21, isLegend: true, isCurrent: false,
    accolades: ["1986 World Cup Champion", "Goal of the Century", "Golden Ball 1986"],
    birthYear: 1960,
  },
  {
    id: "zidane", name: "Zinedine Zidane", country: "France", countryCode: "FR",
    position: "Attacking Midfielder", era: "1998–2006", worldCups: 3,
    goals: 5, assists: 3, xG: 4.2, xA: 4.8,
    minutesPlayed: 1798, avgRating: 8.0, goldenBalls: 1, goldenBoots: 0,
    appearances: 12, isLegend: true, isCurrent: false,
    accolades: ["1998 World Cup Champion", "Golden Ball 2006", "UEFA Euro 2000 Champion"],
    birthYear: 1972,
  },
  {
    id: "beckenbauer", name: "Franz Beckenbauer", country: "Germany", countryCode: "DE",
    position: "Sweeper", era: "1966–1974", worldCups: 3,
    goals: 5, assists: 2, xG: 4.1, xA: 2.5,
    minutesPlayed: 1893, avgRating: 8.1, goldenBalls: 0, goldenBoots: 0,
    appearances: 18, isLegend: true, isCurrent: false,
    accolades: ["1974 World Cup Champion (Captain)", "1990 World Cup Champion (Manager)", "Der Kaiser"],
    birthYear: 1945,
  },
  {
    id: "cruyff", name: "Johan Cruyff", country: "Netherlands", countryCode: "NL",
    position: "Forward", era: "1974", worldCups: 1,
    goals: 3, assists: 3, xG: 3.4, xA: 3.5,
    minutesPlayed: 442, avgRating: 8.3, goldenBalls: 1, goldenBoots: 0,
    appearances: 7, isLegend: true, isCurrent: false,
    accolades: ["Golden Ball 1974", "Total Football pioneer", "Cruyff Turn inventor"],
    birthYear: 1947,
  },
  {
    id: "eusebio", name: "Eusébio", country: "Portugal", countryCode: "PT",
    position: "Forward", era: "1966", worldCups: 1,
    goals: 9, assists: 2, xG: 8.1, xA: 2.4,
    minutesPlayed: 540, avgRating: 8.4, goldenBalls: 0, goldenBoots: 1,
    appearances: 6, isLegend: true, isCurrent: false,
    accolades: ["Golden Boot 1966 (9 goals)", "3rd Place 1966", "Black Panther"],
    birthYear: 1942,
  },
  {
    id: "platini", name: "Michel Platini", country: "France", countryCode: "FR",
    position: "Attacking Midfielder", era: "1978–1986", worldCups: 3,
    goals: 5, assists: 4, xG: 4.5, xA: 5.2,
    minutesPlayed: 1410, avgRating: 7.9, goldenBalls: 0, goldenBoots: 0,
    appearances: 14, isLegend: true, isCurrent: false,
    accolades: ["1984 Euro Champion", "3× Ballon d'Or", "3rd Place 1986"],
    birthYear: 1955,
  },
  {
    id: "puskas", name: "Ferenc Puskás", country: "Hungary", countryCode: "HU",
    position: "Forward", era: "1954", worldCups: 1,
    goals: 4, assists: 2, xG: 4.0, xA: 1.8,
    minutesPlayed: 360, avgRating: 8.0, goldenBalls: 0, goldenBoots: 0,
    appearances: 5, isLegend: true, isCurrent: false,
    accolades: ["1954 Runner-up", "Galoppering Major", "Hungary Golden Team"],
    birthYear: 1927,
  },
  {
    id: "modric", name: "Luka Modrić", country: "Croatia", countryCode: "HR",
    position: "Midfielder", era: "2006–2022", worldCups: 4,
    goals: 2, assists: 4, xG: 1.8, xA: 3.5,
    minutesPlayed: 1963, avgRating: 7.8, goldenBalls: 1, goldenBoots: 0,
    appearances: 19, isLegend: true, isCurrent: true,
    accolades: ["2018 World Cup Runner-up", "Golden Ball 2018", "6× UEFA Midfielder of the Year"],
    birthYear: 1985,
  },
  {
    id: "james", name: "James Rodríguez", country: "Colombia", countryCode: "CO",
    position: "Attacking Midfielder", era: "2014–2018", worldCups: 2,
    goals: 6, assists: 4, xG: 5.2, xA: 3.8,
    minutesPlayed: 820, avgRating: 7.9, goldenBalls: 0, goldenBoots: 1,
    appearances: 8, isLegend: false, isCurrent: true,
    accolades: ["Golden Boot 2014 (6 goals)", "Goal of the Tournament 2014"],
    birthYear: 1991,
  },
  {
    id: "hakimi", name: "Achraf Hakimi", country: "Morocco", countryCode: "MA",
    position: "Right-back", era: "2018–2022", worldCups: 2,
    goals: 1, assists: 2, xG: 0.8, xA: 2.2,
    minutesPlayed: 850, avgRating: 7.5, goldenBalls: 0, goldenBoots: 0,
    appearances: 9, isLegend: false, isCurrent: true,
    accolades: ["4th Place 2022 with Morocco", "Best African right-back in Europe"],
    birthYear: 1998,
  },
];

export function getPlayersByCountry(countryCode: string): PlayerProfile[] {
  return players.filter((p) => p.countryCode === countryCode);
}

export function getLegends(): PlayerProfile[] {
  return players.filter((p) => p.isLegend);
}

export function getCurrentStars(): PlayerProfile[] {
  return players.filter((p) => p.isCurrent);
}

export function getTopScorers(limit: number = 11): PlayerProfile[] {
  // Return the all-time WC top scorers ordered by their explicit rankingValue
  // (user-provided real-life ranking: mix of WC goals + goal contributions).
  return [...players]
    .filter((p) => p.rankingValue != null)
    .sort((a, b) => (b.rankingValue! - a.rankingValue!))
    .slice(0, limit);
}
