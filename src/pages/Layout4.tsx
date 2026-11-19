// Layout 4 — INTERACTIVE ACCORDION / SPOTLIGHT
// Ultra clean, fast scanning view. Each project expands seamlessly in-place.
// Includes a dedicated software pill dock at top and instant tag highlights.

import { useState } from "react";
import { PROJECTS, SOFTWARE_TOOLS, ME, type Project } from "@/data/projectData";

export default function Layout4() {
  const [expandedTitle, setExpandedTitle] = useState<string | null>(PROJECTS[0]?.title || null);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", "Education", "Career", "Personal Projects"];
  const filtered = activeCategory === "All"
    ? PROJECTS
    : PROJECTS.filter((p) => p.section === activeCategory);

  const toggleProject = (title: string) => {
    setExpandedTitle((prev) => (prev === title ? null : title));
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", color: "#f8fafc", fontFamily: "system-ui, sans-serif" }}>
      {/* Header bar */}
      <header style={{ borderBottom: "1px solid #1e293b", background: "#0b1120", padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span style={{ fontWeight: 800, fontSize: "1.1rem", letterSpacing: "0.05em", color: "#38bdf8" }}>KIT KOTHER</span>
          <span style={{ marginLeft: "1rem", color: "#64748b", fontSize: "0.85rem" }}>Layout 4: Expandable Accordion</span>
        </div>
        <div style={{ display: "flex", gap: "1rem", fontSize: "0.85rem" }}>
          <a href="#/subsectie1" style={{ color: "#94a3b8", textDecoration: "none" }}>Layout 1</a>
          <a href="#/subsectie2" style={{ color: "#94a3b8", textDecoration: "none" }}>Layout 2</a>
          <a href="#/subsectie3" style={{ color: "#94a3b8", textDecoration: "none" }}>Layout 3</a>
          <a href="#/subsectie4" style={{ color: "#38bdf8", textDecoration: "none", fontWeight: 700 }}>Layout 4</a>
          <a href="#/subsectie5" style={{ color: "#94a3b8", textDecoration: "none" }}>Layout 5</a>
        </div>
      </header>

      <div style={{ maxWidth: "1050px", margin: "0 auto", padding: "3rem 1.5rem" }}>
        {/* Intro Hero */}
        <div style={{ marginBottom: "2.5rem" }}>
          <h1 style={{ fontSize: "2.8rem", fontWeight: 900, margin: "0 0 0.5rem", letterSpacing: "-0.03em" }}>
            Engineering & Product Development
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "1.05rem", maxWidth: "700px", lineHeight: 1.6, margin: 0 }}>
            {ME.bio}
          </p>
        </div>

        {/* Software / Skills Toolbelt */}
        <div style={{ background: "#1e293b", borderRadius: "14px", padding: "1.25rem 1.5rem", marginBottom: "2.5rem", border: "1px solid #334155" }}>
          <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#38bdf8", fontWeight: 700, marginBottom: "0.75rem" }}>
            Software & Toolkit
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {SOFTWARE_TOOLS.map((tool) => (
              <span key={tool.name} style={{ background: "#0f172a", border: "1px solid #334155", color: "#e2e8f0", padding: "4px 10px", borderRadius: "8px", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "6px" }}>
                <span>{tool.name}</span>
                <span style={{ fontSize: "0.7rem", color: "#64748b" }}>• {tool.category}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Category Selector Tabs */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              style={{
                background: activeCategory === c ? "#38bdf8" : "#1e293b",
                color: activeCategory === c ? "#0f172a" : "#cbd5e1",
                border: "none",
                borderRadius: "8px",
                padding: "0.5rem 1.25rem",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {filtered.map((project) => {
            const isExpanded = expandedTitle === project.title;

            return (
              <div
                key={project.title}
                style={{
                  background: isExpanded ? "#1e293b" : "#131f37",
                  border: isExpanded ? "1px solid #38bdf8" : "1px solid #1e293b",
                  borderRadius: "12px",
                  overflow: "hidden",
                  transition: "all 0.2s ease",
                }}
              >
                {/* Clickable Row Header */}
                <div
                  onClick={() => toggleProject(project.title)}
                  style={{
                    padding: "1.25rem 1.5rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#38bdf8", width: "120px" }}>
                      {project.section}
                    </span>
                    <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#f8fafc" }}>
                      {project.title}
                    </h3>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                    <div style={{ display: "flex", gap: "6px" }}>
                      {project.tags.slice(0, 3).map((tag) => (
                        <span key={tag} style={{ background: "#0f172a", color: "#94a3b8", padding: "2px 8px", borderRadius: "4px", fontSize: "0.75rem" }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span style={{ fontSize: "1.2rem", color: isExpanded ? "#38bdf8" : "#64748b", transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                      ▼
                    </span>
                  </div>
                </div>

                {/* Expanded Inline Detail */}
                {isExpanded && (
                  <div style={{ padding: "0 1.5rem 1.5rem", borderTop: "1px solid #334155" }}>
                    <div style={{ display: "grid", gridTemplateColumns: project.images.length > 0 ? "1fr 1fr" : "1fr", gap: "1.75rem", marginTop: "1.25rem" }}>
                      <div>
                        <div style={{ color: "#38bdf8", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.5rem" }}>
                          {project.shortDescription}
                        </div>
                        <p style={{ color: "#cbd5e1", lineHeight: 1.75, fontSize: "0.92rem", margin: 0, whiteSpace: "pre-wrap" }}>
                          {project.longDescription || project.description}
                        </p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "1rem" }}>
                          {project.tags.map(t => (
                            <span key={t} style={{ background: "#0f172a", color: "#38bdf8", border: "1px solid #334155", padding: "3px 9px", borderRadius: "6px", fontSize: "0.75rem" }}>{t}</span>
                          ))}
                        </div>
                      </div>

                      {project.images.length > 0 && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <img
                            src={project.images[0]}
                            alt={project.title}
                            style={{ width: "100%", maxHeight: "280px", objectFit: "cover", borderRadius: "8px" }}
                          />
                          {project.images.length > 1 && (
                            <div style={{ display: "flex", gap: "8px", overflowX: "auto" }}>
                              {project.images.slice(1, 4).map((img, idx) => (
                                <img key={idx} src={img} alt="" style={{ height: "65px", width: "95px", objectFit: "cover", borderRadius: "4px" }} />
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
