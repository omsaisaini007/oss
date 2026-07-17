// Prediction Engine
// Combines ELO ratings, FIFA rankings, historical performance, squad value,
// and team form into a single win probability forecast.
// Implements a logistic regression-style model inspired by FiveThirtyEight.

import { teams, TeamProfile } from "./data/teams";
import { tournaments } from "./data/tournaments";

export interface PredictionFactor {
  name: string;
  value: number; // 0-1 normalized
  weight: number; // 0-1
}

export interface TeamPrediction {
  team: TeamProfile;
  winProbability: number; // percentage 0-100
  runnerUpProbability: number;
  semifinalProbability: number;
  factors: PredictionFactor[];
  eloTrend: number; // recent change in ELO
  expectedFinish: string; // human-readable
}

// Logistic transform
function logistic(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

// Get historical performance weight: weighted average of last 5 WCs
function historicalPerformance(team: TeamProfile): number {
  const years = [2018, 2014, 2010, 2006, 2002];
  let total = 0;
  let weightSum = 0;
  for (let i = 0; i < years.length; i++) {
    const year = years[i];
    const tournament = tournaments.find((t) => t.year === year);
    if (!tournament) continue;

    const weight = 1 - i * 0.18; // recent tournaments weigh more
    let perf = 0;
    if (tournament.winner === team.name) perf = 1.0;
    else if (tournament.runnerUp === team.name) perf = 0.85;
    else if (tournament.thirdPlace === team.name) perf = 0.75;
    else if (tournament.fourthPlace === team.name) perf = 0.7;
    else perf = 0.4; // participated

    // Bonus for having participated
    const appearances = team.worldCupAppearances;
    const appearanceBonus = Math.min(appearances / 22, 1) * 0.2;

    total += (perf * 0.8 + appearanceBonus * 0.2) * weight;
    weightSum += weight;
  }
  return weightSum > 0 ? total / weightSum : 0.3;
}

// Generate forecast for the next World Cup
export function generatePredictions(): TeamPrediction[] {
  const predictions: TeamPrediction[] = teams.map((team) => {
    // ELO factor (normalized 1400-2100 → 0-1)
    const eloFactor = Math.max(0, Math.min(1, (team.eloRating - 1500) / 600));

    // FIFA rank factor (rank 1-100 → 1-0)
    const rankFactor = Math.max(0, Math.min(1, 1 - (team.fifaRank - 1) / 100));

    // Historical performance
    const histFactor = historicalPerformance(team);

    // Squad value factor (0-1500M → 0-1)
    const valueFactor = Math.min(1, team.squadValue / 1200);

    // Form rating (0-100 → 0-1)
    const formFactor = team.formRating / 100;

    // Attack/defense/midfield average
    const strengthFactor = (team.attackRating + team.defenseRating + team.midfieldRating) / 300;

    // Title experience bonus
    const titleBonus = Math.min(team.titles * 0.05, 0.25);

    // Combined score
    const combinedScore =
      eloFactor * 0.28 +
      rankFactor * 0.15 +
      histFactor * 0.20 +
      valueFactor * 0.08 +
      formFactor * 0.15 +
      strengthFactor * 0.14 +
      titleBonus;

    // Apply logistic transformation with saturation
    const rawProb = logistic((combinedScore - 0.65) * 6);

    const factors: PredictionFactor[] = [
      { name: "ELO Rating", value: eloFactor, weight: 0.28 },
      { name: "FIFA Rank", value: rankFactor, weight: 0.15 },
      { name: "Historical WC Performance", value: histFactor, weight: 0.20 },
      { name: "Squad Value", value: valueFactor, weight: 0.08 },
      { name: "Recent Form", value: formFactor, weight: 0.15 },
      { name: "Squad Strength", value: strengthFactor, weight: 0.14 },
    ];

    return {
      team,
      winProbability: rawProb,
      runnerUpProbability: 0,
      semifinalProbability: 0,
      factors,
      eloTrend: (Math.random() - 0.5) * 40,
      expectedFinish: "",
    };
  });

  // Normalize probabilities to sum to 100%
  const totalRaw = predictions.reduce((sum, p) => sum + p.winProbability, 0);
  predictions.forEach((p) => {
    p.winProbability = (p.winProbability / totalRaw) * 100;
  });

  // Derive runner-up and semi-final probabilities (proportional but lower)
  predictions.forEach((p) => {
    p.runnerUpProbability = p.winProbability * 0.55;
    p.semifinalProbability = p.winProbability * 1.4;
  });

  // Normalize runner-up to 100%
  const totalRunnerUp = predictions.reduce((sum, p) => sum + p.runnerUpProbability, 0);
  predictions.forEach((p) => {
    p.runnerUpProbability = (p.runnerUpProbability / totalRunnerUp) * 100;
  });

  // Normalize semifinal
  const totalSemis = predictions.reduce((sum, p) => sum + p.semifinalProbability, 0);
  predictions.forEach((p) => {
    p.semifinalProbability = Math.min(100, (p.semifinalProbability / totalSemis) * 100 * 4);
  });

  // Sort by win probability descending
  predictions.sort((a, b) => b.winProbability - a.winProbability);

  // Expected finish (string)
  predictions.forEach((p, i) => {
    if (i === 0) p.expectedFinish = "Champion";
    else if (i === 1) p.expectedFinish = "Runner-up";
    else if (i <= 3) p.expectedFinish = "Semifinalist";
    else if (i <= 7) p.expectedFinish = "Quarterfinalist";
    else if (i <= 15) p.expectedFinish = "Round of 16";
    else p.expectedFinish = "Group Stage";
  });

  return predictions;
}

// Head-to-head prediction (single match)
export interface H2HResult {
  teamA: TeamProfile;
  teamB: TeamProfile;
  winProbA: number; // %
  winProbB: number; // %
  drawProb: number;
  expectedScoreA: number;
  expectedScoreB: number;
  historicalMeetings: number;
  historicalSummary: string;
  tacticalStrengths: { team: string; strengths: string[]; weaknesses: string[] }[];
  aiInsight: string;
  // (kept under this name for backward compatibility — serves as fallback
  // when the live match-insight endpoint is unavailable)
}

export function predictHeadToHead(teamA: TeamProfile, teamB: TeamProfile): H2HResult {
  // Compute "power" for each team
  const powerA =
    teamA.eloRating * 0.35 +
    teamA.formRating * 4 +
    teamA.attackRating * 2.5 +
    teamA.defenseRating * 2.5 +
    teamA.midfieldRating * 1.5 +
    teamA.titles * 25;

  const powerB =
    teamB.eloRating * 0.35 +
    teamB.formRating * 4 +
    teamB.attackRating * 2.5 +
    teamB.defenseRating * 2.5 +
    teamB.midfieldRating * 1.5 +
    teamB.titles * 25;

  const total = powerA + powerB;
  const aRatio = powerA / total;

  // Logistic on ELO diff for more realistic distribution
  const eloDiff = teamA.eloRating - teamB.eloRating;
  const eloExpected = logistic(eloDiff / 200); // 0-1

  // Blend
  const blendedA = aRatio * 0.5 + eloExpected * 0.5;

  // Distribute among A-win, B-win, draw (draw prob inversely related to diff)
  const winProbA = blendedA * (1 - 0.18);
  const winProbB = (1 - blendedA) * (1 - 0.18);
  const drawProb = 0.18;

  // Expected goals (Poisson-like means)
  const attackDiff = teamA.attackRating - teamB.defenseRating;
  const expectedScoreA = Math.max(0.3, Math.min(4.5, 1.4 + attackDiff * 0.015));
  const expectedScoreB = Math.max(0.3, Math.min(4.5, 1.4 + (teamB.attackRating - teamA.defenseRating) * 0.015));

  // Historical meetings (mock based on appearances)
  const historicalMeetings = Math.floor(Math.abs(teamA.worldCupAppearances + teamB.worldCupAppearances) / 4) + 2;

  let historicalSummary: string;
  if (teamA.titles > teamB.titles) {
    historicalSummary = `${teamA.name} has historically been more successful (${teamA.titles} titles vs ${teamB.titles})`;
  } else if (teamB.titles > teamA.titles) {
    historicalSummary = `${teamB.name} has historically been more successful (${teamB.titles} titles vs ${teamA.titles})`;
  } else {
    historicalSummary = `${teamA.name} and ${teamB.name} have similar historical pedigree.`;
  }

  // Tactical strengths based on ratings
  const tacticalStrengths = [
    {
      team: teamA.name,
      strengths: deriveStrengths(teamA),
      weaknesses: deriveWeaknesses(teamA),
    },
    {
      team: teamB.name,
      strengths: deriveStrengths(teamB),
      weaknesses: deriveWeaknesses(teamB),
    },
  ];

  const aiInsight = generateH2HInsight(teamA, teamB, winProbA, winProbB, expectedScoreA, expectedScoreB);

  return {
    teamA,
    teamB,
    winProbA: winProbA * 100,
    winProbB: winProbB * 100,
    drawProb: drawProb * 100,
    expectedScoreA,
    expectedScoreB,
    historicalMeetings,
    historicalSummary,
    tacticalStrengths,
    aiInsight,
  };
}

function deriveStrengths(team: TeamProfile): string[] {
  const s: string[] = [];
  if (team.attackRating >= 88) s.push("Lethal attacking unit");
  if (team.midfieldRating >= 85) s.push("Midfield dominance");
  if (team.defenseRating >= 82) s.push("Solid defensive structure");
  if (team.formRating >= 85) s.push("Excellent recent form");
  if (team.titles >= 2) s.push("Big-tournament pedigree");
  if (team.squadValue >= 800) s.push("Elite squad depth");
  if (s.length === 0) s.push("Balanced squad");
  return s.slice(0, 3);
}

function deriveWeaknesses(team: TeamProfile): string[] {
  const w: string[] = [];
  if (team.attackRating < 80) w.push("Goal-scoring concerns");
  if (team.midfieldRating < 80) w.push("Midfield control issues");
  if (team.defenseRating < 78) w.push("Defensive vulnerabilities");
  if (team.formRating < 75) w.push("Inconsistent form");
  if (team.titles === 0) w.push("Lack of WC-winning experience");
  if (team.fifaRank > 12) w.push("Lower FIFA ranking");
  if (w.length === 0) w.push("Few observable weaknesses");
  return w.slice(0, 2);
}

function generateH2HInsight(
  a: TeamProfile,
  b: TeamProfile,
  probA: number,
  probB: number,
  scoreA: number,
  scoreB: number
): string {
  const favored = probA > probB ? a.name : b.name;
  const margin = Math.abs(probA - probB);
  let strength: string;
  if (margin > 25) strength = "strongly favored";
  else if (margin > 12) strength = "favored";
  else if (margin > 5) strength = "slightly favored";
  else strength = "evenly matched against";

  return `${a.name} is ${strength} ${b.name}. The prediction model expects a ${scoreA.toFixed(1)}–${scoreB.toFixed(1)} scoreline based on squad value, recent form, ELO ratings, and historical World Cup pedigree. ${favored}'s combined metrics suggest a ${Math.max(probA, probB).toFixed(1)}% chance of victory, but knockout-stage variance and in-tournament form can heavily influence the actual outcome.`;
}

// Historical trend analysis
export interface TrendAnalysis {
  hostAdvantage: number; // % of hosts reaching semi-finals
  defendingChampionPerformance: string;
  continentalDominance: { continent: string; titles: number; percentage: number }[];
  goalScoringTrend: { year: number; avgGoals: number }[];
  ageOfChampions: { year: number; avgAge: number }[];
  mostSuccessfulManagers: { name: string; titles: number; country: string }[];
}

export function analyzeTrends(): TrendAnalysis {
  // Hosts reaching semi-finals (historical)
  let hostsInSemis = 0;
  let totalConsidered = 0;
  tournaments.forEach((t) => {
    if (t.year === 2026) return;
    totalConsidered++;
    const hostNation = t.host.split(" / ")[0];
    if (
      t.winner === hostNation ||
      t.runnerUp === hostNation ||
      t.thirdPlace === hostNation ||
      t.fourthPlace === hostNation
    ) {
      hostsInSemis++;
    }
  });
  const hostAdvantage = (hostsInSemis / totalConsidered) * 100;

  // Defending champions performance
  const defendingChampionPerformance =
    "Defending champions have a mixed record: only Italy (1934-38) and Brazil (1958-62) successfully defended their title. Recent defending champions (2010 Italy, 2014 Spain, 2018 Germany, 2022 France finalists) have often underperformed, failing to reach semifinals in 4 of the last 6 tournaments.";

  // Continental dominance
  const continentCount: Record<string, number> = {};
  tournaments.forEach((t) => {
    if (t.year === 2026) return;
    const winner = teams.find((team) => team.name === t.winner);
    if (winner) {
      continentCount[winner.confederation] = (continentCount[winner.confederation] || 0) + 1;
    }
  });
  const totalTitles = Object.values(continentCount).reduce((a, b) => a + b, 0);
  const continentalDominance = Object.entries(continentCount)
    .map(([continent, titles]) => ({
      continent,
      titles,
      percentage: (titles / totalTitles) * 100,
    }))
    .sort((a, b) => b.titles - a.titles);

  // Goal scoring trend
  const goalScoringTrend = tournaments
    .filter((t) => t.year !== 2026)
    .map((t) => ({ year: t.year, avgGoals: t.avgGoals }));

  // Age of champions (mock realistic)
  const ageOfChampions = [
    { year: 1990, avgAge: 27.8 },
    { year: 1994, avgAge: 27.9 },
    { year: 1998, avgAge: 27.6 },
    { year: 2002, avgAge: 27.4 },
    { year: 2006, avgAge: 28.2 },
    { year: 2010, avgAge: 27.1 },
    { year: 2014, avgAge: 27.5 },
    { year: 2018, avgAge: 26.9 },
    { year: 2022, avgAge: 27.3 },
  ];

  const mostSuccessfulManagers = [
    { name: "Vittorio Pozzo", titles: 2, country: "Italy" },
    { name: "Carlos Bilardo", titles: 1, country: "Argentina" },
    { name: "César Luis Menotti", titles: 1, country: "Argentina" },
    { name: "Luiz Felipe Scolari", titles: 1, country: "Brazil" },
    { name: "Carlos Alberto Parreira", titles: 1, country: "Brazil" },
    { name: "Mário Zagallo", titles: 1, country: "Brazil" },
    { name: "Franz Beckenbauer", titles: 1, country: "Germany" },
    { name: "Joachim Löw", titles: 1, country: "Germany" },
    { name: "Didier Deschamps", titles: 1, country: "France" },
    { name: "Marcello Lippi", titles: 1, country: "Italy" },
  ];

  return {
    hostAdvantage,
    defendingChampionPerformance,
    continentalDominance,
    goalScoringTrend,
    ageOfChampions,
    mostSuccessfulManagers,
  };
}
