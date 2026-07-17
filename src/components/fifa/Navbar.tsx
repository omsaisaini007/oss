"use client";

import { motion } from "framer-motion";
import { Trophy } from "lucide-react";

interface NavbarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

const navItems = [
  { id: "home", label: "Home" },
  { id: "history", label: "History" },
  { id: "predictions", label: "Predictions" },
  { id: "simulator", label: "Simulator" },
  { id: "teams", label: "Teams" },
  { id: "h2h", label: "H2H" },
  { id: "trends", label: "Trends" },
  { id: "players", label: "Players" },
  { id: "compare", label: "Compare" },
  { id: "map", label: "World Map" },
  { id: "dashboard", label: "Dashboard" },
  { id: "records", label: "Records" },
  { id: "advanced-sim", label: "v2 Sim" },
  { id: "whatif", label: "What-If" },
  { id: "analyst-chat", label: "Analyst" },
  { id: "quiz", label: "Quiz" },
  { id: "admin", label: "Admin" },
];

export function Navbar({ activeSection, onNavigate }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 glass border-b border-[rgba(212,175,55,0.2)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center gap-2 group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-[#D4AF37] rounded-full blur-md opacity-50 group-hover:opacity-80 transition-opacity" />
              <Trophy className="w-7 h-7 text-[#D4AF37] relative z-10" />
            </div>
            <div className="flex flex-col items-start leading-none">
              <span className="text-lg font-bold tracking-tight">
                <span className="text-white">FIFA</span>{" "}
                <span className="shimmer-gold">PREDICTOR</span>
              </span>
              <span className="text-[10px] text-[#9a9a9a] tracking-wider">
                1930–2026
              </span>
            </div>
          </button>

          {/* Nav items (desktop) */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`relative px-3 py-2 text-sm font-medium rounded-md transition-all ${
                  activeSection === item.id
                    ? "text-[#D4AF37]"
                    : "text-[#9a9a9a] hover:text-white"
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"
                    style={{ boxShadow: "0 0 8px #D4AF37" }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Mobile dropdown (simplified — scrollable pills) */}
          <div className="lg:hidden">
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar max-w-[200px]">
              {navItems.slice(0, 4).map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`px-2 py-1 text-xs whitespace-nowrap rounded ${
                    activeSection === item.id
                      ? "text-[#D4AF37]"
                      : "text-[#9a9a9a]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <select
                value=""
                onChange={(e) => e.target.value && onNavigate(e.target.value)}
                className="bg-[#141414] border border-[rgba(255,255,255,0.1)] text-xs text-white rounded px-2 py-1"
              >
                <option value="">More ▾</option>
                {navItems.slice(4).map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
