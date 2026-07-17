"use client";

import { motion } from "framer-motion";
import { Trophy } from "../fifa/Trophy";
import { StadiumBackground } from "../fifa/StadiumBackground";
import { Sparkles, BarChart3, Play, ChevronRight } from "lucide-react";
import { tournamentStats } from "@/lib/data/tournaments";
import { LiveNewsBanner } from "@/components/fifa/LiveNewsBanner";
import { Flag } from "@/components/fifa/Flag";

interface HeroProps {
  onNavigate: (section: string) => void;
}

export function Hero({ onNavigate }: HeroProps) {
  const stats = [
    { label: "World Cups", value: 22, suffix: "" },
    { label: "Total Matches", value: 900 + 64 + 18, suffix: "+" },
    { label: "Total Goals", value: tournamentStats.totalGoals, suffix: "" },
    { label: "Champions", value: 8, suffix: "" },
  ];

  return (
    <section className="relative min-h-[90vh] stadium-bg overflow-hidden section-scroll">
      <StadiumBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20">
        {/* Live news ticker */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-4"
        >
          <LiveNewsBanner />
        </motion.div>

        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-center mb-6"
        >
          <div className="glass-gold rounded-full px-4 py-1.5 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-xs font-medium text-[#D4AF37] tracking-wider uppercase">
              2026 World Cup Live Now · Data-Driven Analytics · 1930 → 2030
            </span>
          </div>
        </motion.div>

        {/* Trophy */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center mb-2"
        >
          <div className="trophy-glow">
            <Trophy size={180} />
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tighter mb-3">
            <span className="shimmer-gold">FIFA PREDICTOR</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-2">
            Predicting World Cup Glory Using{" "}
            <span className="text-[#00E1FF] font-semibold">96 Years</span> of Football History
          </p>
          <p className="text-sm text-[#9a9a9a] max-w-xl mx-auto">
            ELO ratings · Monte Carlo simulations · Probabilistic forecasts · Deep team analytics
          </p>
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-3 mt-8"
        >
          <button
            onClick={() => onNavigate("predictions")}
            className="group relative overflow-hidden bg-gradient-to-r from-[#D4AF37] to-[#F5D67B] text-[#0B0B0B] font-bold px-6 py-3 rounded-lg flex items-center gap-2 hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all"
          >
            <Sparkles className="w-4 h-4" />
            Predict Next World Cup
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => onNavigate("history")}
            className="glass-blue text-white font-medium px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-[rgba(0,102,255,0.15)] transition-all"
          >
            <BarChart3 className="w-4 h-4 text-[#00E1FF]" />
            Explore History
          </button>
          <button
            onClick={() => onNavigate("simulator")}
            className="glass text-white font-medium px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-[rgba(255,255,255,0.08)] transition-all"
          >
            <Play className="w-4 h-4 text-[#D4AF37]" />
            Run Simulation
          </button>
        </motion.div>

        {/* Creators badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-6 text-center"
        >
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2">
            <span className="text-[10px] uppercase tracking-widest text-[#9a9a9a]">Created by</span>
            <span className="text-xs font-bold text-[#D4AF37]">OM SAI SAINI</span>
            <span className="text-[#9a9a9a]">·</span>
            <span className="text-xs font-bold text-[#00E1FF]">ARHAAM SETHIA</span>
          </div>
        </motion.div>

        {/* Live stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-5xl mx-auto"
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              className="glass rounded-xl p-5 hover-lift text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-gold-gradient mb-1">
                {stat.value.toLocaleString()}
                {stat.suffix}
              </div>
              <div className="text-xs uppercase tracking-wider text-[#9a9a9a]">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Most successful nations bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="mt-12 max-w-5xl mx-auto"
        >
          <div className="text-center mb-4">
            <span className="text-xs uppercase tracking-widest text-[#9a9a9a]">
              Most Successful Nations · World Cup Titles
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { country: "Brazil", code: "BR", titles: 5, color: "#FFCC29" },
              { country: "Germany", code: "DE", titles: 4, color: "#DD0000" },
              { country: "Italy", code: "IT", titles: 4, color: "#008C45" },
              { country: "Argentina", code: "AR", titles: 3, color: "#75AADB" },
            ].map((nation, i) => (
              <div
                key={i}
                className="glass rounded-lg p-3 flex items-center justify-between hover-lift"
              >
                <div className="flex items-center gap-2">
                  <Flag code={nation.code} size={28} />
                  <span className="text-sm font-medium text-white">{nation.country}</span>
                </div>
                <div
                  className="text-2xl font-bold"
                  style={{ color: nation.color, textShadow: `0 0 12px ${nation.color}80` }}
                >
                  {nation.titles}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
