// src/components/AusStateMap.jsx
import React, { useEffect, useMemo, useState } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

// 澳洲各州 GeoJSON
const GEO_URL =
  "https://raw.githubusercontent.com/rowanhogan/australian-states/master/states.geojson";

// 優先用環境變數，沒有就用 Render 網域
const API_BASE = import.meta.env?.VITE_API_BASE || "https://auslan-backend.onrender.com";
const ENDPOINT = `${API_BASE}/map/state-pop`; // 期望 { states:[{name,value}] }

export default function AusStateMap() {
  const [rows, setRows] = useState([]);   // [{ name, value }]
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 各州標註點（lon, lat）
  const stateCoords = useMemo(
    () => ({
      "New South Wales": [151.2, -33.9],
      Victoria: [144.9, -37.8],
      Queensland: [153.0, -27.5],
      "South Australia": [138.6, -34.9],
      "Western Australia": [115.8, -31.9],
      Tasmania: [147.3, -42.9],
      "Northern Territory": [133.8, -23.7],
      "Australian Capital Territory": [149.1, -35.3],
    }),
    []
  );

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(ENDPOINT, { credentials: "omit" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();

        // 接受 {states:[..]} 或直接陣列
        const list = Array.isArray(json)
          ? json
          : Array.isArray(json?.states)
          ? json.states
          : [];

        if (!cancelled) setRows(list);
      } catch (e) {
        if (!cancelled) setError(String(e));
        console.error("Error fetching state population:", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: 20 }}>
      <h3>Auslan Community Population by State (2021)</h3>

      {loading && <div style={{ margin: "12px 0" }}>Loading map…</div>}
      {error && (
        <div style={{ color: "#c00", margin: "12px 0" }}>
          Failed to load data: {error}
        </div>
      )}

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 500, center: [135, -28] }}
        style={{ width: "100%", height: 520 }}
      >
        {/* 底圖 */}
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                style={{
                  default: { fill: "#E9EEF3", outline: "none" },
                  hover: { fill: "#BBD7FF", outline: "none" },
                  pressed: { fill: "#7BAAF7", outline: "none" },
                }}
              />
            ))
          }
        </Geographies>

        {/* 標註人口 */}
        {rows.map((s) => {
          const coord = stateCoords[s.name];
          if (!coord) return null;
          return (
            <Marker key={s.name} coordinates={coord}>
              <circle r={6} fill="#FF5722" stroke="#fff" strokeWidth={2} />
              <text
                textAnchor="middle"
                y={-10}
                style={{ fontFamily: "system-ui", fill: "#333", fontSize: 12 }}
              >
                {s.name}: {s.value}
              </text>
            </Marker>
          );
        })}
      </ComposableMap>
    </div>
  );
}