"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, MapPin, Calendar, Trophy, Users, Loader2, ZoomIn, ZoomOut } from "lucide-react";
import { tournaments } from "@/lib/data/tournaments";
import { hostCities, HostCity } from "@/lib/geo/host-cities";
import { getWorldFeatures, buildProjection, projectCountries, projectPoint, CountryFeature } from "@/lib/geo/world-map";
import { Flag } from "@/components/fifa/Flag";

/** Map host country names (as stored in host-cities) to ISO codes for flag rendering. */
const HOST_CODE_MAP: Record<string, string> = {
  "Uruguay": "UY", "Italy": "IT", "France": "FR", "Brazil": "BR",
  "Switzerland": "CH", "Sweden": "SE", "Chile": "CL", "England": "GB-ENG",
  "Mexico": "MX", "West Germany": "DE", "Germany": "DE", "Argentina": "AR",
  "Spain": "ES", "United States": "US", "Japan": "JP", "South Korea": "KR",
  "South Africa": "ZA", "Russia": "RU", "Qatar": "QA", "Canada": "CA",
  "Portugal": "PT", "Morocco": "MA",
};
function getHostCode(host: string): string {
  return HOST_CODE_MAP[host] || "";
}

export function WorldMap() {
  const [features, setFeatures] = useState<CountryFeature[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(2022);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  const mapWidth = 1000;
  const mapHeight = 520;

  useEffect(() => {
    let cancelled = false;
    getWorldFeatures()
      .then((f) => { if (!cancelled) setFeatures(f); })
      .catch((e) => { if (!cancelled) setLoadError(e?.message || "Failed to load map"); });
    return () => { cancelled = true; };
  }, []);

  // Build projection + projected country paths
  const { projection, countryPaths } = useMemo(() => {
    if (!features) return { projection: null, countryPaths: [] };
    const proj = buildProjection(features, mapWidth, mapHeight);
    const paths = projectCountries(features, proj);
    return { projection: proj, countryPaths: paths };
  }, [features]);

  // Highlighted host countries
  const hostCountriesByYear = useMemo(() => {
    const map = new Map<number, string[]>();
    tournaments.forEach((t) => {
      map.set(t.year, t.host.split(" / "));
    });
    return map;
  }, []);

  const selected = tournaments.find((t) => t.year === selectedYear);
  const selectedHostCities = useMemo(
    () => hostCities.filter((c) => c.year === selectedYear),
    [selectedYear]
  );

  const isHostCountry = (countryName: string): boolean => {
    if (!selectedYear) return false;
    const hosts = hostCountriesByYear.get(selectedYear) || [];
    // Normalize names (world-atlas uses "United States of America", our data uses "United States")
    const normalized = countryName.toLowerCase();
    return hosts.some((h) => {
      const nh = h.toLowerCase();
      return normalized.includes(nh) || nh.includes(normalized) ||
        (normalized === "united states of america" && nh === "united states") ||
        (normalized === "korea" && nh === "south korea");
    });
  };

  const handleZoomIn = () => setZoom((z) => Math.min(3, z * 1.3));
  const handleZoomOut = () => {
    setZoom((z) => Math.max(1, z / 1.3));
    if (zoom <= 1.3) setPan({ x: 0, y: 0 });
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 section-scroll" id="map">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-xs uppercase tracking-widest text-[#D4AF37]">
              Interactive World Map · Real Geography
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-2">
            Host Nations <span className="text-blue-gradient">Atlas</span>
          </h2>
          <p className="text-[#9a9a9a] max-w-2xl">
            Every World Cup host city plotted on a real world map with actual country geometries. Hover any country to see its name, click any pin to see stadium details, attendance, and host cities for that tournament.
          </p>
        </motion.div>

        {/* Map */}
        <div className="glass rounded-2xl p-4 mb-6 relative overflow-hidden">
          {/* Zoom controls */}
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
            <button
              onClick={handleZoomIn}
              className="glass rounded-lg p-2 hover:bg-[rgba(212,175,55,0.1)] transition-all"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4 text-[#D4AF37]" />
            </button>
            <button
              onClick={handleZoomOut}
              className="glass rounded-lg p-2 hover:bg-[rgba(212,175,55,0.1)] transition-all"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4 text-[#D4AF37]" />
            </button>
          </div>

          {/* Hovered country tooltip */}
          {hoveredCountry && (
            <div className="absolute top-4 left-4 z-10 glass-gold rounded-lg px-3 py-1.5 text-xs text-white pointer-events-none">
              {hoveredCountry}
              {isHostCountry(hoveredCountry) && (
                <span className="ml-2 text-[#D4AF37] font-semibold">· Host</span>
              )}
            </div>
          )}

          {!features && !loadError && (
            <div className="flex items-center justify-center h-[400px] flex-col gap-3">
              <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
              <span className="text-sm text-[#9a9a9a]">Loading world geography…</span>
            </div>
          )}

          {loadError && (
            <div className="flex items-center justify-center h-[400px] flex-col gap-2 text-center">
              <Globe className="w-10 h-10 text-[#9a9a9a]" />
              <span className="text-sm text-[#f97316]">Failed to load map: {loadError}</span>
              <span className="text-xs text-[#9a9a9a]">Check your network connection.</span>
            </div>
          )}

          {features && projection && (
            <svg
              ref={svgRef}
              viewBox={`0 0 ${mapWidth} ${mapHeight}`}
              className="w-full h-auto"
              style={{ maxHeight: "560px", cursor: "grab" }}
            >
              <defs>
                <radialGradient id="ocean-grad" cx="50%" cy="50%" r="70%">
                  <stop offset="0%" stopColor="#0a1428" />
                  <stop offset="100%" stopColor="#050510" />
                </radialGradient>
                <linearGradient id="country-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1a2845" />
                  <stop offset="100%" stopColor="#0f1a2e" />
                </linearGradient>
                <linearGradient id="host-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3d2f0a" />
                  <stop offset="100%" stopColor="#1f1804" />
                </linearGradient>
                <filter id="pin-glow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Ocean background */}
              <rect width={mapWidth} height={mapHeight} fill="url(#ocean-grad)" />

              {/* Graticule lines (latitude/longitude grid) */}
              <g stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" fill="none">
                {/* Equator */}
                <line x1="0" y1={mapHeight / 2 - 20} x2={mapWidth} y2={mapHeight / 2 - 20} stroke="rgba(212,175,55,0.15)" strokeWidth="0.8" />
                {/* Prime meridian approx */}
                <line x1={mapWidth / 2} y1="0" x2={mapWidth / 2} y2={mapHeight} stroke="rgba(212,175,55,0.1)" strokeWidth="0.5" />
              </g>

              {/* Country paths */}
              <g
                transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}
                style={{ transformOrigin: `${mapWidth / 2}px ${mapHeight / 2}px` }}
              >
                {countryPaths.map((c, i) => {
                  const isHost = isHostCountry(c.name);
                  const isHovered = hoveredCountry === c.name;
                  return (
                    <path
                      key={i}
                      d={c.path}
                      fill={isHost ? "url(#host-fill)" : "url(#country-fill)"}
                      stroke={isHost ? "#D4AF37" : isHovered ? "#00E1FF" : "rgba(255,255,255,0.15)"}
                      strokeWidth={isHost ? 0.8 : isHovered ? 0.8 : 0.4}
                      style={{ cursor: "pointer", transition: "fill 0.2s, stroke 0.2s" }}
                      onMouseEnter={() => setHoveredCountry(c.name)}
                      onMouseLeave={() => setHoveredCountry(null)}
                    />
                  );
                })}

                {/* Host city pins */}
                {hostCities.map((city, i) => {
                  const pt = projectPoint(city.lng, city.lat, projection);
                  if (!pt) return null;
                  const [x, y] = pt;
                  const isSelected = selectedYear === city.year;
                  const isHovered = hoveredYear === city.year;
                  const isUpcoming = city.year >= 2026;
                  const pinColor = isUpcoming ? "#00E1FF" : "#D4AF37";
                  const pinSize = isSelected ? 8 : isHovered ? 6 : 4;

                  return (
                    <g
                      key={i}
                      onMouseEnter={() => setHoveredYear(city.year)}
                      onMouseLeave={() => setHoveredYear(null)}
                      onClick={() => setSelectedYear(city.year)}
                      style={{ cursor: "pointer" }}
                    >
                      {/* Glow ring for selected/hovered */}
                      {(isSelected || isHovered) && (
                        <circle
                          cx={x}
                          cy={y}
                          r={pinSize + 6}
                          fill={pinColor}
                          opacity="0.2"
                          filter="url(#pin-glow)"
                        />
                      )}
                      {/* Outer ring */}
                      <circle
                        cx={x}
                        cy={y}
                        r={pinSize + 2}
                        fill="none"
                        stroke={pinColor}
                        strokeWidth="1"
                        opacity="0.6"
                      />
                      {/* Inner pin */}
                      <circle
                        cx={x}
                        cy={y}
                        r={pinSize}
                        fill={pinColor}
                        stroke="#0B0B0B"
                        strokeWidth="1.5"
                        style={{ filter: `drop-shadow(0 0 4px ${pinColor})` }}
                      />
                      {/* Pulse for upcoming/ongoing */}
                      {isUpcoming && (
                        <circle cx={x} cy={y} r={pinSize} fill={pinColor} opacity="0.4">
                          <animate attributeName="r" from={pinSize} to={pinSize + 8} dur="2s" repeatCount="indefinite" />
                          <animate attributeName="opacity" from="0.4" to="0" dur="2s" repeatCount="indefinite" />
                        </circle>
                      )}
                      {/* Label for selected/hovered */}
                      {(isSelected || isHovered) && (
                        <g>
                          <rect
                            x={x + pinSize + 4}
                            y={y - 8}
                            width={56}
                            height={16}
                            rx={3}
                            fill="#0B0B0B"
                            stroke={pinColor}
                            strokeWidth="0.5"
                            opacity="0.9"
                          />
                          <text
                            x={x + pinSize + 8}
                            y={y + 3}
                            fill={pinColor}
                            fontSize="9"
                            fontWeight="bold"
                          >
                            {city.year}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </g>
            </svg>
          )}
        </div>

        {/* Timeline scroll */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-6">
          {tournaments.map((t) => (
            <button
              key={t.year}
              onClick={() => setSelectedYear(t.year)}
              onMouseEnter={() => setHoveredYear(t.year)}
              onMouseLeave={() => setHoveredYear(null)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedYear === t.year
                  ? "bg-[#D4AF37] text-[#0B0B0B]"
                  : t.year === 2026
                  ? "glass text-[#ef4444] border border-[#ef4444]/30"
                  : t.year === 2030
                  ? "glass text-[#00E1FF] border border-[#0066FF]/30"
                  : "glass text-[#9a9a9a] hover:text-white"
              }`}
            >
              {t.year}
              {t.year === 2026 && <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444] animate-pulse" />}
            </button>
          ))}
        </div>

        {/* Selected tournament detail + host cities */}
        <AnimatePresence mode="wait">
          {selected && (
            <motion.div
              key={selectedYear}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid lg:grid-cols-3 gap-6"
            >
              {/* Tournament summary */}
              <div className="glass rounded-2xl p-6">
                <div className="text-5xl font-black text-gold-gradient mb-2">
                  {selected.year}
                </div>
                <div className="flex items-center gap-2 text-sm text-[#9a9a9a] mb-3">
                  <MapPin className="w-4 h-4 text-[#D4AF37]" />
                  {selected.host}
                </div>
                {selected.year < 2026 && (
                  <div className="text-xs text-[#9a9a9a] mb-4">
                    📍 {selected.finalCity} · {selected.finalStadium}
                  </div>
                )}
                {selected.year === 2026 && (
                  <div className="text-xs text-[#ef4444] font-semibold mb-4 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#ef4444] animate-pulse" />
                    Tournament Ongoing
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1 text-xs uppercase tracking-wider text-[#D4AF37]">
                      <Trophy className="w-3.5 h-3.5" /> Champion
                    </div>
                    <div className="text-lg font-bold text-[#D4AF37] flex items-center gap-2">
                      <Flag code={selected.winnerCode} size={22} />
                      {selected.winner}
                    </div>
                    {selected.year < 2026 && (
                      <div className="text-xs text-[#9a9a9a] mt-1 flex items-center gap-1.5">
                        Runner-up: <Flag code={selected.runnerUpCode} size={16} /> {selected.runnerUp} · {selected.finalScore}
                      </div>
                    )}
                  </div>
                  <div className="pt-3 border-t border-[rgba(255,255,255,0.1)]">
                    <div className="flex items-center gap-2 mb-1 text-xs uppercase tracking-wider text-[#00E1FF]">
                      <Users className="w-3.5 h-3.5" /> Participation
                    </div>
                    <div className="text-sm text-white">{selected.teams} teams · {selected.matches} matches</div>
                    <div className="text-xs text-[#9a9a9a]">{selected.goals} goals · {selected.avgGoals} avg/match</div>
                  </div>
                </div>
              </div>

              {/* Host cities & stadiums */}
              <div className="lg:col-span-2 glass rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-4 h-4 text-[#00E1FF]" />
                  <h3 className="text-base font-bold text-white">
                    Host Cities & Stadiums ({selectedHostCities.length})
                  </h3>
                </div>
                {selectedHostCities.length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {selectedHostCities.map((c, i) => (
                      <div
                        key={i}
                        className={`p-3 glass rounded-lg ${
                          c.isFinal ? "border-l-2 border-l-[#D4AF37]" : ""
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-semibold text-white flex items-center gap-1.5">
                            <Flag code={getHostCode(c.hostCountry)} size={18} />
                            {c.city}
                          </span>
                          {c.isFinal && (
                            <span className="text-[9px] uppercase tracking-wider text-[#D4AF37] font-bold">
                              Final
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-[#9a9a9a] mb-1">🏟️ {c.stadium}</div>
                        <div className="text-xs text-[#9a9a9a]">
                          📍 {c.hostCountry}
                          {selected.year < 2026 && (
                            <span className="ml-2 text-[#22c55e]">
                              👥 {(c.attendance / 1000).toFixed(0)}K
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-[#9a9a9a] py-4 text-center">
                    Host city details pending for {selected.year}
                  </div>
                )}

                {/* Mini attendance bar chart for past tournaments */}
                {selected.year < 2026 && selectedHostCities.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.1)]">
                    <div className="text-xs uppercase tracking-wider text-[#9a9a9a] mb-2">
                      Top Attendance
                    </div>
                    <div className="space-y-1.5">
                      {selectedHostCities
                        .sort((a, b) => b.attendance - a.attendance)
                        .slice(0, 3)
                        .map((c, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <span className="text-xs text-white w-24 truncate">{c.city}</span>
                            <div className="flex-1 h-2 bg-[#0B0B0B] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F5D67B]"
                                style={{ width: `${(c.attendance / 200000) * 100}%` }}
                              />
                            </div>
                            <span className="text-xs text-[#D4AF37] font-semibold w-12 text-right">
                              {(c.attendance / 1000).toFixed(0)}K
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
