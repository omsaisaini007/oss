/**
 * Advanced Feature Engineering & Domain-Specific Metrics
 * ============================================================
 *
 * Module 1: Proxy features that bridge gaps in historical data.
 *
 *   1. xG-Proxy  — Expected goals approximation from shooting efficiency,
 *                  historical conversion ratios, and defensive resilience.
 *   2. Fatigue   — Rest days between matches + travel distance penalty.
 *   3. Travel    — Haversine distance between match cities.
 *   4. Market    — Total squad market value integration (Transfermarkt-style).
 *
 * Each feature is normalized to [0, 1] so the ML models can consume them
 * uniformly. All features are typed via `FeatureVector` and produced by
 * `extractFeatures()` which is the single entry point for the modeling layer.
 *
 * @module lib/ml/features
 */

import { TeamProfile } from "../data/teams";
import { getWorldElo } from "./elo";

// ----------------------------------------------------------------------------
// Type definitions
// ----------------------------------------------------------------------------

export interface FeatureVector {
  // Core strength features (normalized 0-1)
  eloNorm: number;            // World-Elo normalized
  fifaRankNorm: number;       // 1 - rank/100
  formNorm: number;           // form rating / 100
  attackNorm: number;         // attack rating / 100
  defenseNorm: number;        // defense rating / 100
  midfieldNorm: number;       // midfield rating / 100
  squadValueNorm: number;     // market value normalized
  avgPlayerRatingNorm: number;

  // Engineered features
  xgProxy: number;            // Expected goals proxy (per match)
  xgAgainstProxy: number;     // Expected goals against proxy
  conversionRatio: number;    // Shot conversion efficiency
  defensiveResilience: number;// Resistance to conceding
  fatigueIndex: number;       // 0 = fresh, 1 = exhausted
  travelFatigue: number;      // Kilometers traveled, normalized
  restDaysPenalty: number;    // Penalty for < 3 rest days
  titleExperience: number;    // Normalized WC titles
  confederationStrength: number;

  // Meta
  teamCode: string;
  teamName: string;
}

export interface MatchContext {
  /** ISO date or day offset (1 = first matchday of tournament). */
  matchDay: number;
  /** Team's previous matchDay in tournament (0 = no prior match). */
  prevMatchDay: number;
  /** Match city latitude. */
  venueLat: number;
  /** Match city longitude. */
  venueLng: number;
  /** Team's previous venue latitude. */
  prevVenueLat: number;
  /** Team's previous venue longitude. */
  prevVenueLng: number;
}

// ----------------------------------------------------------------------------
// Confederation strength coefficients (derived from inter-confederation record)
// ----------------------------------------------------------------------------

const CONFEDERATION_STRENGTH: Record<string, number> = {
  UEFA: 1.00,
  CONMEBOL: 0.95,
  CONCACAF: 0.78,
  CAF: 0.75,
  AFC: 0.74,
  OFC: 0.65,
};

// ----------------------------------------------------------------------------
// Haversine distance (km) between two lat/lng points
// ----------------------------------------------------------------------------

const EARTH_RADIUS_KM = 6371;
function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function haversineDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ----------------------------------------------------------------------------
// xG Proxy
// ----------------------------------------------------------------------------
//
// Without Opta-level shot tracking data for historical tournaments, we
// construct an xG-Proxy from:
//
//   xG ≈ shots_per_match * conversion_ratio
//
// where shots_per_match is approximated from goals scored (a team that
// scores 2.5 goals/match typically takes ~14 shots at ~18% conversion),
// and conversion_ratio is derived from attack rating vs league-average
// defensive resistance.

export function computeXgProxy(team: TeamProfile): number {
  // Approximate shots per match from goals scored
  // Conversion ratio ~18% league average, so shots ≈ goals / 0.18
  const goalsPerMatch = team.totalMatches > 0 ? team.goalsFor / team.totalMatches : 1.2;
  const approxShotsPerMatch = goalsPerMatch / 0.18;

  // Adjust conversion by attack rating
  const conversionRatio = 0.13 + (team.attackRating - 80) / 100 * 0.10; // ~13%-23%

  // xG = shots * conversion
  const xg = approxShotsPerMatch * conversionRatio;

  // Cap at reasonable bounds
  return Math.max(0.3, Math.min(4.5, xg));
}

export function computeXgAgainstProxy(team: TeamProfile): number {
  const goalsConcededPerMatch = team.totalMatches > 0 ? team.goalsAgainst / team.totalMatches : 1.0;
  // Defensive resilience lowers xG against
  const resilienceFactor = 1 - (team.defenseRating - 70) / 100;
  return Math.max(0.2, Math.min(3.5, goalsConcededPerMatch * Math.max(0.5, resilienceFactor)));
}

export function computeConversionRatio(team: TeamProfile): number {
  // Goals per "shot" (approximated as goals per match / 14 baseline shots)
  const goalsPerMatch = team.totalMatches > 0 ? team.goalsFor / team.totalMatches : 1.2;
  return Math.max(0.05, Math.min(0.35, goalsPerMatch / 14));
}

export function computeDefensiveResilience(team: TeamProfile): number {
  // Lower goals conceded per match → higher resilience
  const gcpm = team.totalMatches > 0 ? team.goalsAgainst / team.totalMatches : 1.5;
  return Math.max(0, Math.min(1, 1 - gcpm / 3));
}

// ----------------------------------------------------------------------------
// Fatigue metrics
// ----------------------------------------------------------------------------

/**
 * Compute fatigue index from rest days. Optimal = 4+ days (0 fatigue),
 * 3 days = 0.15, 2 days = 0.35, 1 day = 0.65, 0 = 0.85.
 */
export function computeFatigueIndex(restDays: number): number {
  if (restDays >= 4) return 0;
  if (restDays === 3) return 0.15;
  if (restDays === 2) return 0.35;
  if (restDays === 1) return 0.65;
  return 0.85;
}

/**
 * Travel fatigue penalty (normalized 0-1). Long-haul travel (>5000km) on
 * short rest amplifies the penalty.
 */
export function computeTravelFatigue(distanceKm: number, restDays: number): number {
  const distNorm = Math.min(1, distanceKm / 8000);
  const restMultiplier = restDays >= 4 ? 0.5 : restDays >= 3 ? 0.7 : 1.0;
  return distNorm * restMultiplier;
}

/** Penalty for less than 3 rest days (logistic curve). */
export function computeRestDaysPenalty(restDays: number): number {
  if (restDays >= 4) return 0;
  return 1 / (1 + Math.exp(0.7 * (restDays - 2)));
}

// ----------------------------------------------------------------------------
// Market value integration
// ----------------------------------------------------------------------------

/** Normalize squad market value (in millions EUR) to [0, 1]. */
export function normalizeSquadValue(valueInMillions: number): number {
  // Top national squads ≈ €1.2B (France, England). Lower bound ≈ €100M.
  return Math.max(0, Math.min(1, (valueInMillions - 100) / 1100));
}

// ----------------------------------------------------------------------------
// Single entry point: extract full feature vector for a team
// ----------------------------------------------------------------------------

export function extractFeatures(
  team: TeamProfile,
  context?: Partial<MatchContext>
): FeatureVector {
  const elo = getWorldElo(team.name);
  const xgProxy = computeXgProxy(team);
  const xgAgainstProxy = computeXgAgainstProxy(team);

  const restDays = context?.prevMatchDay
    ? Math.max(0, (context.matchDay || 0) - context.prevMatchDay)
    : 4;
  const travelKm = context?.prevVenueLat != null && context?.venueLat != null
    ? haversineDistance(
        context.prevVenueLat, context.prevVenueLng!,
        context.venueLat, context.venueLng!
      )
    : 0;

  const fatigueIndex = computeFatigueIndex(restDays);
  const travelFatigue = computeTravelFatigue(travelKm, restDays);
  const restDaysPenalty = computeRestDaysPenalty(restDays);

  return {
    eloNorm: Math.max(0, Math.min(1, (elo - 1500) / 600)),
    fifaRankNorm: Math.max(0, Math.min(1, 1 - (team.fifaRank - 1) / 100)),
    formNorm: team.formRating / 100,
    attackNorm: team.attackRating / 100,
    defenseNorm: team.defenseRating / 100,
    midfieldNorm: team.midfieldRating / 100,
    squadValueNorm: normalizeSquadValue(team.squadValue),
    avgPlayerRatingNorm: (team.avgPlayerRating - 70) / 20,

    xgProxy,
    xgAgainstProxy,
    conversionRatio: computeConversionRatio(team),
    defensiveResilience: computeDefensiveResilience(team),
    fatigueIndex,
    travelFatigue,
    restDaysPenalty,
    titleExperience: Math.min(1, team.titles / 5),
    confederationStrength: CONFEDERATION_STRENGTH[team.confederation] || 0.75,

    teamCode: team.code,
    teamName: team.name,
  };
}

/** Extract feature vector for a matchup (both teams' features + differential). */
export interface MatchupFeatures {
  teamA: FeatureVector;
  teamB: FeatureVector;
  // Differential features (teamA - teamB)
  eloDiff: number;
  attackDiff: number;
  defenseDiff: number;
  midfieldDiff: number;
  formDiff: number;
  valueDiff: number;
  xgDiff: number;
  fatigueDiff: number;
}

export function extractMatchupFeatures(
  teamA: TeamProfile,
  teamB: TeamProfile,
  contextA?: Partial<MatchContext>,
  contextB?: Partial<MatchContext>
): MatchupFeatures {
  const a = extractFeatures(teamA, contextA);
  const b = extractFeatures(teamB, contextB);
  return {
    teamA: a,
    teamB: b,
    eloDiff: a.eloNorm - b.eloNorm,
    attackDiff: a.attackNorm - b.attackNorm,
    defenseDiff: a.defenseNorm - b.defenseNorm,
    midfieldDiff: a.midfieldNorm - b.midfieldNorm,
    formDiff: a.formNorm - b.formNorm,
    valueDiff: a.squadValueNorm - b.squadValueNorm,
    xgDiff: a.xgProxy - b.xgAgainstProxy,
    fatigueDiff: a.fatigueIndex - b.fatigueIndex,
  };
}
