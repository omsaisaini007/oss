"use client";

interface FlagProps {
  /** ISO 3166-1 alpha-2 country code (e.g. "BR", "AR", "FR") */
  code: string;
  /** Pixel width of the flag image (height auto-scales to ~2:3 ratio) */
  size?: number;
  className?: string;
  /** Optional alt text — defaults to the country code */
  alt?: string;
}

/**
 * Real Country Flag Component
 * — Renders an actual country flag image from flagcdn.com (a free,
 *   fast CDN serving high-quality flag images by ISO 3166-1 alpha-2 code).
 *
 * Special handling:
 *   - "GB-ENG" → England flag (St George's Cross) via gb-eng code
 *   - "GB" → also maps to gb-eng (England competes separately in FIFA)
 *   - "TBD" / empty / unknown → renders nothing (returns null)
 *   - Falls back to a subtle neutral placeholder if the image fails to load
 *
 * @example
 * <Flag code="BR" size={32} />
 * <Flag code="AR" size={48} className="rounded" />
 */
export function Flag({ code, size = 32, className = "", alt }: FlagProps) {
  // Don't render anything for TBD/empty/unknown codes
  if (!code || typeof code !== "string") return null;
  const trimmed = code.trim().toUpperCase();
  if (!trimmed || trimmed === "TBD" || trimmed === "N/A" || trimmed === "-") return null;

  // Normalize: England uses gb-eng on flagcdn
  const normalizedCode = trimmed === "GB-ENG" || trimmed === "GB"
    ? "gb-eng"
    : trimmed.toLowerCase();

  const width = size;
  const height = Math.round(size * 0.66); // 2:3 aspect ratio
  // Use a high-resolution source image, displayed at the requested CSS size
  const sourceWidth = Math.max(80, Math.ceil(width * 2));
  const url = `https://flagcdn.com/w${sourceWidth}/${normalizedCode}.png`;

  return (
    <img
      src={url}
      width={width}
      height={height}
      alt={alt || code}
      loading="lazy"
      className={`inline-block object-cover flex-shrink-0 ${className}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        borderRadius: "2px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
        verticalAlign: "middle",
      }}
      onError={(e) => {
        // Fallback: hide broken image gracefully
        const img = e.currentTarget as HTMLImageElement;
        img.style.visibility = "hidden";
        img.style.width = "0";
        img.style.height = "0";
      }}
    />
  );
}

/**
 * Helper: get the flag URL for a country code (for use in CSS backgrounds, etc.)
 */
export function getFlagUrl(code: string, width: number = 80): string {
  if (!code) return "";
  const trimmed = code.trim().toUpperCase();
  if (!trimmed || trimmed === "TBD" || trimmed === "N/A" || trimmed === "-") return "";
  const normalizedCode = trimmed === "GB-ENG" || trimmed === "GB"
    ? "gb-eng"
    : trimmed.toLowerCase();
  return `https://flagcdn.com/w${width}/${normalizedCode}.png`;
}
