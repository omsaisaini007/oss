/**
 * "What-If" Simulator Engine
 * ============================================================
 *
 * Lets users override specific team attributes (form, squad value, attack,
 * defense) and see how those changes ripple through the ensemble's
 * predictions and the Monte Carlo simulator.
 *
 * Returns:
 *   - Updated win probability for the modified team
 *   - Delta vs. baseline
 *   - Rank movement (where the team now sits among all teams)
 */

import { teams, TeamProfile } from "../data/teams";
import { generatePredictions, predictHeadToHead } from "../prediction";
import { extractFeatures, extractMatchupFeatures } from "./features";
import { getEnsemble } from "./models";

export interface WhatIfOverrides {
  formRating?: number;       // 0-100
  squadValue?: number;       // in millions EUR
  attackRating?: number;     // 0-100
  defenseRating?: number;    // 0-100
  midfieldRating?: number;   // 0-100
  fifaRank?: number;
  eloAdjust?: number;        // +/- ELO points
}

export interface WhatIfResult {
  team: TeamProfile;
  modified: TeamProfile;          // with overrides applied
  baselineWinProb: number;        // % chance to win WC
  modifiedWinProb: number;
  delta: number;
  baselineRank: number;           // 1-indexed position by win prob
  modifiedRank: number;
  factorBreakdown: { factor: string; baseline: number; modified: number; delta: number }[];
  sampleOpponentPrediction?: {
    opponentCode: string;
    baseline: { pA: number; pB: number; pD: number; expA: number; expB: number };
    modified: { pA: number; pB: number; pD: number; expA: number; expB: number };
  };
}

export function applyWhatIf(team: TeamProfile, overrides: WhatIfOverrides): TeamProfile {
  return {
    ...team,
    formRating: overrides.formRating ?? team.formRating,
    squadValue: overrides.squadValue ?? team.squadValue,
    attackRating: overrides.attackRating ?? team.attackRating,
    defenseRating: overrides.defenseRating ?? team.defenseRating,
    midfieldRating: overrides.midfieldRating ?? team.midfieldRating,
    fifaRank: overrides.fifaRank ?? team.fifaRank,
    eloRating: team.eloRating + (overrides.eloAdjust ?? 0),
  };
}

export function computeWhatIf(
  team: TeamProfile,
  overrides: WhatIfOverrides,
  opponentCode?: string
): WhatIfResult {
  const modified = applyWhatIf(team, overrides);

  // Baseline predictions (all teams at default)
  const baselinePredictions = generatePredictions();
  const baselineTeamPred = baselinePredictions.find((p) => p.team.code === team.code);
  const baselineWinProb = baselineTeamPred?.winProbability ?? 0;
  const baselineRank = baselinePredictions.findIndex((p) => p.team.code === team.code) + 1;

  // Modified predictions — replace team in teams array and recompute
  const modifiedTeams = teams.map((t) => (t.code === team.code ? modified : t));
  // We monkey-patch the teams array temporarily for the prediction engine
  const originalTeams = teams.slice();
  // Splice in-place because the prediction module imports `teams` directly
  teams.length = 0;
  teams.push(...modifiedTeams);
  const modifiedPredictions = generatePredictions();
  // Restore
  teams.length = 0;
  teams.push(...originalTeams);

  const modifiedTeamPred = modifiedPredictions.find((p) => p.team.code === team.code);
  const modifiedWinProb = modifiedTeamPred?.winProbability ?? 0;
  const modifiedRank = modifiedPredictions.findIndex((p) => p.team.code === team.code) + 1;

  // Factor breakdown
  const baselineFeatures = extractFeatures(team);
  const modifiedFeatures = extractFeatures(modified);
  const factorBreakdown = [
    { factor: "ELO", baseline: baselineFeatures.eloNorm, modified: modifiedFeatures.eloNorm, delta: modifiedFeatures.eloNorm - baselineFeatures.eloNorm },
    { factor: "Form", baseline: baselineFeatures.formNorm, modified: modifiedFeatures.formNorm, delta: modifiedFeatures.formNorm - baselineFeatures.formNorm },
    { factor: "Attack", baseline: baselineFeatures.attackNorm, modified: modifiedFeatures.attackNorm, delta: modifiedFeatures.attackNorm - baselineFeatures.attackNorm },
    { factor: "Defense", baseline: baselineFeatures.defenseNorm, modified: modifiedFeatures.defenseNorm, delta: modifiedFeatures.defenseNorm - baselineFeatures.defenseNorm },
    { factor: "Squad Value", baseline: baselineFeatures.squadValueNorm, modified: modifiedFeatures.squadValueNorm, delta: modifiedFeatures.squadValueNorm - baselineFeatures.squadValueNorm },
    { factor: "xG Proxy", baseline: baselineFeatures.xgProxy, modified: modifiedFeatures.xgProxy, delta: modifiedFeatures.xgProxy - baselineFeatures.xgProxy },
  ];

  // Sample opponent prediction (if provided)
  let sampleOpponentPrediction: WhatIfResult["sampleOpponentPrediction"];
  if (opponentCode) {
    const opponent = teams.find((t) => t.code === opponentCode);
    if (opponent) {
      const baselineH2H = predictHeadToHead(team, opponent);
      const modifiedH2H = predictHeadToHead(modified, opponent);
      sampleOpponentPrediction = {
        opponentCode,
        baseline: {
          pA: baselineH2H.winProbA / 100,
          pB: baselineH2H.winProbB / 100,
          pD: baselineH2H.drawProb / 100,
          expA: baselineH2H.expectedScoreA,
          expB: baselineH2H.expectedScoreB,
        },
        modified: {
          pA: modifiedH2H.winProbA / 100,
          pB: modifiedH2H.winProbB / 100,
          pD: modifiedH2H.drawProb / 100,
          expA: modifiedH2H.expectedScoreA,
          expB: modifiedH2H.expectedScoreB,
        },
      };
    }
  }

  return {
    team,
    modified,
    baselineWinProb,
    modifiedWinProb,
    delta: modifiedWinProb - baselineWinProb,
    baselineRank,
    modifiedRank,
    factorBreakdown,
    sampleOpponentPrediction,
  };
}
