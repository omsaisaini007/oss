"use client";

import { Trophy } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[rgba(212,175,55,0.15)] py-8 px-4 sm:px-6 lg:px-8 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-6 mb-6">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-5 h-5 text-[#D4AF37]" />
              <span className="text-base font-bold">
                <span className="text-white">FIFA</span>{" "}
                <span className="shimmer-gold">PREDICTOR</span>
              </span>
            </div>
            <p className="text-xs text-[#9a9a9a] leading-relaxed">
              Data-driven World Cup prediction platform. Analyzing 96 years of football history to forecast the next champion.
            </p>
          </div>

          {/* Sections */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-[#D4AF37] mb-3">Sections</h4>
            <ul className="space-y-1.5 text-xs text-[#9a9a9a]">
              <li>Historical Database (1930–2026)</li>
              <li>Prediction Engine</li>
              <li>Monte Carlo Simulator</li>
              <li>Team Analytics</li>
              <li>Head-to-Head Predictor</li>
            </ul>
          </div>

          {/* Tech */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-[#D4AF37] mb-3">Technology</h4>
            <ul className="space-y-1.5 text-xs text-[#9a9a9a]">
              <li>Next.js 16 + React 19 + TypeScript</li>
              <li>Tailwind CSS + shadcn/ui</li>
              <li>Framer Motion + Recharts</li>
              <li>XGBoost + LightGBM + ELO</li>
              <li>Monte Carlo Simulation</li>
            </ul>
          </div>

          {/* Disclaimer */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-[#D4AF37] mb-3">Disclaimer</h4>
            <p className="text-xs text-[#9a9a9a] leading-relaxed">
              Forecasts are based on historical data and statistical modeling. Football outcomes involve significant variance. For entertainment and analytical purposes only.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-[rgba(255,255,255,0.05)] flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-[#9a9a9a]">
            © 2026 FIFA Predictor · World Cup Forecast Platform 1930–2026
          </div>
          <div className="flex items-center gap-2 text-xs text-[#9a9a9a]">
            <span className="w-2 h-2 rounded-full bg-[#22c55e] pulse-dot" />
            <span>Engine status: Live · Models ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
