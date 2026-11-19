// Layout 3 — SIDEBAR SPLIT
// Hugo van der Linden inspired warm tones & clean sticky sidebar navigation,
// left panel sticky with bio/software/section anchors, right panel scrolling projects.

import { useState } from "react";
import { PROJECTS, SOFTWARE_TOOLS, ME, type Project } from "@/data/projectData";

const ACCENT_COLORS: Record<string, string> = {
  Education: "#d97706",
  Career: "#0d9488",
  "Personal Projects": "#7c3aed",
};

export default function Layout3() {
  const [selectedSection, setSelectedSection] = useState<string>("All");
  const [activeModal, setActiveModal] = useState<Project | null>(null);

  const sections = ["All", "Education", "Career", "Personal Projects"];
  const filteredProjects = selectedSection === "All" 
    ? PROJECTS 
    : PROJECTS.filter((p) => p.section === selectedSection);

  return (
    <div style={{ minHeight: "100vh", background: "#1c1917", color: "#f5f5f4", fontFamily: "system-ui, sans-serif" }}>
      {/* Top Banner Navigation */}
      <header style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#171513" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ fontWeight: 800, letterSpacing: "0.05em", color: "#facc15" }}>KIT KOTHER</span>
          <span style={{ fontSize: "0.8rem", color: "#a8a29e", borderLeft: "1px solid #44403c", paddingLeft: "1rem" }}>Layout 3: Sidebar Split</span>
        </div>
        <div style={{ display: "flex", gap: "1rem", fontSize: "0.85rem" }}>
          <a href="#/subsectie1" style={{ color: "#a8a29e", textDecoration: "none" }}>Layout 1</a>
          <a href="#/subsectie2" style={{ color: "#a8a29e", textDecoration: "none" }}>Layout 2</a>
          <a href="#/subsectie3" style={{ color: "#facc15", textDecoration: "none", fontWeight: 600 }}>Layout 3</a>
          <a href="#/subsectie4" style={{ color: "#a8a29e", textDecoration: "none" }}>Layout 4</a>
          <a href="#/subsectie5" style={{ color: "#a8a29e", textDecoration: "none" }}>Layout 5</a>
        </div>
      </header>

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2.5rem 2rem", display: "grid", gridTemplateColumns: "320px 1fr", gap: "3rem" }}>
        {/* Sticky Left Sidebar */}
        <aside style={{ position: "sticky", top: "2rem", height: "fit-content", display: "flex", flexDirection: "column", gap: "2rem" }}>
          <div style={{ background: "#262320", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", padding: "1.75rem" }}>
            <h1 style={{ fontSize: "1.6rem", fontWeight: 800, margin: "0 0 0.5rem" }}>{ME.name}</h1>
            <p style={{ color: "#facc15", fontSize: "0.9rem", fontWeight: 500, margin: "0 0 1rem" }}>{ME.tagline}</p>
            <p style={{ color: "#a8a29e", fontSize: "0.85rem", lineHeight: 1.6, margin: 0 }}>{ME.bio}</p>

            <div style={{ display: "flex", gap: "1rem", marginTop: "1.25rem", fontSize: "0.85rem" }}>
              {ME.links.map(l => (
                <a key={l.label} href={l.href} target="_blank" rel="noreferrer" style={{ color: "#e7e5e4", textDecoration: "underline" }}>{l.label} ↗</a>
              ))}
            </div>
          </div>

          {/* Section Filter Controls */}
          <div style={{ background: "#262320", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", padding: "1.25rem" }}>
            <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#78716c", fontWeight: 700, marginBottom: "0.75rem" }}>Categories</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {sections.map(sec => (
                <button
                  key={sec}
                  onClick={() => setSelectedSection(sec)}
                  style={{
                    textAlign: "left",
                    padding: "0.6rem 0.9rem",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "0.88rem",
                    fontWeight: selectedSection === sec ? 700 : 500,
                    background: selectedSection === sec ? "#facc15" : "transparent",
                    color: selectedSection === sec ? "#1c1917" : "#d6d3d1",
                    transition: "all 0.15s",
                  }}
                >
                  {sec} ({sec === "All" ? PROJECTS.length : PROJECTS.filter(p => p.section === sec).length})
                </button>
              ))}
            </div>
          </div>

          {/* Software Skills Block */}
          <div style={{ background: "#262320", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", padding: "1.25rem" }}>
            <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#78716c", fontWeight: 700, marginBottom: "0.75rem" }}>Software & Skills</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {SOFTWARE_TOOLS.map(t => (
                <span key={t.name} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", padding: "4px 8px", borderRadius: "6px", fontSize: "0.75rem", color: "#e7e5e4" }}>
                  {t.name}
                </span>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Main Projects List */}
        <main>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 800, margin: 0 }}>Featured Projects</h2>
            <span style={{ color: "#78716c", fontSize: "0.9rem" }}>Showing {filteredProjects.length} items</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
            {filteredProjects.map((p) => {
              const accent = ACCENT_COLORS[p.section] || "#facc15";
              return (
                <article
                  key={p.title}
                  onClick={() => setActiveModal(p)}
                  style={{
                    background: "#262320",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "16px",
                    overflow: "hidden",
                    display: "grid",
                    gridTemplateColumns: "300px 1fr",
                    cursor: "pointer",
                    transition: "transform 0.2s, border-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.borderColor = "rgba(250, 204, 21, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                  }}
                >
                  <div style={{ position: "relative", minHeight: "200px", background: "#1c1917" }}>
                    {p.images[0] ? (
                      <img src={p.images[0]} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ display: "flex", height: "100%", alignItems: "center", justifyContent: "center", color: "#78716c", fontSize: "0.8rem" }}>No Preview</div>
                    )}
                  </div>

                  <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                        <span style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: accent }}>{p.section}</span>
                        {p.period && <span style={{ fontSize: "0.78rem", color: "#a8a29e" }}>{p.period}</span>}
                      </div>
                      <h3 style={{ margin: "0 0 0.5rem", fontSize: "1.25rem", fontWeight: 700, color: "#fafaf9" }}>{p.title}</h3>
                      <p style={{ color: "#a8a29e", fontSize: "0.88rem", lineHeight: 1.5, margin: 0 }}>{p.shortDescription || p.description}</p>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.25rem", paddingTop: "0.75rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {p.tags.map(t => (
                          <span key={t} style={{ background: "rgba(255,255,255,0.05)", color: "#d6d3d1", fontSize: "0.72rem", padding: "2px 8px", borderRadius: "4px" }}>{t}</span>
                        ))}
                      </div>
                      <span style={{ fontSize: "0.8rem", color: "#facc15", fontWeight: 600 }}>Lees meer →</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </main>
      </div>

      {/* Detail Overlay */}
      {activeModal && (
        <div onClick={() => setActiveModal(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "#262320", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "16px", maxWidth: "760px", width: "100%", maxHeight: "85vh", overflowY: "auto", padding: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#facc15" }}>{activeModal.section} {activeModal.period && `• ${activeModal.period}`}</span>
              <button onClick={() => setActiveModal(null)} style={{ background: "transparent", border: "none", color: "#a8a29e", fontSize: "1.5rem", cursor: "pointer" }}>✕</button>
            </div>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 800, margin: "0 0 1rem" }}>{activeModal.title}</h2>
            {activeModal.images[0] && (
              <img src={activeModal.images[0]} alt={activeModal.title} style={{ width: "100%", maxHeight: "360px", objectFit: "cover", borderRadius: "10px", marginBottom: "1.25rem" }} />
            )}
            <p style={{ color: "#e7e5e4", lineHeight: 1.8, fontSize: "0.95rem", whiteSpace: "pre-wrap" }}>
              {activeModal.longDescription || activeModal.description}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "1.5rem" }}>
              {activeModal.tags.map(t => (
                <span key={t} style={{ background: "rgba(250,204,21,0.15)", color: "#facc15", padding: "4px 10px", borderRadius: "6px", fontSize: "0.78rem" }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
