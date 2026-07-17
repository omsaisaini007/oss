"use client";

import { useState, useEffect, Suspense, lazy, useCallback } from "react";
import { Navbar } from "@/components/fifa/Navbar";
import { Footer } from "@/components/fifa/Footer";
import { CreatorCredits } from "@/components/fifa/CreatorCredits";
import { MashupPlayer } from "@/components/fifa/MashupPlayer";
import { Hero } from "@/components/sections/Hero";
import { HistoricalDatabase } from "@/components/sections/HistoricalDatabase";
import { PredictionEngine } from "@/components/sections/PredictionEngine";
import { WorldCupSimulator } from "@/components/sections/WorldCupSimulator";

// Lazy-load below-the-fold sections to make initial page paint much faster.
// Each loads only when the user scrolls near it.
const TeamAnalysis = lazy(() =>
  import("@/components/sections/TeamAnalysis").then((m) => ({ default: m.TeamAnalysis }))
);
const HeadToHead = lazy(() =>
  import("@/components/sections/HeadToHead").then((m) => ({ default: m.HeadToHead }))
);
const HistoricalTrends = lazy(() =>
  import("@/components/sections/HistoricalTrends").then((m) => ({ default: m.HistoricalTrends }))
);
const PlayerAnalytics = lazy(() =>
  import("@/components/sections/PlayerAnalytics").then((m) => ({ default: m.PlayerAnalytics }))
);
const WorldMap = lazy(() =>
  import("@/components/sections/WorldMap").then((m) => ({ default: m.WorldMap }))
);
const PredictionDashboard = lazy(() =>
  import("@/components/sections/PredictionDashboard").then((m) => ({
    default: m.PredictionDashboard,
  }))
);
const RecordsMilestones = lazy(() =>
  import("@/components/sections/RecordsMilestones").then((m) => ({ default: m.RecordsMilestones }))
);
const PlayerCompare = lazy(() =>
  import("@/components/sections/PlayerCompare").then((m) => ({ default: m.PlayerCompare }))
);
const WorldCupQuiz = lazy(() =>
  import("@/components/sections/WorldCupQuiz").then((m) => ({ default: m.WorldCupQuiz }))
);
const AdvancedSimulator = lazy(() =>
  import("@/components/sections/advanced/AdvancedSimulator").then((m) => ({
    default: m.AdvancedSimulator,
  }))
);
const WhatIfSimulator = lazy(() =>
  import("@/components/sections/advanced/WhatIfSimulator").then((m) => ({
    default: m.WhatIfSimulator,
  }))
);
const AIAnalyst = lazy(() =>
  import("@/components/sections/advanced/Analyst").then((m) => ({ default: m.Analyst }))
);
const AdminPanel = lazy(() =>
  import("@/components/sections/AdminPanel").then((m) => ({ default: m.AdminPanel }))
);

function SectionSkeleton() {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="h-8 w-64 bg-[#1a1a1a] rounded-lg animate-pulse mb-3" />
        <div className="h-4 w-96 max-w-full bg-[#1a1a1a] rounded animate-pulse mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-64 bg-[#141414] rounded-2xl animate-pulse" />
          <div className="h-64 bg-[#141414] rounded-2xl animate-pulse" />
          <div className="h-64 bg-[#141414] rounded-2xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [activeSection, setActiveSection] = useState("home");

  // Track scroll position to update active nav
  useEffect(() => {
    const sections = [
      "home", "history", "predictions", "simulator", "teams",
      "h2h", "trends", "players", "compare", "map", "dashboard",
      "records", "advanced-sim", "whatif", "analyst-chat", "quiz", "admin",
    ];

    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        for (let i = sections.length - 1; i >= 0; i--) {
          const el = document.getElementById(sections[i]);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= 120) {
              setActiveSection(sections[i]);
              break;
            }
          }
        }
        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigate = useCallback((section: string) => {
    setActiveSection(section);
    const el = document.getElementById(section);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0B0B]" style={{ paddingBottom: "60px" }}>
      <Navbar activeSection={activeSection} onNavigate={handleNavigate} />
      <main className="flex-1">
        <div id="home">
          <Hero onNavigate={handleNavigate} />
        </div>
        <HistoricalDatabase />
        <PredictionEngine />
        <WorldCupSimulator />
        <Suspense fallback={<SectionSkeleton />}>
          <TeamAnalysis />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <HeadToHead />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <HistoricalTrends />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <PlayerAnalytics />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <PlayerCompare />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <WorldMap />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <PredictionDashboard />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <RecordsMilestones />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <AdvancedSimulator />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <WhatIfSimulator />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <AIAnalyst />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <WorldCupQuiz />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <AdminPanel />
        </Suspense>
        <CreatorCredits />
      </main>
      <Footer />
      <MashupPlayer />
    </div>
  );
}
