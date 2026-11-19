// Layout 2 — EDITORIAL LIST
// CV-style list: left = category/year, right = title + description.
// Very minimal, text-first. Inspired by Hugo van der Linden palette.

import { useState } from "react";
import { PROJECTS, SOFTWARE_TOOLS, type Project } from "@/data/projectData";

const ACCENT: Record<string, string> = {
  Education: "#b87333",
  Career: "#2d7d7d",
  "Personal Projects": "#6a4f9a",
};

export default function Layout2() {
  const [active, setActive] = useState<Project | null>(null);

  const grouped = ["Education", "Career", "Personal Projects"].map((sec) => ({
    section: sec,
    projects: PROJECTS.filter((p) => p.section === sec),
  }));

  return (
    <div style={{ minHeight: "100vh", background: "#faf9f6", color: "#1c1a17", fontFamily: "'Georgia', serif" }}>
      {/* NAV */}
      <nav style={{ padding: "1.5rem 3rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e5e0d8" }}>
        <div>
          <div style={{ fontFamily: "system-ui", fontWeight: 700, fontSize: "1rem", letterSpacing: "0.06em" }}>KIT KOTHER</div>
          <div style={{ fontFamily: "system-ui", fontSize: "0.75rem", color: "#9a9088", marginTop: "2px" }}>Product Designer & Engineer</div>
        </div>
        <div style={{ fontFamily: "system-ui", display: "flex", gap: "2rem", fontSize: "0.85rem" }}>
          <a href="#" style={{ color: "#b87333", textDecoration: "none" }}>Work</a>
          <a href="mailto:kitkother@gmail.com" style={{ color: "#6b6560", textDecoration: "none" }}>Contact</a>
        </div>
      </nav>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "4rem 3rem" }}>
        <p style={{ fontFamily: "system-ui", fontSize: "0.78rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#b87333", marginBottom: "1rem" }}>Selected Work</p>
        <h1 style={{ fontSize: "3rem", fontWeight: 400, margin: "0 0 3rem", lineHeight: 1.1 }}>Projects</h1>

        {grouped.map(({ section, projects }) => (
          <div key={section} style={{ marginBottom: "3.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
              <div style={{ width: "28px", height: "2px", background: ACCENT[section] }} />
              <span style={{ fontFamily: "system-ui", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: ACCENT[section] }}>{section}</span>
            </div>

            {projects.map((p, i) => (
              <div key={p.title} onClick={() => setActive(p)} style={{
                display: "grid", gridTemplateColumns: "120px 1fr", gap: "0 2rem",
                padding: "1.25rem 0", borderTop: i === 0 ? "1px solid #e5e0d8" : "none",
                borderBottom: "1px solid #e5e0d8", cursor: "pointer",
              }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "#f5f2ed"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = "none"; }}
              >
                <div style={{ paddingTop: "2px" }}>
                  <div style={{ fontFamily: "system-ui", fontSize: "0.72rem", color: "#9a9088" }}>{p.period || "—"}</div>
                  <div style={{ marginTop: "0.5rem", display: "flex", flexWrap: "wrap", gap: "3px" }}>
                    {p.tags.slice(0, 2).map((t) => <span key={t} style={{ fontFamily: "system-ui", fontSize: "0.65rem", background: `${ACCENT[section]}18`, color: ACCENT[section], padding: "1px 7px", borderRadius: "3px" }}>{t}</span>)}
                  </div>
                </div>
                <div>
                  <h3 style={{ margin: "0 0 0.3rem", fontSize: "1.15rem", fontWeight: 600, letterSpacing: "-0.01em" }}>{p.title}</h3>
                  <p style={{ margin: 0, fontSize: "0.9rem", color: "#5a5550", lineHeight: 1.6 }}>{p.shortDescription}</p>
                </div>
              </div>
            ))}
          </div>
        ))}

        {/* SOFTWARE */}
        <div style={{ marginTop: "4rem", paddingTop: "3rem", borderTop: "1px solid #e5e0d8" }}>
          <p style={{ fontFamily: "system-ui", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#9a9088", marginBottom: "1.5rem" }}>Tools & Software</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem 2rem" }}>
            {SOFTWARE_TOOLS.map((t) => (
              <div key={t.name} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid #ede9e3", fontFamily: "system-ui", fontSize: "0.85rem" }}>
                <span>{t.name}</span>
                <span style={{ color: "#9a9088", fontSize: "0.75rem" }}>{t.category}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DETAIL */}
      {active && (
        <div onClick={() => setActive(null)} style={{ position: "fixed", inset: 0, background: "rgba(28,26,23,0.6)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "#faf9f6", borderRadius: "4px", maxWidth: "700px", width: "100%", maxHeight: "88vh", overflowY: "auto", padding: "2.5rem 3rem" }}>
            <button onClick={() => setActive(null)} style={{ float: "right", border: "none", background: "none", fontSize: "1.5rem", cursor: "pointer", color: "#888", marginTop: "-0.5rem" }}>×</button>
            <div style={{ fontFamily: "system-ui", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: ACCENT[active.section], marginBottom: "0.75rem" }}>{active.section} {active.period && `· ${active.period}`}</div>
            <h2 style={{ margin: "0 0 1rem", fontSize: "2rem", fontWeight: 400 }}>{active.title}</h2>
            {active.images[0] && <img src={active.images[0]} alt={active.title} style={{ width: "100%", borderRadius: "4px", marginBottom: "1.5rem", aspectRatio: "16/9", objectFit: "cover" }} />}
            <p style={{ lineHeight: 1.85, color: "#2a2520", whiteSpace: "pre-wrap", fontSize: "0.95rem" }}>{active.longDescription || active.description}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "1.5rem", fontFamily: "system-ui" }}>
              {active.tags.map((t) => <span key={t} style={{ background: `${ACCENT[active.section]}18`, color: ACCENT[active.section], padding: "3px 10px", borderRadius: "3px", fontSize: "0.78rem" }}>{t}</span>)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
