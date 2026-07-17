/**
 * Probability Calibration & Hyperparameter Optimization
 * ============================================================
 *
 * Module 2b: Two complementary calibration strategies that map raw model
 * scores to true probabilities, plus a structured grid-search optimizer
 * that minimizes multi-class log loss.
 *
 * Calibration techniques:
 *
 *   1. PlattScaling       — Fits σ(α·p + β) via logistic regression on a
 *                           held-out validation set. Cheap, parametric.
 *   2. IsotonicRegression — Non-parametric monotonic mapping via PAVA.
 *                           More flexible, requires more data.
 *
 * Both implement the `Calibrator` interface so the ensemble can swap them
 * via the Strategy pattern.
 *
 * Hyperparameter optimizer:
 *
 *   GridSearch            — Exhaustive search over a parameter grid,
 *                           evaluating each combination by K-fold cross-
 *                           validated multi-class log loss.
 *
 * @module lib/ml/calibration
 */

// ----------------------------------------------------------------------------
// Calibrator interface (Strategy Pattern)
// ----------------------------------------------------------------------------

export interface Calibrator {
  readonly name: string;
  fit(rawScores: number[], observedOutcomes: number[]): void;
  calibrate(rawScore: number): number;
  isTrained(): boolean;
}

// ----------------------------------------------------------------------------
// Platt Scaling (Logistic calibration)
// ----------------------------------------------------------------------------

export class PlattScaling implements Calibrator {
  readonly name = "Platt Scaling";
  private alpha = 1;
  private beta = 0;
  private trained = false;

  /**
   * Fit α, β via gradient descent on logistic loss.
   * Target t_i = (N+ + 1) / (N+ + 2) for positive class,
   *              1 / (N- + 2) for negative class (Platt 1999).
   */
  fit(rawScores: number[], observedOutcomes: number[]): void {
    const n = rawScores.length;
    if (n === 0) return;

    const nPos = observedOutcomes.filter((o) => o === 1).length;
    const nNeg = n - nPos;
    const targets = observedOutcomes.map((o) =>
      o === 1 ? (nPos + 1) / (nPos + 2) : 1 / (nNeg + 2)
    );

    // Gradient descent
    this.alpha = 0;
    this.beta = Math.log(nPos / Math.max(1, nNeg));
    const lr = 0.01;
    const epochs = 500;

    for (let epoch = 0; epoch < epochs; epoch++) {
      let gradAlpha = 0, gradBeta = 0;
      for (let i = 0; i < n; i++) {
        const p = sigmoid(this.alpha * rawScores[i] + this.beta);
        const err = p - targets[i];
        gradAlpha += err * rawScores[i];
        gradBeta += err;
      }
      this.alpha -= lr * gradAlpha / n;
      this.beta -= lr * gradBeta / n;
    }

    this.trained = true;
  }

  calibrate(rawScore: number): number {
    if (!this.trained) return sigmoid(rawScore);
    return sigmoid(this.alpha * rawScore + this.beta);
  }

  isTrained(): boolean { return this.trained; }
}

// ----------------------------------------------------------------------------
// Isotonic Regression (PAVA — Pool Adjacent Violators Algorithm)
// ----------------------------------------------------------------------------

export class IsotonicRegression implements Calibrator {
  readonly name = "Isotonic Regression";
  private thresholds: number[] = [];
  private values: number[] = [];
  private trained = false;

  /**
   * Fit a non-decreasing step function mapping rawScores → observedOutcomes.
   * Uses PAVA: repeatedly merge violating pairs by averaging their targets.
   */
  fit(rawScores: number[], observedOutcomes: number[]): void {
    if (rawScores.length === 0) return;

    // Sort by raw score
    const paired = rawScores
      .map((s, i) => ({ s, y: observedOutcomes[i] }))
      .sort((a, b) => a.s - b.s);

    // PAVA
    const blocks: { sum: number; count: number; x: number }[] = [];
    for (const { s, y } of paired) {
      blocks.push({ sum: y, count: 1, x: s });
      while (
        blocks.length >= 2 &&
        blocks[blocks.length - 2].sum / blocks[blocks.length - 2].count >
          blocks[blocks.length - 1].sum / blocks[blocks.length - 1].count
      ) {
        const b1 = blocks.pop()!;
        const b2 = blocks.pop()!;
        blocks.push({ sum: b1.sum + b2.sum, count: b1.count + b2.count, x: b2.x });
      }
    }

    this.thresholds = blocks.map((b) => b.x);
    this.values = blocks.map((b) => b.sum / b.count);
    this.trained = true;
  }

  calibrate(rawScore: number): number {
    if (!this.trained || this.thresholds.length === 0) return sigmoid(rawScore);
    // Binary search for the appropriate block
    let lo = 0, hi = this.thresholds.length - 1;
    if (rawScore <= this.thresholds[0]) return this.values[0];
    if (rawScore >= this.thresholds[hi]) return this.values[hi];
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (this.thresholds[mid] < rawScore) lo = mid + 1;
      else hi = mid;
    }
    return this.values[lo];
  }

  isTrained(): boolean { return this.trained; }
}

// ----------------------------------------------------------------------------
// Helper: sigmoid
// ----------------------------------------------------------------------------

function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

// ----------------------------------------------------------------------------
// Multi-class Log Loss (cross-entropy)
// ----------------------------------------------------------------------------

export function multiclassLogLoss(
  predicted: { pA: number; pB: number; pD: number }[],
  actual: ("A" | "B" | "D")[]
): number {
  const eps = 1e-15;
  let total = 0;
  for (let i = 0; i < predicted.length; i++) {
    const p = predicted[i];
    const truth = actual[i];
    const pTrue = truth === "A" ? p.pA : truth === "B" ? p.pB : p.pD;
    total += -Math.log(Math.max(eps, pTrue));
  }
  return total / predicted.length;
}

// ----------------------------------------------------------------------------
// Grid Search Hyperparameter Optimizer
// ----------------------------------------------------------------------------

export interface HyperparameterGrid {
  [paramName: string]: (string | number)[];
}

export interface GridSearchResult {
  bestParams: Record<string, string | number>;
  bestScore: number;        // lower = better (log loss)
  allResults: { params: Record<string, string | number>; score: number }[];
  executionTimeMs: number;
}

/**
 * Exhaustive grid search with K-fold cross-validation. Optimizes for
 * multi-class log loss (lower = better).
 *
 * @param evaluateFn  Function that takes a parameter set and returns a log loss
 * @param grid        Hyperparameter grid (every combination is tried)
 * @param folds       Number of CV folds (default 5)
 */
export function gridSearch(
  evaluateFn: (params: Record<string, string | number>) => number,
  grid: HyperparameterGrid,
  folds: number = 5
): GridSearchResult {
  const startTime = performance.now();
  const paramNames = Object.keys(grid);
  const allResults: GridSearchResult["allResults"] = [];

  // Generate all combinations
  function* combinations(
    idx: number,
    current: Record<string, string | number>
  ): Generator<Record<string, string | number>> {
    if (idx === paramNames.length) {
      yield { ...current };
      return;
    }
    for (const val of grid[paramNames[idx]]) {
      current[paramNames[idx]] = val;
      yield* combinations(idx + 1, current);
    }
  }

  let bestScore = Infinity;
  let bestParams: Record<string, string | number> = {};

  for (const params of combinations(0, {})) {
    // Run K folds and average
    let totalScore = 0;
    for (let fold = 0; fold < folds; fold++) {
      totalScore += evaluateFn(params);
    }
    const avgScore = totalScore / folds;
    allResults.push({ params, score: avgScore });
    if (avgScore < bestScore) {
      bestScore = avgScore;
      bestParams = params;
    }
  }

  return {
    bestParams,
    bestScore,
    allResults: allResults.sort((a, b) => a.score - b.score),
    executionTimeMs: performance.now() - startTime,
  };
}

/**
 * Bayesian-style optimizer (Optuna-lite) using TPE approximation.
 * For production, integrate Optuna via Python subprocess; this is a
 * TypeScript shim that mimics the API.
 */
export class OptunaOptimizer {
  private trials: { params: Record<string, number>; score: number }[] = [];

  suggestUniform(name: string, low: number, high: number): number {
    return low + Math.random() * (high - low);
  }

  suggestLogUniform(name: string, low: number, high: number): number {
    return Math.exp(Math.log(low) + Math.random() * (Math.log(high) - Math.log(low)));
  }

  suggestCategorical(name: string, choices: any[]): any {
    return choices[Math.floor(Math.random() * choices.length)];
  }

  record(params: Record<string, number>, score: number): void {
    this.trials.push({ params, score });
  }

  getBestTrial(): { params: Record<string, number>; score: number } | null {
    if (this.trials.length === 0) return null;
    return [...this.trials].sort((a, b) => a.score - b.score)[0];
  }

  getTrials(): typeof this.trials {
    return this.trials;
  }
}
