// Monte Carlo World Cup Simulator
// Simulates a tournament thousands of times using team ELO ratings and
// Poisson-distributed goal scoring, then aggregates the results.
//
// Performance: Uses chunked async execution so the UI thread is not blocked.
// A batch of N simulations runs per tick, then yields to the event loop so
// the progress bar can update and the page stays responsive.

import { teams, TeamProfile } from "./data/teams";
import { getTeamByCode } from "./data/teams";

// Seedable pseudo-random generator (Mulberry32) for reproducibility
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Poisson sample — fast Knuth algorithm
function poisson(lambda: number, rng: () => number): number {
  if (lambda <= 0) return 0;
  const L = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  do {
    k++;
    p *= rng();
  } while (p > L);
  return k - 1;
}

interface MatchResult {
  teamA: string;
  teamB: string;
  goalsA: number;
  goalsB: number;
  winner: string | null;
  isGroupStage: boolean;
}

interface SimulationResult {
  champion: string;
  runnerUp: string;
  semifinalists: string[];
  quarterfinalists: string[];
  totalGoals: number;
  matchLog: MatchResult[];
}

function simulateMatch(
  teamA: TeamProfile,
  teamB: TeamProfile,
  rng: () => number
): MatchResult {
  // Expected goals — derived from attack vs defense ratings + ELO differential
  const baseA = 1.3 + ((teamA.attackRating - teamB.defenseRating) / 100) * 0.7;
  const baseB = 1.3 + ((teamB.attackRating - teamA.defenseRating) / 100) * 0.7;
  const eloAdjustmentA = (teamA.eloRating - teamB.eloRating) / 200;
  const lambdaA = Math.max(0.2, baseA + eloAdjustmentA * 0.15);
  const lambdaB = Math.max(0.2, baseB - eloAdjustmentA * 0.15);

  const goalsA = poisson(lambdaA, rng);
  const goalsB = poisson(lambdaB, rng);

  let winner: string | null = null;
  if (goalsA > goalsB) winner = teamA.code;
  else if (goalsB > goalsA) winner = teamB.code;
  else {
    // Penalty shootout — slight ELO advantage
    const eloExp = 1 / (1 + Math.pow(10, (teamB.eloRating - teamA.eloRating) / 400));
    winner = rng() < eloExp ? teamA.code : teamB.code;
  }

  return { teamA: teamA.code, teamB: teamB.code, goalsA, goalsB, winner, isGroupStage: false };
}

// Build a representative tournament bracket.
// Top teams by ELO (with noise for group-stage variability) → single-elimination.
function selectTournamentField(year: number): TeamProfile[] {
  const sorted = [...teams].sort((a, b) => b.eloRating - a.eloRating);
  if (year >= 1998) return sorted.slice(0, Math.min(sorted.length, 32));
  if (year >= 1982) return sorted.slice(0, Math.min(sorted.length, 24));
  if (year >= 1934) return sorted.slice(0, Math.min(sorted.length, 16));
  return sorted.slice(0, 13);
}

function shuffleArray<T>(arr: T[], rng: () => number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Run a single tournament simulation
function simulateTournament(field: TeamProfile[], rng: () => number): SimulationResult {
  // Seed with noise to add group-stage-like variability
  const seeded = shuffleArray(field, rng).sort((a, b) => {
    const noiseA = (rng() - 0.5) * 120;
    const noiseB = (rng() - 0.5) * 120;
    return b.eloRating + noiseB - (a.eloRating + noiseA);
  });

  // Truncate to nearest power of 2 (don't pad — duplicates would let a
  // team play itself, skewing simulation results).
  const bracketSize = Math.pow(2, Math.floor(Math.log2(Math.max(2, seeded.length))));
  const bracket = seeded.slice(0, bracketSize);

  const matchLog: MatchResult[] = [];
  let round = bracket;
  const semifinalists: string[] = [];
  const quarterfinalists: string[] = [];

  while (round.length > 1) {
    const nextRound: TeamProfile[] = [];
    for (let i = 0; i < round.length; i += 2) {
      const teamA = round[i];
      const teamB = round[i + 1] || round[i];
      const result = simulateMatch(teamA, teamB, rng);
      matchLog.push(result);

      const winnerCode = result.winner || teamA.code;
      const winner = winnerCode === teamA.code ? teamA : teamB;
      nextRound.push(winner);

      const loser = winnerCode === teamA.code ? teamB : teamA;
      if (round.length === 4) semifinalists.push(loser.code);
      if (round.length === 8) quarterfinalists.push(loser.code);
    }
    round = nextRound;
  }

  const champion = round[0].code;
  const runnerUp = semifinalists[semifinalists.length - 1] || round[0].code;

  return {
    champion,
    runnerUp,
    semifinalists: semifinalists.slice(0, 2),
    quarterfinalists,
    totalGoals: matchLog.reduce((sum, m) => sum + m.goalsA + m.goalsB, 0),
    matchLog,
  };
}

export interface SimulationSummary {
  iterations: number;
  championProbabilities: { team: TeamProfile; probability: number; titles: number }[];
  runnerUpProbabilities: { team: TeamProfile; probability: number }[];
  semifinalProbabilities: { team: TeamProfile; probability: number }[];
  avgGoalsPerMatch: number;
  mostLikelyFinal: { teamA: TeamProfile; teamB: TeamProfile; probability: number };
  executionTimeMs: number;
  sampleMatchLog?: MatchResult[];
}

// Synchronous core (used for small iteration counts)
export function runMonteCarlo(
  year: number,
  iterations: number,
  seed: number = Date.now()
): SimulationSummary {
  const startTime = performance.now();
  const rng = mulberry32(seed);
  const field = selectTournamentField(year);

  const championCount = new Map<string, number>();
  const runnerUpCount = new Map<string, number>();
  const semifinalCount = new Map<string, number>();
  let totalGoalsAcrossAll = 0;
  let totalMatches = 0;
  let sampleMatchLog: MatchResult[] | undefined;

  for (let i = 0; i < iterations; i++) {
    const result = simulateTournament(field, rng);
    championCount.set(result.champion, (championCount.get(result.champion) || 0) + 1);
    runnerUpCount.set(result.runnerUp, (runnerUpCount.get(result.runnerUp) || 0) + 1);
    result.semifinalists.forEach((s) => {
      semifinalCount.set(s, (semifinalCount.get(s) || 0) + 1);
    });
    totalGoalsAcrossAll += result.totalGoals;
    totalMatches += result.matchLog.length;
    if (i === 0) sampleMatchLog = result.matchLog;
  }

  return buildSummary(
    iterations,
    championCount,
    runnerUpCount,
    semifinalCount,
    totalGoalsAcrossAll,
    totalMatches,
    sampleMatchLog,
    performance.now() - startTime
  );
}

// Async chunked version — yields to UI thread between batches so the
// progress bar can update and the page remains responsive.
export async function runMonteCarloAsync(
  year: number,
  iterations: number,
  onProgress: (pct: number) => void,
  seed: number = Date.now()
): Promise<SimulationSummary> {
  const startTime = performance.now();
  const rng = mulberry32(seed);
  const field = selectTournamentField(year);

  const championCount = new Map<string, number>();
  const runnerUpCount = new Map<string, number>();
  const semifinalCount = new Map<string, number>();
  let totalGoalsAcrossAll = 0;
  let totalMatches = 0;
  let sampleMatchLog: MatchResult[] | undefined;

  // Adaptive batch size: bigger batches for bigger runs = less overhead
  const batchSize = Math.max(100, Math.floor(iterations / 50));
  let completed = 0;

  while (completed < iterations) {
    const batchEnd = Math.min(completed + batchSize, iterations);
    for (let i = completed; i < batchEnd; i++) {
      const result = simulateTournament(field, rng);
      championCount.set(result.champion, (championCount.get(result.champion) || 0) + 1);
      runnerUpCount.set(result.runnerUp, (runnerUpCount.get(result.runnerUp) || 0) + 1);
      result.semifinalists.forEach((s) => {
        semifinalCount.set(s, (semifinalCount.get(s) || 0) + 1);
      });
      totalGoalsAcrossAll += result.totalGoals;
      totalMatches += result.matchLog.length;
      if (i === 0) sampleMatchLog = result.matchLog;
    }
    completed = batchEnd;
    onProgress(Math.round((completed / iterations) * 100));
    // Yield to the event loop so the UI can paint the progress bar
    await new Promise((r) => setTimeout(r, 0));
  }

  return buildSummary(
    iterations,
    championCount,
    runnerUpCount,
    semifinalCount,
    totalGoalsAcrossAll,
    totalMatches,
    sampleMatchLog,
    performance.now() - startTime
  );
}

function buildSummary(
  iterations: number,
  championCount: Map<string, number>,
  runnerUpCount: Map<string, number>,
  semifinalCount: Map<string, number>,
  totalGoalsAcrossAll: number,
  totalMatches: number,
  sampleMatchLog: MatchResult[] | undefined,
  executionTimeMs: number
): SimulationSummary {
  const championProbabilities = Array.from(championCount.entries())
    .map(([code, titles]) => ({
      team: getTeamByCode(code)!,
      probability: (titles / iterations) * 100,
      titles,
    }))
    .filter((p) => p.team)
    .sort((a, b) => b.probability - a.probability);

  const runnerUpProbabilities = Array.from(runnerUpCount.entries())
    .map(([code, count]) => ({
      team: getTeamByCode(code)!,
      probability: (count / iterations) * 100,
    }))
    .filter((p) => p.team)
    .sort((a, b) => b.probability - a.probability);

  const semifinalProbabilities = Array.from(semifinalCount.entries())
    .map(([code, count]) => ({
      team: getTeamByCode(code)!,
      probability: (count / iterations) * 100,
    }))
    .filter((p) => p.team)
    .sort((a, b) => b.probability - a.probability);

  // Most likely final: top champion vs most likely runner-up (different team)
  const topChamp = championProbabilities[0];
  const topRunnerUp = runnerUpProbabilities.find((r) => r.team.code !== topChamp?.team.code);
  const mostLikelyFinal = {
    teamA: topChamp?.team,
    teamB: topRunnerUp?.team,
    probability: topChamp && topRunnerUp
      ? (topChamp.probability * topRunnerUp.probability) / 100
      : 0,
  } as SimulationSummary["mostLikelyFinal"];

  return {
    iterations,
    championProbabilities,
    runnerUpProbabilities,
    semifinalProbabilities,
    avgGoalsPerMatch: totalMatches > 0 ? totalGoalsAcrossAll / totalMatches : 0,
    mostLikelyFinal,
    executionTimeMs,
    sampleMatchLog,
  };
}
