"use client";

import { useMemo } from "react";

interface StadiumBackgroundProps {
  className?: string;
}

/**
 * Enhanced animated stadium scene with:
 *   - Crowd silhouette (tiered stands with tiny dots for fans)
 *   - Pitch with mowed stripes
 *   - Floodlight pylons with rotating light cones
 *   - Floating data particles (gold + neon blue)
 *   - Searchlight sweeps across the sky
 *   - Volumetric glow around the trophy area
 */
export function StadiumBackground({ className = "" }: StadiumBackgroundProps) {
  const particles = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 15,
      duration: 8 + Math.random() * 12,
      size: 1.5 + Math.random() * 3,
      color: Math.random() > 0.5 ? "#00E1FF" : "#D4AF37",
      opacity: 0.4 + Math.random() * 0.5,
    }));
  }, []);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Sky gradient backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(0,102,255,0.12) 0%, transparent 50%), linear-gradient(180deg, #0a0a1a 0%, #0a1428 50%, #050510 100%)",
        }}
      />

      {/* Trophy area glow */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(212,175,55,0.2) 0%, transparent 45%)" }}
      />

      {/* Animated searchlight sweeps */}
      <div className="absolute inset-0 overflow-hidden">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute top-0"
            style={{
              left: `${20 + i * 30}%`,
              width: "200px",
              height: "100%",
              background: "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 60%)",
              transformOrigin: "top center",
              transform: `rotate(${i % 2 === 0 ? -8 : 8}deg)`,
              animation: `searchlight-${i} ${8 + i * 2}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      {/* Stadium silhouette SVG */}
      <svg
        className="absolute bottom-0 left-0 w-full h-1/2 opacity-70"
        viewBox="0 0 1200 300"
        preserveAspectRatio="xMidYMax slice"
        fill="none"
      >
        <defs>
          <linearGradient id="light-cone-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.18" />
            <stop offset="50%" stopColor="#00E1FF" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="pitch-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0a3a0a" />
            <stop offset="100%" stopColor="#051f05" />
          </linearGradient>
          <linearGradient id="stand-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a1a1a" />
            <stop offset="100%" stopColor="#0a0a0a" />
          </linearGradient>
        </defs>
        {/* Left stand with tiers */}
        <path d="M 0 300 L 0 120 L 80 100 L 200 80 L 380 110 L 380 300 Z" fill="url(#stand-grad)" stroke="#D4AF37" strokeWidth="0.5" strokeOpacity="0.3" />
        {/* Right stand with tiers */}
        <path d="M 820 300 L 820 110 L 1000 80 L 1120 100 L 1200 120 L 1200 300 Z" fill="url(#stand-grad)" stroke="#D4AF37" strokeWidth="0.5" strokeOpacity="0.3" />
        {/* Center stand — main tier */}
        <path d="M 380 300 L 380 110 L 580 70 L 760 90 L 820 110 L 820 300 Z" fill="url(#stand-grad)" stroke="#D4AF37" strokeWidth="0.5" strokeOpacity="0.5" />

        {/* Crowd dots — tiny scattered pixels in the stands */}
        {Array.from({ length: 60 }).map((_, i) => {
          const x = 20 + (i * 19) % 1160;
          const y = 90 + Math.floor(i / 30) * 12 + ((i * 7) % 10);
          const inStands =
            (x < 380 || (x > 410 && x < 760) || x > 820) && y < 200;
          if (!inStands) return null;
          const colors = ["#D4AF37", "#00E1FF", "#FFFFFF", "#0066FF", "#F5D67B"];
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="1.2"
              fill={colors[i % colors.length]}
              opacity="0.4"
            />
          );
        })}

        {/* Floodlight pylons */}
        {[80, 1120].map((x, i) => (
          <g key={i}>
            <rect x={x} y="20" width="3" height="200" fill="#2a2a2a" />
            <rect x={x - 22} y="14" width="44" height="16" fill="#2a2a2a" stroke="#D4AF37" strokeWidth="0.6" />
            {/* Light bulbs */}
            {[0, 1, 2].map((row) =>
              [0, 1, 2, 3, 4].map((col) => (
                <circle
                  key={`${row}-${col}`}
                  cx={x - 19 + col * 9.5}
                  cy={17 + row * 4.5}
                  r="1.8"
                  fill="#FFF5C8"
                  opacity="0.95"
                >
                  <animate
                    attributeName="opacity"
                    values="0.95;0.5;0.95"
                    dur={`${2 + (row + col) * 0.3}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              ))
            )}
            {/* Light cone */}
            <polygon
              points={`${x - 22},30 ${x + 22},30 ${x + 250},290 ${x - 250},290`}
              fill="url(#light-cone-grad)"
            />
          </g>
        ))}

        {/* Pitch with mowed stripes */}
        <path d="M 0 300 L 0 280 Q 600 240 1200 280 L 1200 300 Z" fill="url(#pitch-grad)" />
        {/* Pitch stripes */}
        {Array.from({ length: 12 }).map((_, i) => (
          <rect
            key={i}
            x={i * 100}
            y={268}
            width="50"
            height="32"
            fill={i % 2 === 0 ? "#0a3a0a" : "#0f4a0f"}
            opacity="0.5"
          />
        ))}
        {/* Center line */}
        <line x1="600" y1="265" x2="600" y2="300" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.3" />
        {/* Center circle */}
        <ellipse cx="600" cy="285" rx="40" ry="6" fill="none" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.3" />
      </svg>

      {/* Floating data particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: `${p.left}%`,
            bottom: "-10px",
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.color,
            opacity: p.opacity,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            boxShadow: `0 0 ${p.size * 2.5}px ${p.color}`,
          }}
        />
      ))}

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 grid-pattern opacity-20" />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      <style jsx>{`
        @keyframes searchlight-0 {
          0%, 100% { transform: rotate(-8deg) translateX(0); opacity: 0.6; }
          50% { transform: rotate(8deg) translateX(80px); opacity: 0.3; }
        }
        @keyframes searchlight-1 {
          0%, 100% { transform: rotate(8deg) translateX(0); opacity: 0.5; }
          50% { transform: rotate(-8deg) translateX(-60px); opacity: 0.2; }
        }
        @keyframes searchlight-2 {
          0%, 100% { transform: rotate(-5deg) translateX(0); opacity: 0.4; }
          50% { transform: rotate(5deg) translateX(40px); opacity: 0.2; }
        }
      `}</style>
    </div>
  );
}
