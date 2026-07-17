/**
 * Web Worker: Parallel Monte Carlo Tournament Simulator
 * ============================================================
 *
 * Each worker receives a chunk of N simulations to run on a separate
 * thread. Results are posted back to the main thread for aggregation.
 *
 * Protocol:
 *   Main → Worker: { type: "run", year, iterations, seed }
 *   Worker → Main: { type: "progress", delta }
 *   Worker → Main: { type: "done", results: TournamentSimulation[] }
 *   Worker → Main: { type: "error", error: string }
 *
 * The worker imports a pure-logic core (no DOM dependencies) so it can
 * run safely off the main thread.
 */

/// <reference lib="webworker" />

import { teams, TeamProfile } from "../data/teams";
import { getTeamByCode } from "../data/teams";
import { getWorldElo, penaltyWinProbability } from "../ml/elo";
import { extractMatchupFeatures, MatchupFeatures } from "../ml/features";
import { getEnsemble } from "../ml/models";

// ----------------------------------------------------------------------------
// RNG (Mulberry32, seedable)
// ----------------------------------------------------------------------------

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function poisson(lambda: number, rng: () => number): number {
  if (lambda <= 0) return 0;
  const L = Math.exp(-lambda);
  let k = 0, p = 1;
  do {
    k++;
    p *= rng();
  } while (p > L);
  return k - 1;
}

// ----------------------------------------------------------------------------
// Match simulation (mirrors simulator-v2.ts but self-contained for worker)
// ----------------------------------------------------------------------------

interface SimulatedMatch {
  round: string;
  teamA: string;
  teamB: string;
  score90: [number, number];
  scoreET?: [number, number];
  penalties?: [number, number];
  winner: string;
  isUpset: boolean;
  upsetMagnitude: number;
}

interface TournamentSimulation {
  champion: string;
  runnerUp: string;
  semifinalists: string[];
  quarterfinalists: string[];
  groupExits: string[];
  matches: SimulatedMatch[];
  totalGoals: number;
  darkHorse?: string;
  groupOfDeath?: string[];
}

function simulateMatch(
  teamA: TeamProfile,
  teamB: TeamProfile,
  round: string,
  restDaysA: number,
  restDaysB: number,
  rng: () => number
): SimulatedMatch {
  const features: MatchupFeatures = extractMatchupFeatures(teamA, teamB);
  const ensemble = getEnsemble();
  const { expA, expB } = ensemble.predictGoals(features);

  const fatigueA = restDaysA < 3 ? 0.85 : 1;
  const fatigueB = restDaysB < 3 ? 0.85 : 1;
  const lambdaA = Math.max(0.2, expA * fatigueA);
  const lambdaB = Math.max(0.2, expB * fatigueB);

  let goalsA = poisson(lambdaA, rng);
  let goalsB = poisson(lambdaB, rng);

  let scoreET: [number, number] | undefined;
  let penalties: [number, number] | undefined;
  let winner: string;

  if (goalsA === goalsB) {
    // Extra time
    const etA = poisson(lambdaA * 0.33, rng);
    const etB = poisson(lambdaB * 0.33, rng);
    scoreET = [etA, etB];

    if (etA === etB) {
      penalties = simulatePenaltyShootout(teamA, teamB, rng);
      winner = penalties[0] > penalties[1] ? teamA.code : teamB.code;
    } else {
      winner = etA > etB ? teamA.code : teamB.code;
      goalsA += etA;
      goalsB += etB;
    }
  } else {
    winner = goalsA > goalsB ? teamA.code : teamB.code;
  }

  const eloA = getWorldElo(teamA.name);
  const eloB = getWorldElo(teamB.name);
  const winnerElo = winner === teamA.code ? eloA : eloB;
  const loserElo = winner === teamA.code ? eloB : eloA;
  const isUpset = winnerElo < loserElo;
  const upsetMagnitude = isUpset ? loserElo - winnerElo : 0;

  return {
    round, teamA: teamA.code, teamB: teamB.code,
    score90: [goalsA, goalsB], scoreET, penalties, winner, isUpset, upsetMagnitude,
  };
}

function simulatePenaltyShootout(
  teamA: TeamProfile, teamB: TeamProfile, rng: () => number
): [number, number] {
  const convA = 0.72 + (teamA.avgPlayerRating - 80) / 200;
  const convB = 0.72 + (teamB.avgPlayerRating - 80) / 200;
  let scoredA = 0, scoredB = 0;
  for (let i = 0; i < 5; i++) {
    if (rng() < convA) scoredA++;
    if (rng() < convB) scoredB++;
  }
  let sd = 0;
  while (scoredA === scoredB && sd < 10) {
    const a = rng() < convA;
    const b = rng() < convB;
    if (a && !b) { scoredA++; break; }
    if (!a && b) { scoredB++; break; }
    if (a && b) { scoredA++; scoredB++; }
    sd++;
  }
  if (scoredA === scoredB) {
    const pA = penaltyWinProbability(getWorldElo(teamA.name), getWorldElo(teamB.name));
    if (rng() < pA) scoredA++; else scoredB++;
  }
  return [scoredA, scoredB];
}

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

function simulateTournament(field: TeamProfile[], rng: () => number): TournamentSimulation {
  const seeded = shuffleArray(field, rng).sort((a, b) => {
    const noiseA = (rng() - 0.5) * 120;
    const noiseB = (rng() - 0.5) * 120;
    return b.eloRating + noiseB - (a.eloRating + noiseA);
  });

  // Truncate to nearest power of 2 (don't pad — duplicates would let a
  // team play itself, skewing simulation results).
  const bracketSize = Math.pow(2, Math.floor(Math.log2(Math.max(2, seeded.length))));
  const bracket = seeded.slice(0, bracketSize);

  const matches: SimulatedMatch[] = [];
  let round = bracket;
  const semifinalists: string[] = [];
  const quarterfinalists: string[] = [];
  const roundNames: Record<number, string> = {
    16: "Round of 16", 8: "Quarter-final", 4: "Semi-final", 2: "Final",
  };

  while (round.length > 1) {
    const roundName = roundNames[round.length] || `Round of ${round.length}`;
    const nextRound: TeamProfile[] = [];
    for (let i = 0; i < round.length; i += 2) {
      const teamA = round[i];
      const teamB = round[i + 1] || round[i];
      const restA = 3 + Math.floor(rng() * 3);
      const restB = 3 + Math.floor(rng() * 3);
      const match = simulateMatch(teamA, teamB, roundName, restA, restB, rng);
      matches.push(match);
      const winner = match.winner === teamA.code ? teamA : teamB;
      nextRound.push(winner);
      const loser = match.winner === teamA.code ? teamB : teamA;
      if (round.length === 4) semifinalists.push(loser.code);
      if (round.length === 8) quarterfinalists.push(loser.code);
    }
    round = nextRound;
  }

  const champion = round[0].code;
  const runnerUp = semifinalists[semifinalists.length - 1] || round[0].code;

  const qfTeams = [champion, runnerUp, ...semifinalists, ...quarterfinalists]
    .filter((code, idx, arr) => arr.indexOf(code) === idx)
    .map((code) => getTeamByCode(code))
    .filter((t): t is TeamProfile => t !== undefined);
  const darkHorse = qfTeams.length > 0
    ? qfTeams.reduce((lowest, t) => (t.fifaRank > lowest.fifaRank ? t : lowest)).code
    : undefined;

  const nonFinalists = field
    .filter((t) => t.code !== champion && t.code !== runnerUp)
    .sort((a, b) => b.eloRating - a.eloRating)
    .slice(0, 4)
    .map((t) => t.code);
  const groupOfDeath = nonFinalists.length === 4 ? nonFinalists : undefined;

  const qfTeamCodes = new Set(qfTeams.map((t) => t.code));
  const groupExits = field.filter((t) => !qfTeamCodes.has(t.code)).map((t) => t.code);

  const totalGoals = matches.reduce((sum, m) =>
    sum + m.score90[0] + m.score90[1] + (m.scoreET?.[0] || 0) + (m.scoreET?.[1] || 0), 0);

  return {
    champion, runnerUp,
    semifinalists: semifinalists.slice(0, 2),
    quarterfinalists, groupExits, matches, totalGoals,
    darkHorse, groupOfDeath,
  };
}

// ----------------------------------------------------------------------------
// Worker message handler
// ----------------------------------------------------------------------------

self.onmessage = (e: MessageEvent) => {
  const msg = e.data;
  if (msg.type !== "run") return;

  const { year, iterations, seed } = msg;
  const rng = mulberry32(seed);
  const field = selectTournamentField(year);
  const results: TournamentSimulation[] = [];
  const batchSize = Math.max(50, Math.floor(iterations / 20));

  try {
    let completed = 0;
    while (completed < iterations) {
      const batchEnd = Math.min(completed + batchSize, iterations);
      for (let i = completed; i < batchEnd; i++) {
        results.push(simulateTournament(field, rng));
      }
      const delta = batchEnd - completed;
      completed = batchEnd;
      // Report progress to main thread
      (self as any).postMessage({ type: "progress", delta });
    }

    (self as any).postMessage({ type: "done", results });
  } catch (err: any) {
    (self as any).postMessage({ type: "error", error: err?.message || String(err) });
  }
};
