#!/usr/bin/env python3
"""
FIFA Predictor — Main Python Backend
============================================
Entry point for the Python ML/DS backend service.

Usage:
    python main.py                          Start the FastAPI server
    python main.py --predict BRA ARG        Predict Brazil vs Argentina
    python main.py --simulate 10000         Run 10k Monte Carlo simulation
    python main.py --tournament             Show tournament predictions
    python main.py --train                  Retrain the ensemble model

Author: OM SAI SAINI & ARHAAM SETHIA
"""

import argparse
import random
import sys
from typing import Optional

import numpy as np

# ============================================================
# 1. Data — Teams (mirrors the TypeScript frontend data)
# ============================================================

TEAMS = {
    "BR": {"name": "Brazil", "elo": 1928, "fifa_rank": 5, "titles": 5, "form": 78,
            "attack": 92, "defense": 78, "midfield": 88, "squad_value": 1020},
    "AR": {"name": "Argentina", "elo": 2001, "fifa_rank": 1, "titles": 3, "form": 92,
            "attack": 90, "defense": 82, "midfield": 88, "squad_value": 820},
    "FR": {"name": "France", "elo": 1985, "fifa_rank": 2, "titles": 2, "form": 88,
            "attack": 91, "defense": 84, "midfield": 89, "squad_value": 1230},
    "DE": {"name": "Germany", "elo": 1889, "fifa_rank": 9, "titles": 4, "form": 75,
            "attack": 84, "defense": 80, "midfield": 85, "squad_value": 880},
    "IT": {"name": "Italy", "elo": 1872, "fifa_rank": 10, "titles": 4, "form": 72,
            "attack": 80, "defense": 86, "midfield": 81, "squad_value": 640},
    "ES": {"name": "Spain", "elo": 1968, "fifa_rank": 3, "titles": 1, "form": 89,
            "attack": 87, "defense": 83, "midfield": 90, "squad_value": 950},
    "GB": {"name": "England", "elo": 1957, "fifa_rank": 4, "titles": 1, "form": 86,
            "attack": 88, "defense": 81, "midfield": 84, "squad_value": 1180},
    "NL": {"name": "Netherlands", "elo": 1918, "fifa_rank": 6, "titles": 0, "form": 82,
            "attack": 86, "defense": 81, "midfield": 83, "squad_value": 760},
    "PT": {"name": "Portugal", "elo": 1908, "fifa_rank": 7, "titles": 0, "form": 84,
            "attack": 87, "defense": 79, "midfield": 84, "squad_value": 870},
    "UY": {"name": "Uruguay", "elo": 1841, "fifa_rank": 14, "titles": 2, "form": 70,
            "attack": 82, "defense": 78, "midfield": 80, "squad_value": 380},
    "HR": {"name": "Croatia", "elo": 1858, "fifa_rank": 10, "titles": 0, "form": 76,
            "attack": 78, "defense": 82, "midfield": 85, "squad_value": 420},
    "BE": {"name": "Belgium", "elo": 1894, "fifa_rank": 8, "titles": 0, "form": 79,
            "attack": 85, "defense": 78, "midfield": 82, "squad_value": 690},
    "MA": {"name": "Morocco", "elo": 1832, "fifa_rank": 13, "titles": 0, "form": 80,
            "attack": 78, "defense": 85, "midfield": 79, "squad_value": 320},
    "MX": {"name": "Mexico", "elo": 1801, "fifa_rank": 17, "titles": 0, "form": 68,
            "attack": 75, "defense": 72, "midfield": 76, "squad_value": 220},
    "US": {"name": "United States", "elo": 1812, "fifa_rank": 16, "titles": 0, "form": 74,
            "attack": 79, "defense": 75, "midfield": 76, "squad_value": 280},
    "JP": {"name": "Japan", "elo": 1798, "fifa_rank": 18, "titles": 0, "form": 81,
            "attack": 80, "defense": 75, "midfield": 80, "squad_value": 260},
    "KR": {"name": "South Korea", "elo": 1768, "fifa_rank": 23, "titles": 0, "form": 72,
            "attack": 76, "defense": 71, "midfield": 74, "squad_value": 180},
}

CODE_ALIASES = {
    "BRA": "BR", "ARG": "AR", "FRA": "FR", "GER": "DE", "ITA": "IT",
    "ESP": "ES", "ENG": "GB", "NED": "NL", "POR": "PT", "URU": "UY",
    "CRO": "HR", "BEL": "BE", "MAR": "MA", "MEX": "MX", "USA": "US",
    "JPN": "JP", "KOR": "KR",
}

def normalize_code(code: str) -> str:
    """Accept both 2-letter (BR) and 3-letter (BRA) codes."""
    code = code.upper()
    if code in TEAMS:
        return code
    if code in CODE_ALIASES:
        return CODE_ALIASES[code]
    raise KeyError(f"Unknown team code: {code}")


# ============================================================
# 2. Feature Engineering
# ============================================================

def extract_features(team_code: str) -> dict:
    """Extract normalized features for a team."""
    t = TEAMS[team_code]
    return {
        "elo_norm": max(0, min(1, (t["elo"] - 1500) / 600)),
        "fifa_rank_norm": max(0, min(1, 1 - (t["fifa_rank"] - 1) / 100)),
        "form_norm": t["form"] / 100,
        "attack_norm": t["attack"] / 100,
        "defense_norm": t["defense"] / 100,
        "midfield_norm": t["midfield"] / 100,
        "squad_value_norm": max(0, min(1, (t["squad_value"] - 100) / 1100)),
        "title_experience": min(1, t["titles"] / 5),
    }


def compute_xg_proxy(team_code: str) -> float:
    """Approximate Expected Goals from shooting efficiency."""
    t = TEAMS[team_code]
    goals_per_match = 1.2
    conversion = 0.13 + (t["attack"] - 80) / 100 * 0.10
    shots = goals_per_match / 0.18
    return max(0.3, min(4.5, shots * conversion))


# ============================================================
# 3. Prediction Model (Logistic Ensemble)
# ============================================================

class PredictionModel:
    """Ensemble prediction model combining ELO + feature-based logistic."""

    def __init__(self):
        self.weights = np.array([
            0.28, 0.15, 0.20, 0.08, 0.15, 0.14,
        ])

    def predict_proba(self, team_a: str, team_b: str) -> dict:
        """Predict win/draw/loss probabilities."""
        team_a = normalize_code(team_a)
        team_b = normalize_code(team_b)
        ta, tb = TEAMS[team_a], TEAMS[team_b]

        elo_exp_a = 1 / (1 + 10 ** ((tb["elo"] - ta["elo"]) / 400))

        fa = extract_features(team_a)
        fb = extract_features(team_b)
        features = np.array([
            fa["elo_norm"] - fb["elo_norm"],
            fa["fifa_rank_norm"] - fb["fifa_rank_norm"],
            fa["title_experience"] - fb["title_experience"],
            fa["squad_value_norm"] - fb["squad_value_norm"],
            fa["form_norm"] - fb["form_norm"],
            (fa["attack_norm"] + fa["defense_norm"] + fa["midfield_norm"]) / 3 -
            (fb["attack_norm"] + fb["defense_norm"] + fb["midfield_norm"]) / 3,
        ])
        combined = np.dot(features, self.weights)
        feature_score = 1 / (1 + np.exp(-combined * 6))

        blended = 0.5 * elo_exp_a + 0.5 * feature_score

        p_draw = 0.18
        p_a_win = blended * (1 - p_draw)
        p_b_win = (1 - blended) * (1 - p_draw)

        xg_a = compute_xg_proxy(team_a)
        xg_b = compute_xg_proxy(team_b)
        elo_adj = (ta["elo"] - tb["elo"]) / 200
        exp_goals_a = max(0.3, min(5, xg_a + elo_adj * 0.15))
        exp_goals_b = max(0.3, min(5, xg_b - elo_adj * 0.15))

        return {
            "team_a": team_a, "team_b": team_b,
            "team_a_name": ta["name"], "team_b_name": tb["name"],
            "p_a_win": round(p_a_win * 100, 1),
            "p_b_win": round(p_b_win * 100, 1),
            "p_draw": round(p_draw * 100, 1),
            "exp_goals_a": round(exp_goals_a, 2),
            "exp_goals_b": round(exp_goals_b, 2),
            "elo_diff": ta["elo"] - tb["elo"],
        }

    def predict_tournament(self) -> list:
        """Predict win probabilities for all teams."""
        results = []
        for code, t in TEAMS.items():
            f = extract_features(code)
            score = (
                f["elo_norm"] * 0.28 +
                f["fifa_rank_norm"] * 0.15 +
                f["title_experience"] * 0.20 +
                f["squad_value_norm"] * 0.08 +
                f["form_norm"] * 0.15 +
                (f["attack_norm"] + f["defense_norm"] + f["midfield_norm"]) / 3 * 0.14
            )
            results.append({
                "code": code, "name": t["name"],
                "win_probability": round(score * 100, 1),
                "elo": t["elo"], "fifa_rank": t["fifa_rank"],
                "titles": t["titles"],
            })
        results.sort(key=lambda x: x["win_probability"], reverse=True)
        return results


# ============================================================
# 4. Monte Carlo Simulator
# ============================================================

def simulate_match(team_a: str, team_b: str, rng: random.Random) -> tuple:
    """Simulate a single match. Returns (goals_a, goals_b, winner)."""
    ta, tb = TEAMS[team_a], TEAMS[team_b]
    elo_adj = (ta["elo"] - tb["elo"]) / 200
    lambda_a = max(0.2, 1.3 + ((ta["attack"] - tb["defense"]) / 100) * 0.7 + elo_adj * 0.15)
    lambda_b = max(0.2, 1.3 + ((tb["attack"] - ta["defense"]) / 100) * 0.7 - elo_adj * 0.15)

    goals_a = sum(1 for _ in range(100) if rng.random() < lambda_a / 10)
    goals_b = sum(1 for _ in range(100) if rng.random() < lambda_b / 10)

    if goals_a > goals_b:
        return goals_a, goals_b, team_a
    elif goals_b > goals_a:
        return goals_a, goals_b, team_b
    else:
        p_a = 1 / (1 + 10 ** ((tb["elo"] - ta["elo"]) / 400))
        winner = team_a if rng.random() < p_a else team_b
        return goals_a, goals_b, winner


def simulate_tournament(seed: int) -> dict:
    """Simulate one full tournament."""
    rng = random.Random(seed)
    teams_sorted = sorted(TEAMS.keys(), key=lambda c: TEAMS[c]["elo"], reverse=True)
    bracket = teams_sorted[:16]
    rng.shuffle(bracket)

    while len(bracket) > 1:
        next_round = []
        for i in range(0, len(bracket), 2):
            a, b = bracket[i], bracket[i + 1]
            _, _, winner = simulate_match(a, b, rng)
            next_round.append(winner)
        bracket = next_round

    return {"champion": bracket[0]}


def run_monte_carlo(iterations: int = 10000, workers: int = 4) -> list:
    """Run N tournament simulations in parallel."""
    from multiprocessing import Pool

    seeds = list(range(iterations))
    with Pool(workers) as pool:
        results = pool.map(simulate_tournament, seeds)

    champ_count = {}
    for r in results:
        c = r["champion"]
        champ_count[c] = champ_count.get(c, 0) + 1

    ranking = []
    for code, count in sorted(champ_count.items(), key=lambda x: x[1], reverse=True):
        ranking.append({
            "code": code,
            "name": TEAMS[code]["name"],
            "titles": count,
            "probability": round(count / iterations * 100, 2),
        })
    return ranking


# ============================================================
# 5. FastAPI Server
# ============================================================

def create_app():
    """Create and configure the FastAPI application."""
    from fastapi import FastAPI, HTTPException
    from pydantic import BaseModel

    app = FastAPI(title="FIFA Predictor API", version="2.0.0")
    model = PredictionModel()

    class MatchRequest(BaseModel):
        team_a: str
        team_b: str

    class SimRequest(BaseModel):
        iterations: int = 10000

    @app.get("/health")
    async def health():
        return {"status": "ok", "teams": len(TEAMS)}

    @app.get("/teams")
    async def get_teams():
        return [{"code": k, **v} for k, v in TEAMS.items()]

    @app.post("/predict-match")
    async def predict_match(req: MatchRequest):
        try:
            return model.predict_proba(req.team_a, req.team_b)
        except KeyError as e:
            raise HTTPException(404, str(e))

    @app.get("/predict-tournament")
    async def predict_tournament():
        return model.predict_tournament()

    @app.post("/simulate-tournament")
    async def simulate(req: SimRequest):
        results = run_monte_carlo(req.iterations)
        return {"iterations": req.iterations, "results": results}

    return app


# ============================================================
# 6. CLI Entry Point
# ============================================================

def cmd_predict(team_a: str, team_b: str):
    model = PredictionModel()
    result = model.predict_proba(team_a, team_b)
    print(f"\n{'='*50}")
    print(f"  {result['team_a_name']} vs {result['team_b_name']}")
    print(f"{'='*50}")
    print(f"  {result['team_a_name']} win:  {result['p_a_win']}%")
    print(f"  Draw:               {result['p_draw']}%")
    print(f"  {result['team_b_name']} win:  {result['p_b_win']}%")
    print(f"  Expected score:     {result['exp_goals_a']} - {result['exp_goals_b']}")
    print(f"  ELO difference:     {result['elo_diff']:+d}")
    print(f"{'='*50}\n")


def cmd_simulate(iterations: int):
    print(f"\nRunning {iterations:,} simulations...")
    results = run_monte_carlo(iterations)
    print(f"\n{'='*50}")
    print(f"  Monte Carlo Results ({iterations:,} simulations)")
    print(f"{'='*50}")
    for i, r in enumerate(results[:10]):
        print(f"  {i+1:2d}. {r['name']:20s} {r['probability']:6.2f}%  ({r['titles']} wins)")
    print(f"{'='*50}\n")


def cmd_tournament():
    model = PredictionModel()
    results = model.predict_tournament()
    print(f"\n{'='*50}")
    print(f"  Tournament Win Probabilities")
    print(f"{'='*50}")
    for i, r in enumerate(results[:10]):
        print(f"  {i+1:2d}. {r['name']:20s} {r['win_probability']:6.1f}%")
    print(f"{'='*50}\n")


def cmd_serve():
    import uvicorn
    app = create_app()
    print("\nStarting FIFA Predictor API on http://0.0.0.0:8000")
    print("Endpoints:")
    print("  GET  /health")
    print("  GET  /teams")
    print("  POST /predict-match")
    print("  GET  /predict-tournament")
    print("  POST /simulate-tournament")
    print()
    uvicorn.run(app, host="0.0.0.0", port=8000)


def cmd_train():
    print("\n[Training] Model retraining not yet implemented.")
    print("This would:")
    print("  1. Load historical match data")
    print("  2. Extract features for all matches")
    print("  3. Train XGBoost + LightGBM + Poisson models")
    print("  4. Stack with logistic meta-learner")
    print("  5. Calibrate with Isotonic regression")
    print("  6. Save to models/ensemble_v2.joblib")
    print()


def main():
    parser = argparse.ArgumentParser(
        description="FIFA Predictor — Main Python Backend",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python main.py                          Start the FastAPI server
  python main.py --predict BRA ARG        Predict Brazil vs Argentina
  python main.py --simulate 10000         Run 10k Monte Carlo simulation
  python main.py --tournament             Show tournament predictions
  python main.py --train                  Retrain the ensemble model
        """,
    )
    parser.add_argument("--predict", nargs=2, metavar=("TEAM_A", "TEAM_B"),
                        help="Predict a match (e.g. --predict BRA ARG)")
    parser.add_argument("--simulate", type=int, metavar="N",
                        help="Run N Monte Carlo simulations")
    parser.add_argument("--tournament", action="store_true",
                        help="Show tournament win probabilities")
    parser.add_argument("--train", action="store_true",
                        help="Retrain the ensemble model")
    parser.add_argument("--serve", action="store_true",
                        help="Start the FastAPI server (default)")

    args = parser.parse_args()

    if args.predict:
        cmd_predict(args.predict[0], args.predict[1])
    elif args.simulate:
        cmd_simulate(args.simulate)
    elif args.tournament:
        cmd_tournament()
    elif args.train:
        cmd_train()
    else:
        cmd_serve()


if __name__ == "__main__":
    main()
