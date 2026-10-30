import { useState, useEffect, useRef } from "react";
import headshot from "@/imports/IMG_6839__1_.jpg";
import bgPhoto from "@/imports/bg.jpg";
import bg2Photo from "@/imports/bg2.jpg";
import projectsCsv from "@/data/projects.csv?raw";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const ME = {
  name: "Kit Kother",
  tagline: "I engineer things, then make them feel right.",
  bio: "MSc student in Integrated Product Design at TU Delft. Background in mechanical engineering. I work at the intersection of how things function and how they should feel to use — currently applying that at Ampelmann, analysing the feasibility of future offshore access operations.",
  email: "kitkother@gmail.com",
  links: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/kit-kother/" },
    { label: "GitHub", href: "https://github.com/kkotsta" },
  ],
};

type ProjectSection = "Education" | "Career" | "Personal Projects";

type Project = {
  title: string;
  section: ProjectSection;
  shortDescription: string;
  description: string;
  tags: string[];
};

function parseCsvRow(row: string) {
  const values: string[] = [];
  let value = "";
  let quoted = false;

  for (let i = 0; i < row.length; i += 1) {
    const character = row[i];
    if (character === '"') {
      if (quoted && row[i + 1] === '"') {
        value += '"';
        i += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === "," && !quoted) {
      values.push(value);
      value = "";
    } else {
      value += character;
    }
  }

  values.push(value);
  return values;
}

const PROJECTS: Project[] = projectsCsv
  .trim()
  .split(/\r?\n/)
  .slice(1)
  .map((row) => {
    const [title, section, shortDescription, description, tags] = parseCsvRow(row);
    return {
      title,
      section: section as ProjectSection,
      shortDescription,
      description,
      tags: tags.split(";").map((tag) => tag.trim()),
    };
  });

const PANEL_STYLES = [
  {
    id: 0,
    label: "Education" as ProjectSection,
    bg: "rgba(60,31,14,0.72)",
    border: "#75451e",
    chip: "rgba(74,39,17,0.78)",
    accent: "#e09b45",
  },
  {
    id: 1,
    label: "Career" as ProjectSection,
    bg: "rgba(10,35,48,0.72)",
    border: "#1f6078",
    chip: "rgba(13,48,64,0.78)",
    accent: "#66bdd3",
  },
  {
    id: 2,
    label: "Personal Projects" as ProjectSection,
    bg: "rgba(31,26,47,0.72)",
    border: "#5e4c79",
    chip: "rgba(43,35,62,0.78)",
    accent: "#ad91ce",
  },
].map((panel) => ({
  ...panel,
  projects: PROJECTS.filter((project) => project.section === panel.label),
}));

// ─── NAV ──────────────────────────────────────────────────────────────────────

function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed top-0 left-0 right-0 z-50"
      style={{ background: "rgba(23,22,20,0.86)", backdropFilter: "blur(14px)", borderBottom: "1px solid #34312d" }}>
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <a href="#" style={{ fontFamily: "var(--font-body)", color: "#dda957", letterSpacing: "0.15em", fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase" }}>KK</a>
        <nav className="hidden md:flex items-center gap-8">
          {[{ label: "Work", href: "#panels" }, { label: "Contact", href: "#contact" }].map(l => (
            <a key={l.label} href={l.href}
              onClick={(e) => {
                e.preventDefault();
                const target = document.querySelector(l.href);
                if (target) {
                  target.scrollIntoView({ behavior: "smooth" });
                }
              }}
              style={{ color: "#a39d94", fontFamily: "var(--font-body)", fontSize: "0.875rem" }}
              onMouseEnter={e => ((e.target as HTMLElement).style.color = "#f4f1eb")}
              onMouseLeave={e => ((e.target as HTMLElement).style.color = "#a39d94")}
            >{l.label}</a>
          ))}
          <a href={`mailto:${ME.email}`}
            style={{ border: "1px solid #dda957", color: "#dda957", fontFamily: "var(--font-body)", fontSize: "0.875rem", padding: "0.25rem 1rem", borderRadius: "2px" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#dda957"; (e.currentTarget as HTMLElement).style.color = "#171614"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#dda957"; }}
          >Say hello</a>
        </nav>
        <button className="md:hidden flex flex-col gap-1.5 p-1" onClick={() => setOpen(!open)} aria-label="Menu">
          <span className="block w-5 h-px" style={{ background: "#f0ede8", transform: open ? "translateY(4px) rotate(45deg)" : "none", transition: "transform 0.2s" }} />
          <span className="block w-5 h-px" style={{ background: "#f0ede8", opacity: open ? 0 : 1, transition: "opacity 0.2s" }} />
          <span className="block w-5 h-px" style={{ background: "#f0ede8", transform: open ? "translateY(-4px) rotate(-45deg)" : "none", transition: "transform 0.2s" }} />
        </button>
      </div>
      {open && (
        <div className="md:hidden px-6 pb-6 flex flex-col gap-4" style={{ borderTop: "1px solid #34312d" }}>
          {[{ label: "Work", href: "#panels" }, { label: "Contact", href: "#contact" }].map(l => (
            <a key={l.label} href={l.href} onClick={(e) => {
              e.preventDefault();
              setOpen(false);
              const target = document.querySelector(l.href);
              if (target) {
                target.scrollIntoView({ behavior: "smooth" });
              }
            }}
              style={{ color: "#f4f1eb", fontFamily: "var(--font-body)", fontSize: "1.125rem" }}>{l.label}</a>
          ))}
        </div>
      )}
    </header>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────

function Hero() {
  const bgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!bgRef.current) return;
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const offset = reduceMotion ? 0 : Math.min(window.scrollY, window.innerHeight) * 0.18;
      bgRef.current.style.transform = `translate3d(0, ${offset}px, 0)`;
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section style={{ position: "relative", minHeight: "82vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
      {/* Background photo */}
      <img
        ref={bgRef}
        src={bgPhoto}
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute", inset: 0, width: "100%", height: "120%",
          objectFit: "cover", objectPosition: "center 40%",
          filter: "brightness(0.76) saturate(0.95)",
          willChange: "transform",
          top: "-10%",
        }}
      />
      {/* Blend the sunset directly into the slate tones of the next photo. */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "48%",
        background: "linear-gradient(to bottom, transparent 0%, rgba(73,93,112,0.38) 58%, #495d70 100%)",
        pointerEvents: "none",
      }} />

      {/* Content */}
      <div className="relative px-6 pt-14 w-full max-w-6xl mx-auto">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center py-20">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <span className="block w-8 h-px" style={{ background: "#dda957" }} />
              <span style={{ color: "#dda957", fontFamily: "var(--font-body)", fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                Delft, Netherlands · 2026
              </span>
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 500, color: "#f4f1eb", fontSize: "clamp(3rem, 8vw, 5.5rem)", lineHeight: 1, letterSpacing: "-0.045em", marginBottom: "1.5rem", textShadow: "0 2px 24px rgba(0,0,0,0.4)" }}>
              Kit <span style={{ color: "#dda957" }}>Kother</span>
            </h1>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 400, color: "rgba(244,241,235,0.8)", fontSize: "clamp(1rem, 2.5vw, 1.2rem)", lineHeight: 1.55, marginBottom: "2rem", maxWidth: "38ch" }}>
              {ME.tagline}
            </p>
            <p style={{ fontFamily: "var(--font-body)", fontWeight: 300, color: "rgba(244,241,235,0.68)", fontSize: "0.9rem", lineHeight: 1.8, maxWidth: "44ch", marginBottom: "2.5rem" }}>
              {ME.bio}
            </p>
            <div className="flex gap-6">
              {ME.links.map(l => (
                <a key={l.label} href={l.href}
                  style={{ color: "rgba(240,237,232,0.5)", fontFamily: "var(--font-body)", fontSize: "0.875rem" }}
                  onMouseEnter={e => ((e.target as HTMLElement).style.color = "#dda957")}
                  onMouseLeave={e => ((e.target as HTMLElement).style.color = "rgba(240,237,232,0.5)")}
                >{l.label} ↗</a>
              ))}
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", inset: 0, transform: "translate(10px, 10px)", border: "1px solid #dda957", borderRadius: "4px", opacity: 0.55 }} />
              <img src={headshot} alt="Kit Kother"
                style={{ width: "clamp(220px, 32vw, 360px)", aspectRatio: "3/4", objectFit: "cover", objectPosition: "center top", borderRadius: "4px", display: "block", filter: "brightness(0.9) contrast(1.02)", position: "relative" }}
              />
            </div>
          </div>
        </div>

        {/* Photo credit — subtle, bottom right */}
        <p style={{ position: "absolute", bottom: "1.25rem", right: "1.5rem", fontFamily: "var(--font-body)", fontSize: "0.65rem", color: "rgba(240,237,232,0.25)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Photo by Kit Kother
        </p>
      </div>
    </section>
  );
}

// ─── THREE PANELS ─────────────────────────────────────────────────────────────

function ThreePanels() {
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRowRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const subtopicRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const selectedIndicatorRefs = useRef<(HTMLDivElement | null)[]>([]);
  const projectsListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const el = scrollRef.current;
      if (!el || !cardRowRef.current) return;

      const { top } = el.getBoundingClientRect();
      const stickyTop = 56; // 3.5rem navbar height
      // The collapse starts when #panels reaches the navbar and smoothly
      // transitions into a docked compact tab bar over 160px of natural page scroll.
      const collapseDistance = 160;
      const scrolledPast = stickyTop - top;
      const progress = Math.max(0, Math.min(1, scrolledPast / collapseDistance));

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const cp = reduceMotion ? (progress > 0.5 ? 1 : 0) : progress * progress * (3 - 2 * progress);

      // Card row height: collapses from 210px to 54px
      const maxH = 210;
      const minH = 54;
      const h = maxH - (maxH - minH) * cp;
      cardRowRef.current.style.height = `${h}px`;

      // Active card flex-grow
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        card.style.flexGrow = i === activeRef.current
          ? `${1 + cp * 0.4}`
          : `${1 - cp * 0.2}`;
      });

      // Title font size: 20px -> 13.5px
      const maxFont = 20;
      const minFont = 13.5;
      const fontSize = maxFont - (maxFont - minFont) * cp;
      titleRefs.current.forEach(el => {
        if (el) el.style.fontSize = `${fontSize}px`;
      });

      // Subtopics chips fade out as it collapses
      const subOp = Math.max(0, 1 - cp * 2.2);
      subtopicRefs.current.forEach(el => {
        if (el) {
          el.style.opacity = `${subOp}`;
          el.style.pointerEvents = subOp < 0.1 ? "none" : "auto";
        }
      });

      // Selected outline indicator
      selectedIndicatorRefs.current.forEach((el, i) => {
        if (el) el.style.opacity = i === activeRef.current ? "1" : "0";
      });
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    update();

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const handleSelect = (id: number) => {
    activeRef.current = id;
    setActive(id);
    if (projectsListRef.current) {
      const rect = projectsListRef.current.getBoundingClientRect();
      const targetOffset = 130;
      if (rect.top < targetOffset) {
        window.scrollTo({
          top: window.scrollY + rect.top - targetOffset,
          behavior: "smooth",
        });
      }
    }
  };

  const panel = PANEL_STYLES[active];

  return (
    <section id="panels" ref={scrollRef} style={{ position: "relative", minHeight: "100vh", paddingBottom: "4rem" }}>
      {/* Landscape background photo covering the section */}
      <img
        src={bg2Photo}
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          objectFit: "cover", objectPosition: "center bottom",
          filter: "brightness(0.85) saturate(0.95)",
          pointerEvents: "none",
        }}
      />
      {/* Top blend from sunset/slate into landscape */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "260px",
        background: "linear-gradient(to bottom, #495d70 0%, rgba(73,93,112,0.42) 40%, transparent 100%)",
        pointerEvents: "none",
      }} />
      {/* Bottom blend into contact section's warm charcoal */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "320px",
        background: "linear-gradient(to bottom, transparent 0%, rgba(23,22,20,0.65) 50%, #171614 100%)",
        pointerEvents: "none",
      }} />

      {/* Main Container */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: "72rem", margin: "0 auto", padding: "2rem 1.5rem 0" }}>

        {/* Section label */}
        <div className="flex items-center gap-4 mb-4">
          <span style={{ fontFamily: "var(--font-body)", color: "#dda957", fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase" }}>Explore</span>
          <span style={{ flex: 1, height: "1px", background: "#34312d" }} />
        </div>

        {/* Sticky Card Row */}
        <div
          style={{
            position: "sticky",
            top: "3.5rem",
            zIndex: 30,
            paddingTop: "0.5rem",
            paddingBottom: "0.75rem",
            backdropFilter: "blur(14px)",
            background: "linear-gradient(to bottom, rgba(23,22,20,0.88) 0%, rgba(23,22,20,0.7) 85%, transparent 100%)",
            margin: "0 -1.5rem",
            paddingLeft: "1.5rem",
            paddingRight: "1.5rem",
          }}
        >
          <div ref={cardRowRef} style={{ display: "flex", gap: "8px", height: "210px", overflow: "hidden" }}>
            {PANEL_STYLES.map((p, i) => (
              <div
                key={p.id}
                ref={el => { cardRefs.current[i] = el; }}
                onClick={() => handleSelect(p.id)}
                style={{
                  flex: 1,
                  background: p.bg,
                  border: `1px solid ${active === p.id ? p.border : "#282522"}`,
                  borderRadius: "8px",
                  padding: "0.85rem 1.1rem",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  overflow: "hidden",
                  transition: "border-color 0.25s, flex-grow 0.2s ease-out, background-color 0.25s",
                  position: "relative",
                  boxShadow: active === p.id ? `0 4px 20px ${p.accent}22` : "none",
                }}
              >
                {/* Selected indicator */}
                <div
                  ref={el => { selectedIndicatorRefs.current[i] = el; }}
                  style={{
                    position: "absolute", top: 4, left: 4, right: 4, bottom: 4,
                    border: `1px solid ${p.accent}`,
                    borderRadius: "6px",
                    opacity: active === p.id ? 1 : 0,
                    transition: "opacity 0.2s",
                    pointerEvents: "none",
                  }}
                />

                {/* Title & Count Badge */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                  <div
                    ref={el => { titleRefs.current[i] = el; }}
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 500,
                      color: active === p.id ? "#f4f1eb" : "#a8a29a",
                      fontSize: "20px",
                      lineHeight: 1.2,
                      transition: "color 0.25s",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {p.label}
                  </div>
                  <span style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.7rem",
                    color: active === p.id ? p.accent : "#787268",
                    background: "rgba(0,0,0,0.25)",
                    padding: "0.15rem 0.5rem",
                    borderRadius: "9999px",
                    fontWeight: 500,
                  }}>
                    {p.projects.length}
                  </span>
                </div>

                {/* Subtopic chips */}
                <div
                  ref={el => { subtopicRefs.current[i] = el; }}
                  className="custom-scroll"
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignContent: "flex-start",
                    gap: "5px",
                    transition: "opacity 0.15s",
                    overflow: "hidden",
                    maxHeight: "135px",
                  }}
                >
                  {p.projects.map((project) => (
                    <div key={project.title} style={{
                      background: p.chip,
                      border: `1px solid ${p.border}`,
                      borderRadius: "4px",
                      padding: "0.22rem 0.55rem",
                      display: "inline-flex",
                      alignItems: "center",
                    }}>
                      <span style={{ fontFamily: "var(--font-body)", color: p.accent, fontSize: "0.75rem", fontWeight: 400 }}>{project.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Cards in Natural Page Flow */}
        <div ref={projectsListRef} style={{ paddingTop: "1.75rem", paddingBottom: "2rem" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "1.5rem 2rem",
          }}>
            {panel.projects.map((project) => (
              <div
                key={project.title}
                style={{
                  background: "rgba(23, 22, 20, 0.65)",
                  border: `1px solid ${panel.border}`,
                  borderRadius: "8px",
                  padding: "1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  backdropFilter: "blur(12px)",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
                  transition: "border-color 0.25s, transform 0.2s, box-shadow 0.25s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = panel.accent;
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = `0 8px 30px rgba(0,0,0,0.4), 0 0 15px ${panel.accent}22`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = panel.border;
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.3)";
                }}
              >
                <div>
                  <p style={{ fontFamily: "var(--font-body)", color: panel.accent, fontSize: "0.68rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.5rem", fontWeight: 500 }}>
                    {project.shortDescription}
                  </p>
                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 500, color: "#f4f1eb", fontSize: "1.25rem", lineHeight: 1.25, marginBottom: "0.75rem" }}>
                    {project.title}
                  </h3>
                  <p style={{ fontFamily: "var(--font-body)", fontWeight: 300, color: "#aaa39a", fontSize: "0.875rem", lineHeight: 1.75 }}>
                    {project.description}
                  </p>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "1.25rem" }}>
                  {project.tags.map((tag) => (
                    <span key={tag} style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.72rem",
                      color: "#aaa39a",
                      border: "1px solid rgba(255,255,255,0.08)",
                      background: "rgba(255,255,255,0.03)",
                      padding: "0.2rem 0.55rem",
                      borderRadius: "3px",
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

// ─── CONTACT ──────────────────────────────────────────────────────────────────

function Contact() {
  return (
    <section id="contact" className="py-24 px-6 max-w-6xl mx-auto">
      <div className="mb-16 flex items-center gap-4">
        <span style={{ fontFamily: "var(--font-body)", color: "#dda957", fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase" }}>Get in touch</span>
        <span style={{ flex: 1, height: "1px", background: "#34312d" }} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 500, color: "#f4f1eb", fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.2, letterSpacing: "-0.035em", marginBottom: "1.25rem" }}>
            Always happy to <span style={{ color: "#dda957" }}>talk.</span>
          </h2>
          <p style={{ fontFamily: "var(--font-body)", fontWeight: 300, color: "#aaa39a", fontSize: "0.9rem", lineHeight: 1.8 }}>
            Whether it's about a project, a collaboration, or just engineering and design — feel free to reach out.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          {[{ label: "Email", value: ME.email, href: `mailto:${ME.email}` }, ...ME.links.map(l => ({ label: l.label, value: null, href: l.href }))].map(item => (
            <a key={item.label} href={item.href}
              className="flex items-center justify-between px-6 py-4"
              style={{ border: "1px solid #34312d", borderRadius: "2px", transition: "border-color 0.2s" }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = "#dda957")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = "#34312d")}
            >
              <span style={{ fontFamily: "var(--font-body)", color: "#f4f1eb", fontSize: "0.875rem" }}>{item.label}</span>
              {item.value
                ? <span style={{ fontFamily: "var(--font-body)", color: "#aaa39a", fontSize: "0.875rem" }}>{item.value}</span>
                : <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2h10v10M2 12L12 2" stroke="#aaa39a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              }
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-8 px-6 max-w-6xl mx-auto" style={{ borderTop: "1px solid #34312d" }}>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <span style={{ fontFamily: "var(--font-body)", color: "#333", fontSize: "0.75rem" }}>© 2026 Kit Kother</span>
        <span style={{ fontFamily: "var(--font-body)", color: "#333", fontSize: "0.75rem" }}>Delft, Netherlands</span>
      </div>
    </footer>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <div style={{ background: "#171614", minHeight: "100vh" }}>
      <Nav />
      <Hero />
      <ThreePanels />
      <Contact />
      <Footer />
    </div>
  );
}
