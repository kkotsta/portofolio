// Layout 1 — GRID CARDS
// Clean image cards in a responsive grid. Click opens an inline detail panel.
// Inspired by: minimal, scannable, image-led portfolio grids.

import { useState } from "react";
import { PROJECTS, SOFTWARE_TOOLS, type Project } from "@/data/projectData";

const SECTION_COLORS: Record<string, string> = {
  Education: "#c08c4a",
  Career: "#4a8c8c",
  "Personal Projects": "#7a5fa0",
};

export default function Layout1() {
  const [active, setActive] = useState<Project | null>(null);
  const [filter, setFilter] = useState<string>("All");
  const sections = ["All", "Education", "Career", "Personal Projects"];
  const visible = filter === "All" ? PROJECTS : PROJECTS.filter((p) => p.section === filter);

  return (
    <div style={{ minHeight: "100vh", background: "#f5f4f0", color: "#1a1916", fontFamily: "system-ui, sans-serif" }}>
      {/* NAV */}
      <nav style={{ background: "#1a1916", color: "#f5f4f0", padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontWeight: 700, letterSpacing: "0.08em", fontSize: "1rem" }}>KIT KOTHER</span>
        <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.85rem" }}>
          <a href="#" style={{ color: "#dda957", textDecoration: "none" }}>Work</a>
          <a href="mailto:kitkother@gmail.com" style={{ color: "#a09890", textDecoration: "none" }}>Contact</a>
        </div>
      </nav>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "3rem 2rem" }}>
        {/* HEADER */}
        <div style={{ marginBottom: "2.5rem" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>Projects</h1>
          <p style={{ color: "#6b6560", marginTop: "0.5rem", fontSize: "1rem" }}>Design, engineering & personal work</p>
        </div>

        {/* FILTER TABS */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem", flexWrap: "wrap" }}>
          {sections.map((s) => (
            <button key={s} onClick={() => setFilter(s)} style={{
              padding: "0.4rem 1.1rem", borderRadius: "9999px", border: "none", cursor: "pointer", fontSize: "0.85rem", fontWeight: 500,
              background: filter === s ? "#1a1916" : "#e8e5df", color: filter === s ? "#f5f4f0" : "#4a4540",
              transition: "all 0.15s",
            }}>{s}</button>
          ))}
        </div>

        {/* GRID */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.25rem" }}>
          {visible.map((p) => (
            <div key={p.title} onClick={() => setActive(p)} style={{
              background: "#fff", borderRadius: "12px", overflow: "hidden", cursor: "pointer",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)", transition: "transform 0.2s, box-shadow 0.2s",
            }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "none"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 1px 4px rgba(0,0,0,0.08)"; }}
            >
              {p.images[0] && (
                <div style={{ aspectRatio: "16/9", overflow: "hidden" }}>
                  <img src={p.images[0]} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              )}
              <div style={{ padding: "1rem 1.1rem 1.1rem" }}>
                <div style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: SECTION_COLORS[p.section] || "#888", marginBottom: "0.3rem" }}>{p.section}</div>
                <h3 style={{ margin: "0 0 0.4rem", fontSize: "1rem", fontWeight: 700 }}>{p.title}</h3>
                <p style={{ margin: 0, fontSize: "0.82rem", color: "#6b6560", lineHeight: 1.5 }}>{p.shortDescription}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "0.75rem" }}>
                  {p.tags.map((t) => (
                    <span key={t} style={{ background: "#f0ede8", color: "#4a4540", padding: "2px 8px", borderRadius: "4px", fontSize: "0.72rem" }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* SOFTWARE */}
        <div style={{ marginTop: "4rem", paddingTop: "3rem", borderTop: "1px solid #e0ddd8" }}>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "1.5rem" }}>Tools & Software</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
            {SOFTWARE_TOOLS.map((t) => (
              <div key={t.name} style={{ background: "#fff", border: "1px solid #e0ddd8", borderRadius: "8px", padding: "0.5rem 1rem", fontSize: "0.85rem" }}>
                <span style={{ fontWeight: 600 }}>{t.name}</span>
                <span style={{ color: "#9a948e", marginLeft: "6px", fontSize: "0.75rem" }}>{t.category}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DETAIL OVERLAY */}
      {active && (
        <div onClick={() => setActive(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: "16px", maxWidth: "680px", width: "100%", maxHeight: "85vh", overflowY: "auto", padding: "2rem" }}>
            <button onClick={() => setActive(null)} style={{ float: "right", border: "none", background: "none", fontSize: "1.5rem", cursor: "pointer", color: "#888" }}>×</button>
            {active.images[0] && <img src={active.images[0]} alt={active.title} style={{ width: "100%", borderRadius: "8px", marginBottom: "1.25rem", aspectRatio: "16/9", objectFit: "cover" }} />}
            <div style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: SECTION_COLORS[active.section] || "#888", marginBottom: "0.4rem" }}>{active.section} {active.period && `· ${active.period}`}</div>
            <h2 style={{ margin: "0 0 0.75rem", fontSize: "1.5rem", fontWeight: 800 }}>{active.title}</h2>
            <p style={{ lineHeight: 1.75, color: "#3a3530", whiteSpace: "pre-wrap" }}>{active.longDescription || active.description}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "1.25rem" }}>
              {active.tags.map((t) => <span key={t} style={{ background: "#f0ede8", color: "#4a4540", padding: "3px 10px", borderRadius: "6px", fontSize: "0.78rem" }}>{t}</span>)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
