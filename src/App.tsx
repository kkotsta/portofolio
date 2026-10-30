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
            <a key={l.label} href={l.href} onClick={() => setOpen(false)}
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
  const updateScrollRef = useRef<(() => void) | null>(null);

  // DOM refs for scroll-driven animation (no React re-render on scroll)
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRowRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const subtopicRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const detailRef = useRef<HTMLDivElement>(null);
  const selectedIndicatorRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const el = scrollRef.current;
      if (!el || !cardRowRef.current) return;

      const { top, height } = el.getBoundingClientRect();
      const stickyTop = 56;
      const availableHeight = window.innerHeight - stickyTop;
      const scrolled = stickyTop - top;
      const total = height - availableHeight;
      if (total <= 0) return;
      const p = Math.max(0, Math.min(1, scrolled / total));

      // Use almost the full sticky track so every part of the scroll has a
      // visible response, rather than long pauses before and after the cards.
      const raw = Math.max(0, Math.min(1, p / 0.82));
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const cp = reduceMotion ? 1 : raw * raw * (3 - 2 * raw);

      // Card row height: 46vh → 68px
      const maxH = Math.min(availableHeight * 0.46, 420);
      const minH = 68;
      const h = maxH - (maxH - minH) * cp;
      cardRowRef.current.style.height = `${h}px`;

      // Give the selected section more presence as the cards collapse.
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        card.style.flexGrow = i === activeRef.current
          ? `${1 + cp * 0.6}`
          : `${1 - cp * 0.3}`;
      });

      // Title font size: large → small
      const maxFont = Math.max(18, Math.min(28, window.innerWidth * 0.022));
      const minFont = 13;
      const fontSize = maxFont - (maxFont - minFont) * cp;
      titleRefs.current.forEach(el => {
        if (el) el.style.fontSize = `${fontSize}px`;
      });

      // Subtopics fade out in first 40% of collapse
      const subOp = Math.max(0, 1 - cp * 2.5);
      subtopicRefs.current.forEach(el => {
        if (el) { el.style.opacity = `${subOp}`; el.style.pointerEvents = subOp < 0.1 ? "none" : "auto"; }
      });

      // Keep the selected outline visible at every stage.
      selectedIndicatorRefs.current.forEach((el, i) => {
        if (el) el.style.opacity = i === activeRef.current ? "1" : "0";
      });

      // Bring the detail in while the cards finish settling so the two
      // movements read as one continuous transition.
      const detailOp = Math.max(0, Math.min(1, (cp - 0.48) / 0.42));
      if (detailRef.current) {
        detailRef.current.style.opacity = `${detailOp}`;
        detailRef.current.style.transform = `translateY(${(1 - detailOp) * 12}px)`;
        detailRef.current.style.pointerEvents = detailOp > 0.1 ? "auto" : "none";
      }
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    updateScrollRef.current = requestUpdate;

    const onScroll = () => requestUpdate();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", requestUpdate);
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", requestUpdate);
      updateScrollRef.current = null;
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const handleSelect = (id: number) => {
    activeRef.current = id;
    setActive(id);
    updateScrollRef.current?.();
  };

  const panel = PANEL_STYLES[active];

  return (
    <div id="panels" ref={scrollRef} style={{ height: "175svh", position: "relative" }}>
      <div style={{ position: "sticky", top: "3.5rem", height: "calc(100svh - 3.5rem)", overflow: "hidden" }}>

        {/* Landscape background photo */}
        <img
          src={bg2Photo}
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "center bottom",
            filter: "brightness(0.9) saturate(0.95)",
          }}
        />
        {/* Continue the photo-to-photo blend without a dark seam. */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "52%",
          background: "linear-gradient(to bottom, #495d70 0%, rgba(73,93,112,0.52) 26%, transparent 100%)",
          pointerEvents: "none",
        }} />
        {/* Ease the landscape back into the site's warm charcoal background. */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "42%",
          background: "linear-gradient(to bottom, transparent 0%, rgba(23,22,20,0.38) 48%, #171614 100%)",
          pointerEvents: "none",
        }} />

      <div style={{ position: "relative", zIndex: 1, height: "100%", display: "flex", flexDirection: "column", padding: "1rem 1.5rem 1.5rem", maxWidth: "72rem", margin: "0 auto", width: "100%" }}>

        {/* Section label */}
        <div className="flex items-center gap-4 mb-4">
          <span style={{ fontFamily: "var(--font-body)", color: "#dda957", fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase" }}>Explore</span>
          <span style={{ flex: 1, height: "1px", background: "#34312d" }} />
        </div>

        {/* Card row — height driven by scroll */}
        <div ref={cardRowRef} style={{ display: "flex", gap: "6px", height: `${Math.min((window.innerHeight - 56) * 0.46, 420)}px`, flexShrink: 0, overflow: "hidden" }}>
          {PANEL_STYLES.map((p, i) => (
            <div key={p.id}
              ref={el => { cardRefs.current[i] = el; }}
              onClick={() => handleSelect(p.id)}
              style={{
                flex: 1,
                background: p.bg,
                border: `1px solid ${active === p.id ? p.border : "#181818"}`,
                borderRadius: "8px",
                padding: "1.25rem 1.25rem",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                overflow: "hidden",
                transition: "border-color 0.3s, flex-grow 0.18s ease-out",
                position: "relative",
              }}
            >
              {/* Selected indicator box (fades in when collapsed) */}
              <div ref={el => { selectedIndicatorRefs.current[i] = el; }}
                style={{
                  position: "absolute", top: 6, left: 6, right: 6, bottom: 6,
                  border: `1px solid ${p.accent}`,
                  borderRadius: "5px",
                  opacity: active === p.id ? 1 : 0,
                  transition: "opacity 0.2s",
                  pointerEvents: "none",
                }}
              />

              {/* Title */}
              <div ref={el => { titleRefs.current[i] = el; }}
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 400,
                  color: active === p.id ? "#f4f1eb" : "#aaa39a",
                  fontSize: `${Math.min(28, window.innerWidth * 0.022)}px`,
                  lineHeight: 1.25,
                  transition: "color 0.3s",
                }}
              >
                {p.label}
              </div>

              {/* Subtopic chips */}
              <div ref={el => { subtopicRefs.current[i] = el; }}
                className="custom-scroll"
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignContent: "flex-start",
                  gap: "6px",
                  transition: "opacity 0.15s",
                  overflowY: "auto",
                  maxHeight: "calc(100% - 44px)",
                  paddingRight: "2px",
                }}
              >
                {p.projects.map((project) => (
                  <div key={project.title} style={{
                    background: p.chip,
                    border: `1px solid ${p.border}`,
                    borderRadius: "4px",
                    padding: "0.28rem 0.65rem",
                    display: "inline-flex",
                    alignItems: "center",
                  }}>
                    <span style={{ fontFamily: "var(--font-body)", color: p.accent, fontSize: "0.78rem", fontWeight: 400 }}>{project.title}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Detail content — fades in as cards collapse */}
        <div ref={detailRef}
          className="custom-scroll"
          style={{
            flex: 1,
            minHeight: 0,
            opacity: 0,
            pointerEvents: "none",
            overflowY: "auto",
            paddingTop: "1.25rem",
            paddingRight: "0.5rem",
            paddingBottom: "2.5rem",
          }}
        >
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "1.5rem 2rem",
          }}>
            {panel.projects.map((project) => (
              <div
                key={project.title}
                style={{
                  background: "rgba(23, 22, 20, 0.55)",
                  border: `1px solid ${panel.border}`,
                  borderRadius: "8px",
                  padding: "1.25rem 1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  backdropFilter: "blur(12px)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
                  transition: "border-color 0.2s, transform 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = panel.accent;
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = panel.border;
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div>
                  <p style={{ fontFamily: "var(--font-body)", color: panel.accent, fontSize: "0.68rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.5rem", fontWeight: 500 }}>
                    {project.shortDescription}
                  </p>
                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 500, color: "#f4f1eb", fontSize: "1.25rem", lineHeight: 1.25, marginBottom: "0.65rem" }}>
                    {project.title}
                  </h3>
                  <p style={{ fontFamily: "var(--font-body)", fontWeight: 300, color: "#aaa39a", fontSize: "0.875rem", lineHeight: 1.7 }}>
                    {project.description}
                  </p>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "1rem" }}>
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
      </div>
    </div>
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
