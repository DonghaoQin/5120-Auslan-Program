// src/components/AusStateMap.jsx
import React, { useEffect, useMemo, useState } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

const geoUrl =
  "https://raw.githubusercontent.com/rowanhogan/australian-states/master/states.geojson";

const API = import.meta.env.VITE_API_BASE || "https://auslan-backend.onrender.com";
const ENDPOINT = `${API}/map/state-pop-2021`; // returns {states:[{name,value}]}

// Utility: lighten/darken a hex color by percentage (negative = darker)
function shade(hex, percent) {
  const f = parseInt(hex.slice(1), 16);
  const t = percent < 0 ? 0 : 255;
  const p = Math.abs(percent) / 100;
  const R = f >> 16,
    G = (f >> 8) & 0xff,
    B = f & 0xff;
  const mix = (c) => Math.round((t - c) * p + c);
  return `#${(0x1000000 + (mix(R) << 16) + (mix(G) << 8) + mix(B))
    .toString(16)
    .slice(1)}`;
}

export default function AusStateMap({ height = 640, scale = 780 }) {
  const [rows, setRows] = useState([]); // [{name,value}]
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Marker coordinates (lon, lat)
  const stateCoords = useMemo(
    () => ({
      "New South Wales": [146.274, -32.5538],
      Victoria: [144.9, -37.8],
      Queensland: [144.313, -23.159],
      "South Australia": [134.8, -29.7],
      "Western Australia": [122.0188, -26.2146],
      Tasmania: [147.3, -42.9],
      "Northern Territory": [133.54, -19.9388],
      "Australian Capital Territory": [149.1, -35.3],
    }),
    []
  );

  // Pastel (desaturated) fills for each state
  // You can tweak any hex below to be even lighter if you like.
  const stateColors = useMemo(
    () => ({
      "New South Wales": "#FFB3BA", // light cornflower
      Victoria:  "#FFDFBA",          // light peach
      Queensland: "#FFFFBA",        // light mint
      "South Australia": "#BAFFC9", // light rose
      "Western Australia": "#BAE1FF", // light lavender
      Tasmania: "#E2BAFF",          // light latte
      "Northern Territory": "#FFD6E0", // light pink-lilac
      "Australian Capital Territory": "#FFF5BA", // light aqua
    }),
    []
  );

  // Small label offsets so text doesn't overlap the dot
  const labelOffset = useMemo(
    () => ({
      Queensland: { dx: 10, dy: 6 },
      Tasmania: { dx: 8, dy: 10 },
      "South Australia": { dx: -6, dy: 8 },
      Victoria: { dx: 10, dy: 8 },
      "Australian Capital Territory": { dx: 12, dy: 8 },
    }),
    []
  );

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const r = await fetch(ENDPOINT, { credentials: "omit" });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const j = await r.json();
        const list = Array.isArray(j?.states) ? j.states : [];
        if (!cancel) setRows(list);
      } catch (e) {
        if (!cancel) setError(String(e));
        console.error(e);
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, []);

  // Try multiple property names to read state name from the GeoJSON
  const getGeoStateName = (geo) => {
    const p = geo.properties || {};
    return p.STATE_NAME || p.STATE || p.STE_NAME || p.name || p.NAME || p.NAME_1 || "";
  };

  return (
    <div style={{ textAlign: "center", marginTop: 10 }}>
      <h3 style={{ marginBottom: 8 }}>Auslan Community Population by State (2021)</h3>
      {loading && <div>Loading map…</div>}
      {error && <div style={{ color: "#c00" }}>Failed to load data: {error}</div>}

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale, center: [135, -28] }}
        style={{ width: "100%", height }}
      >
        {/* Base map with pastel fills and crisp borders */}
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const name = getGeoStateName(geo);
              const fill = stateColors[name] || "#EEF2F7"; // very light fallback
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={fill}
                  stroke="#777" // slightly softer border than pure black
                  strokeWidth={0.7}
                  vectorEffect="non-scaling-stroke"
                  style={{
                    default: { outline: "none" },
                    hover: { fill: shade(fill, -8), outline: "none" },   // gentle darken on hover
                    pressed: { fill: shade(fill, -12), outline: "none" }, // a bit more when pressed
                  }}
                />
              );
            })
          }
        </Geographies>

        {/* Population markers + labels */}
        {rows.map((s) => {
          const coord = stateCoords[s.name];
          if (!coord) return null;
          const color = stateColors[s.name] || "#FFD9B3"; // pastel fallback dot
          const off = labelOffset[s.name] || { dx: 0, dy: -12 };

          return (
            <Marker key={s.name} coordinates={coord}>
              <circle r={7} fill={shade(color, -10)} stroke="#fff" strokeWidth={2} />
              <text
                textAnchor="start"
                x={off.dx}
                y={off.dy}
                style={{
                  fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
                  fontSize: 13,
                  fill: "#333",
                  paintOrder: "stroke",
                  stroke: "white",
                  strokeWidth: 3,
                  strokeLinejoin: "round",
                }}
              >
                {s.name}: {Number(s.value).toLocaleString()}
              </text>
            </Marker>
          );
        })}
      </ComposableMap>

      {/* Legend */}
      <div
        style={{
          display: "flex",
          gap: 14,
          justifyContent: "center",
          marginTop: 10,
          flexWrap: "wrap",
        }}
      >
        {Object.entries(stateColors).map(([name, c]) => (
          <span key={name} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                width: 12,
                height: 12,
                background: c,
                borderRadius: 2,
                border: "1px solid #777",
              }}
            />
            <span style={{ fontSize: 12, color: "#444" }}>{name}</span>
          </span>
        ))}
      </div>
    </div>
  );
}