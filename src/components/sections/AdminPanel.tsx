"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Settings, Database, Upload, Brain, Users, Plus, RefreshCw,
  CheckCircle2, AlertCircle, Activity,
} from "lucide-react";
import { teams } from "@/lib/data/teams";
import { Flag } from "@/components/fifa/Flag";

interface ActivityLog {
  id: number;
  timestamp: string;
  action: string;
  status: "success" | "pending" | "warning";
}

const initialLogs: ActivityLog[] = [
  { id: 1, timestamp: "2026-06-19 22:14", action: "Trained XGBoost model on 900 historical matches", status: "success" },
  { id: 2, timestamp: "2026-06-19 22:10", action: "Imported FIFA rankings CSV (June 2026)", status: "success" },
  { id: 3, timestamp: "2026-06-19 21:55", action: "Updated ELO ratings for 32 teams", status: "success" },
  { id: 4, timestamp: "2026-06-19 21:30", action: "Added 2026 tournament structure (48 teams)", status: "success" },
  { id: 5, timestamp: "2026-06-19 21:00", action: "Player data refresh from Transfermarkt API", status: "warning" },
  { id: 6, timestamp: "2026-06-19 20:45", action: "Pending: LightGBM retrain scheduled for 23:00 UTC", status: "pending" },
];

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState<"tournaments" | "teams" | "models" | "import">("tournaments");
  const [logs, setLogs] = useState<ActivityLog[]>(initialLogs);
  const [isTraining, setIsTraining] = useState(false);
  const [newTournament, setNewTournament] = useState({ year: "", host: "", winner: "" });

  const addLog = (action: string, status: ActivityLog["status"]) => {
    const newLog: ActivityLog = {
      id: logs.length + 1,
      timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
      action,
      status,
    };
    setLogs([newLog, ...logs]);
  };

  const triggerTraining = () => {
    setIsTraining(true);
    addLog("Started ensemble model training (XGBoost + LightGBM + NN)", "pending");
    setTimeout(() => {
      setIsTraining(false);
      addLog("Ensemble model training completed · accuracy: 87.3%", "success");
    }, 2500);
  };

  const addTournament = () => {
    if (!newTournament.year || !newTournament.host) return;
    addLog(`Added tournament ${newTournament.year} (${newTournament.host})`, "success");
    setNewTournament({ year: "", host: "", winner: "" });
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 section-scroll" id="admin">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-2">
            <Settings className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-xs uppercase tracking-widest text-[#D4AF37]">
              Admin Panel
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-2">
            Admin <span className="text-blue-gradient">Console</span>
          </h2>
          <p className="text-[#9a9a9a] max-w-2xl">
            Manage tournaments, teams, players, and ML models. Import CSVs, retrain predictors, and monitor system activity. (Read-only demo — no changes persist.)
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-6">
          {/* Main admin panel */}
          <div className="space-y-6">
            {/* Tabs */}
            <div className="flex gap-2 flex-wrap">
              {[
                { id: "tournaments" as const, label: "Tournaments", icon: <Database className="w-3.5 h-3.5" /> },
                { id: "teams" as const, label: "Teams", icon: <Users className="w-3.5 h-3.5" /> },
                { id: "models" as const, label: "ML Models", icon: <Brain className="w-3.5 h-3.5" /> },
                { id: "import" as const, label: "Import", icon: <Upload className="w-3.5 h-3.5" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? "glass-gold text-[#D4AF37] ring-1 ring-[#D4AF37]"
                      : "glass text-[#9a9a9a] hover:text-white"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {activeTab === "tournaments" && (
              <div className="glass rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Add New Tournament</h3>
                <div className="grid sm:grid-cols-3 gap-3 mb-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-[#9a9a9a] mb-1.5 block">
                      Year
                    </label>
                    <Input
                      type="number"
                      placeholder="e.g. 2030"
                      value={newTournament.year}
                      onChange={(e) => setNewTournament({ ...newTournament, year: e.target.value })}
                      className="bg-[#0B0B0B] border-[rgba(255,255,255,0.1)] text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-[#9a9a9a] mb-1.5 block">
                      Host Country
                    </label>
                    <Input
                      placeholder="e.g. Morocco"
                      value={newTournament.host}
                      onChange={(e) => setNewTournament({ ...newTournament, host: e.target.value })}
                      className="bg-[#0B0B0B] border-[rgba(255,255,255,0.1)] text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-[#9a9a9a] mb-1.5 block">
                      Winner (optional)
                    </label>
                    <Input
                      placeholder="TBD"
                      value={newTournament.winner}
                      onChange={(e) => setNewTournament({ ...newTournament, winner: e.target.value })}
                      className="bg-[#0B0B0B] border-[rgba(255,255,255,0.1)] text-white"
                    />
                  </div>
                </div>
                <Button
                  onClick={addTournament}
                  className="bg-[#D4AF37] text-[#0B0B0B] font-semibold hover:bg-[#F5D67B]"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Tournament
                </Button>

                <div className="mt-6 pt-6 border-t border-[rgba(255,255,255,0.1)]">
                  <h4 className="text-sm font-bold text-white mb-3">Existing Tournaments (recent 5)</h4>
                  <div className="space-y-2">
                    {[
                      { year: 2026, host: "USA / Canada / Mexico", status: "Upcoming" },
                      { year: 2022, host: "Qatar", status: "Complete" },
                      { year: 2018, host: "Russia", status: "Complete" },
                      { year: 2014, host: "Brazil", status: "Complete" },
                      { year: 2010, host: "South Africa", status: "Complete" },
                    ].map((t) => (
                      <div key={t.year} className="flex items-center justify-between p-3 glass rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-[#D4AF37]">{t.year}</span>
                          <span className="text-sm text-white">{t.host}</span>
                        </div>
                        <Badge
                          className={
                            t.status === "Upcoming"
                              ? "bg-[#0066FF] text-white"
                              : "bg-[#22c55e] text-[#0B0B0B]"
                          }
                        >
                          {t.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "teams" && (
              <div className="glass rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Team Management ({teams.length} teams)</h3>
                <div className="max-h-96 overflow-y-auto pr-1 space-y-2">
                  {teams.map((t) => (
                    <div key={t.code} className="flex items-center justify-between p-3 glass rounded-lg">
                      <div className="flex items-center gap-3">
                        <Flag code={t.code} size={24} />
                        <div>
                          <div className="text-sm font-semibold text-white">{t.name}</div>
                          <div className="text-xs text-[#9a9a9a]">
                            FIFA #{t.fifaRank} · ELO {t.eloRating} · {t.confederation}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[#D4AF37] border-[#D4AF37] text-xs">
                          {t.titles} {t.titles === 1 ? "title" : "titles"}
                        </Badge>
                        <Button size="sm" variant="ghost" className="text-xs text-[#9a9a9a] hover:text-white">
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "models" && (
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">ML Model Management</h3>
                    <p className="text-xs text-[#9a9a9a]">Train, retrain, and monitor prediction models</p>
                  </div>
                  <Button
                    onClick={triggerTraining}
                    disabled={isTraining}
                    className="bg-gradient-to-r from-[#D4AF37] to-[#F5D67B] text-[#0B0B0B] font-bold"
                  >
                    {isTraining ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                        Training...
                      </>
                    ) : (
                      <>
                        <Brain className="w-4 h-4 mr-1" />
                        Train Ensemble
                      </>
                    )}
                  </Button>
                </div>

                <div className="space-y-2">
                  {[
                    { name: "XGBoost", version: "v2.3.1", accuracy: "87.3%", lastTrained: "2 hours ago", status: "Healthy" },
                    { name: "Random Forest", version: "v1.8.0", accuracy: "85.1%", lastTrained: "1 day ago", status: "Healthy" },
                    { name: "LightGBM", version: "v3.1.2", accuracy: "86.8%", lastTrained: "5 hours ago", status: "Healthy" },
                    { name: "Neural Network", version: "v2.0.0", accuracy: "84.5%", lastTrained: "3 hours ago", status: "Healthy" },
                    { name: "Logistic Regression", version: "v1.2.0", accuracy: "82.9%", lastTrained: "1 week ago", status: "Stale" },
                    { name: "ELO Rating System", version: "v5.0.0", accuracy: "83.6%", lastTrained: "Live", status: "Active" },
                  ].map((m) => (
                    <div key={m.name} className="flex items-center justify-between p-3 glass rounded-lg">
                      <div className="flex items-center gap-3">
                        <Brain className="w-5 h-5 text-[#00E1FF]" />
                        <div>
                          <div className="text-sm font-semibold text-white">{m.name}</div>
                          <div className="text-xs text-[#9a9a9a]">
                            {m.version} · Last: {m.lastTrained}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-[#22c55e]">{m.accuracy}</span>
                        <Badge
                          className={
                            m.status === "Active"
                              ? "bg-[#0066FF] text-white"
                              : m.status === "Stale"
                              ? "bg-[#f97316] text-white"
                              : "bg-[#22c55e] text-[#0B0B0B]"
                          }
                        >
                          {m.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>

                {isTraining && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 p-4 glass-blue rounded-lg flex items-center gap-3"
                  >
                    <RefreshCw className="w-5 h-5 text-[#00E1FF] animate-spin" />
                    <div>
                      <div className="text-sm font-medium text-white">Training in progress...</div>
                      <div className="text-xs text-[#9a9a9a]">Processing 900 historical matches · 6 features · 5-fold cross validation</div>
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {activeTab === "import" && (
              <div className="glass rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">CSV Import</h3>
                <div className="border-2 border-dashed border-[rgba(212,175,55,0.3)] rounded-xl p-8 text-center">
                  <Upload className="w-10 h-10 text-[#D4AF37] mx-auto mb-3" />
                  <div className="text-sm font-medium text-white mb-1">
                    Drop CSV file here or click to browse
                  </div>
                  <div className="text-xs text-[#9a9a9a] mb-4">
                    Supported: match results, player stats, ELO updates, FIFA rankings
                  </div>
                  <Button
                    onClick={() => addLog("CSV import initiated (mock)", "success")}
                    className="bg-[#D4AF37] text-[#0B0B0B] font-semibold hover:bg-[#F5D67B]"
                  >
                    Browse Files
                  </Button>
                </div>

                <div className="mt-6">
                  <h4 className="text-sm font-bold text-white mb-3">Template Files</h4>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {[
                      "match_results_template.csv",
                      "player_stats_template.csv",
                      "elo_updates_template.csv",
                      "fifa_rankings_template.csv",
                    ].map((f) => (
                      <button
                        key={f}
                        onClick={() => addLog(`Downloaded ${f}`, "success")}
                        className="flex items-center gap-2 p-2.5 glass rounded-lg text-left hover:bg-[rgba(255,255,255,0.05)]"
                      >
                        <Upload className="w-3.5 h-3.5 text-[#00E1FF]" />
                        <span className="text-xs text-white">{f}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Activity log sidebar */}
          <div className="glass rounded-2xl p-6 h-fit sticky top-20">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-[#D4AF37]" />
              <h3 className="text-sm font-bold text-white">Activity Log</h3>
            </div>
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="flex gap-2 p-2.5 glass rounded-lg text-xs"
                >
                  {log.status === "success" && <CheckCircle2 className="w-3.5 h-3.5 text-[#22c55e] flex-shrink-0 mt-0.5" />}
                  {log.status === "pending" && <RefreshCw className="w-3.5 h-3.5 text-[#00E1FF] flex-shrink-0 mt-0.5" />}
                  {log.status === "warning" && <AlertCircle className="w-3.5 h-3.5 text-[#f97316] flex-shrink-0 mt-0.5" />}
                  <div className="flex-1 min-w-0">
                    <div className="text-white leading-tight">{log.action}</div>
                    <div className="text-[10px] text-[#9a9a9a] mt-0.5">{log.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
