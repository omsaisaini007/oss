"use client";

interface TrophyProps {
  size?: number;
  className?: string;
}

/**
 * FIFA 2026 Logo
 * — Displays the official-style FIFA 2026 logo image from /public.
 * Inherits the trophy-glow pulse animation from the parent.
 */
export function Trophy({ size = 200, className = "" }: TrophyProps) {
  return (
    <div
      className={`trophy-svg ${className}`}
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img
        src="/2026-fifa-logo.png"
        alt="FIFA 2026"
        width={size}
        height={size}
        style={{
          maxWidth: "100%",
          maxHeight: "100%",
          objectFit: "contain",
          filter: "drop-shadow(0 0 25px rgba(212, 175, 55, 0.5)) drop-shadow(0 0 50px rgba(212, 175, 55, 0.2))",
        }}
      />
    </div>
  );
}
