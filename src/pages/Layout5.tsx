// Layout 5 — CASE STUDY CARDS (Inspired by Hugo van der Linden)
// Large immersive visual presentation with structured metadata,
// bold typography, software badge panel and rich technical breakdown.

import { useState } from "react";
import { PROJECTS, SOFTWARE_TOOLS, ME, type Project } from "@/data/projectData";

export default function Layout5() {
  const [activeTag, setActiveTag] = useState<string>("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Collect unique tags
  const allTags = ["All", ...Array.from(new Set(PROJECTS.flatMap((p) => p.tags)))];

  const filtered = activeTag === "All"
    ? PROJECTS
    : PROJECTS.filter((p) => p.tags.includes(activeTag));

  return (
    <div style={{ minHeight: "100vh", background: "#111010", color: "#ececec", fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* Top Navbar */}
      <nav style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "1.25rem 2.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#161515" }}>
        <div>
          <span style={{ fontWeight: 800, fontSize: "1.1rem", letterSpacing: "0.08em", color: "#e2b168" }}>KIT KOTHER</span>
          <span style={{ fontSize: "0.8rem", color: "#777", marginLeft: "1rem" }}>Layout 5: Modern Case Study</span>
        </div>
        <div style={{ display: "flex", gap: "1.25rem", fontSize: "0.85rem" }}>
          <a href="#/subsectie1" style={{ color: "#888", textDecoration: "none" }}>Layout 1</a>
          <a href="#/subsectie2" style={{ color: "#888", textDecoration: "none" }}>Layout 2</a>
          <a href="#/subsectie3" style={{ color: "#888", textDecoration: "none" }}>Layout 3</a>
          <a href="#/subsectie4" style={{ color: "#888", textDecoration: "none" }}>Layout 4</a>
          <a href="#/subsectie5" style={{ color: "#e2b168", textDecoration: "none", fontWeight: 700 }}>Layout 5</a>
        </div>
      </nav>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "3.5rem 2rem" }}>
        {/* Hero Section */}
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "3rem", marginBottom: "3.5rem", alignItems: "center" }}>
          <div>
            <div style={{ color: "#e2b168", textTransform: "uppercase", letterSpacing: "0.15em", fontSize: "0.75rem", fontWeight: 700, marginBottom: "0.75rem" }}>
              Portfolio & Engineering Showcase
            </div>
            <h1 style={{ fontSize: "3.2rem", fontWeight: 800, lineHeight: 1.1, margin: "0 0 1rem", letterSpacing: "-0.02em" }}>
              Making complex systems intuitive.
            </h1>
            <p style={{ color: "#9e9e9e", fontSize: "1.05rem", lineHeight: 1.6, margin: "0 0 1.5rem" }}>
              {ME.bio}
            </p>
            <div style={{ display: "flex", gap: "1rem" }}>
              <a href={`mailto:${ME.email}`} style={{ background: "#e2b168", color: "#111", padding: "0.6rem 1.4rem", borderRadius: "8px", fontWeight: 700, textDecoration: "none", fontSize: "0.88rem" }}>
                Contact Me
              </a>
              {ME.links.map(l => (
                <a key={l.label} href={l.href} target="_blank" rel="noreferrer" style={{ border: "1px solid rgba(255,255,255,0.15)", color: "#ececec", padding: "0.6rem 1.2rem", borderRadius: "8px", textDecoration: "none", fontSize: "0.88rem" }}>
                  {l.label} ↗
                </a>
              ))}
            </div>
          </div>

          {/* Software / Competency Box */}
          <div style={{ background: "#181717", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "1.75rem" }}>
            <h3 style={{ margin: "0 0 1rem", fontSize: "1rem", fontWeight: 700, color: "#fff", display: "flex", justifyContent: "space-between" }}>
              <span>Software & CAD Stack</span>
              <span style={{ fontSize: "0.75rem", color: "#e2b168", fontWeight: 500 }}>Proficiencies</span>
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              {SOFTWARE_TOOLS.map((t) => (
                <div key={t.name} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "0.5rem 0.75rem" }}>
                  <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#f0f0f0" }}>{t.name}</div>
                  <div style={{ fontSize: "0.7rem", color: "#777" }}>{t.category}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tag Filters */}
        <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto", paddingBottom: "1rem", marginBottom: "2rem" }}>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              style={{
                background: activeTag === tag ? "#e2b168" : "rgba(255,255,255,0.05)",
                color: activeTag === tag ? "#111" : "#aaa",
                border: "1px solid rgba(255,255,255,0.08)",
                padding: "0.4rem 1rem",
                borderRadius: "9999px",
                fontSize: "0.8rem",
                fontWeight: activeTag === tag ? 700 : 500,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.15s",
              }}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Big Case Study Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "2rem" }}>
          {filtered.map((proj) => (
            <div
              key={proj.title}
              onClick={() => setSelectedProject(proj)}
              style={{
                background: "#181717",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "16px",
                overflow: "hidden",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.borderColor = "rgba(226, 177, 104, 0.4)";
                e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{ aspectRatio: "16/10", overflow: "hidden", background: "#0c0c0c", position: "relative" }}>
                {proj.images[0] ? (
                  <img src={proj.images[0]} alt={proj.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ display: "flex", height: "100%", alignItems: "center", justifyContent: "center", color: "#555" }}>Geen afbeelding</div>
                )}
                <span style={{ position: "absolute", top: "12px", right: "12px", background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)", padding: "4px 10px", borderRadius: "9999px", fontSize: "0.72rem", color: "#e2b168", fontWeight: 600 }}>
                  {proj.section}
                </span>
              </div>

              <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <h3 style={{ margin: "0 0 0.5rem", fontSize: "1.25rem", fontWeight: 700, color: "#fff" }}>
                    {proj.title}
                  </h3>
                  <p style={{ color: "#8c8c8c", fontSize: "0.88rem", lineHeight: 1.55, margin: 0 }}>
                    {proj.shortDescription || proj.description}
                  </p>
                </div>

                <div style={{ marginTop: "1.25rem", paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                    {proj.tags.slice(0, 3).map((t) => (
                      <span key={t} style={{ background: "rgba(255,255,255,0.04)", color: "#aaa", padding: "2px 7px", borderRadius: "4px", fontSize: "0.72rem" }}>
                        {t}
                      </span>
                    ))}
                  </div>
                  <span style={{ color: "#e2b168", fontSize: "0.82rem", fontWeight: 600 }}>Lees meer →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal View */}
      {selectedProject && (
        <div onClick={() => setSelectedProject(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(6px)", zIndex: 120, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "#181717", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "18px", maxWidth: "800px", width: "100%", maxHeight: "88vh", overflowY: "auto", padding: "2.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "#e2b168", fontWeight: 700 }}>
                {selectedProject.section} {selectedProject.period && `• ${selectedProject.period}`}
              </span>
              <button onClick={() => setSelectedProject(null)} style={{ background: "none", border: "none", color: "#888", fontSize: "1.5rem", cursor: "pointer" }}>✕</button>
            </div>

            <h2 style={{ fontSize: "2rem", fontWeight: 800, margin: "0 0 1rem", color: "#fff" }}>{selectedProject.title}</h2>

            {selectedProject.images.length > 0 && (
              <div style={{ marginBottom: "1.5rem" }}>
                <img src={selectedProject.images[0]} alt={selectedProject.title} style={{ width: "100%", maxHeight: "400px", objectFit: "cover", borderRadius: "10px" }} />
                {selectedProject.images.length > 1 && (
                  <div style={{ display: "flex", gap: "8px", marginTop: "8px", overflowX: "auto" }}>
                    {selectedProject.images.map((img, i) => (
                      <img key={i} src={img} alt="" style={{ height: "65px", width: "95px", objectFit: "cover", borderRadius: "6px" }} />
                    ))}
                  </div>
                )}
              </div>
            )}

            <p style={{ color: "#d1d1d1", lineHeight: 1.8, fontSize: "0.95rem", whiteSpace: "pre-wrap" }}>
              {selectedProject.longDescription || selectedProject.description}
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "1.5rem" }}>
              {selectedProject.tags.map((t) => (
                <span key={t} style={{ background: "rgba(226, 177, 104, 0.15)", color: "#e2b168", padding: "4px 10px", borderRadius: "6px", fontSize: "0.78rem" }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
