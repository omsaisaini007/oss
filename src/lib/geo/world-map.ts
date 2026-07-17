/**
 * World Map Geometry Service
 * ============================================================
 *
 * Fetches real world country geometries (TopoJSON) from the world-atlas
 * CDN and converts them to GeoJSON features for rendering with d3-geo
 * projections. Cached after first fetch.
 *
 * @module lib/geo/world-map
 */

import { feature } from "topojson-client";
import { geoEqualEarth, geoPath, type GeoProjection } from "d3-geo";
import type { FeatureCollection, Geometry } from "geojson";

export interface CountryFeature {
  type: "Feature";
  properties: { name: string };
  geometry: Geometry;
}

const WORLD_ATLAS_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

let cachedFeatures: CountryFeature[] | null = null;
let fetchPromise: Promise<CountryFeature[]> | null = null;

/**
 * Fetch and cache world country geometries.
 * Returns an array of GeoJSON Feature objects with country names.
 */
export async function getWorldFeatures(): Promise<CountryFeature[]> {
  if (cachedFeatures) return cachedFeatures;
  if (fetchPromise) return fetchPromise;

  fetchPromise = (async () => {
    try {
      const res = await fetch(WORLD_ATLAS_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const topo = await res.json();
      const fc = feature(topo, topo.objects.countries) as unknown as FeatureCollection;
      cachedFeatures = fc.features as unknown as CountryFeature[];
      return cachedFeatures!;
    } catch (err) {
      console.error("[WorldMap] Failed to fetch world atlas:", err);
      throw err;
    } finally {
      fetchPromise = null;
    }
  })();

  return fetchPromise;
}

/**
 * Build a d3-geo projection fitted to the given width/height.
 * Uses geoEqualEarth for a modern, visually balanced world view.
 */
export function buildProjection(
  features: CountryFeature[],
  width: number,
  height: number
): GeoProjection {
  const collection: FeatureCollection = {
    type: "FeatureCollection",
    features: features as any,
  };
  return geoEqualEarth().fitSize([width, height], collection as any);
}

/**
 * Generate SVG path strings for all countries using the projection.
 */
export function projectCountries(
  features: CountryFeature[],
  projection: GeoProjection
): { name: string; path: string }[] {
  const pathGen = geoPath(projection);
  return features
    .map((f) => {
      const pathStr = pathGen(f as any);
      return { name: f.properties.name, path: pathStr || "" };
    })
    .filter((c) => c.path.length > 0);
}

/**
 * Project a [lng, lat] coordinate to [x, y] pixel coordinates.
 */
export function projectPoint(
  lng: number,
  lat: number,
  projection: GeoProjection
): [number, number] | null {
  const pt = projection([lng, lat]);
  return pt ? [pt[0], pt[1]] : null;
}
