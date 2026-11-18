import { useState, useEffect, useRef } from "react";
import headshot from "@/imports/IMG_6839__1_.jpg";
import bgPhoto from "@/imports/bg.jpg";
import bg2Photo from "@/imports/bg2.jpg";
import projectsCsv from "@/data/projects_portfolio.csv?raw";

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
  period: string;
  shortDescription: string;
  description: string;
  tags: string[];
  images: string[];
  longDescription: string;
};

/** Resolve an image path: URLs pass through, bare filenames become /images/filename */
function resolveImagePath(raw: string): string {
  const s = raw.trim();
  if (!s) return "";
  if (s.startsWith("http://") || s.startsWith("https://") || s.startsWith("/") || s.startsWith("data:")) return s;
  return `/images/${s}`;
}

const DEFAULT_PROJECT_IMAGES: Record<string, string[]> = {
  "Research through Design (RtD)": ["/images/rtd-1.png"],
  "Klimmende Stapelaar": ["/images/stapelaar1.png"],
  "Custom Mini Vehicle": ["/images/car.png", "/images/Self_stopping_car.jpeg", "/images/car_launch.jpeg", "/images/launch_actual.jpeg"],
  "Direct Air Carbon Capture Paper": ["https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1200&q=80"],
  "Mini CNC Machine": ["/images/cnc.jpg"],
  "Baxter Roll": ["/images/Baxter_render.jpeg", "/images/Baxter_SW.jpeg"],
  "Hyperion Lyceum": ["https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80"],
  "IDE Business Fair": ["https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80"],
  "Offshore Workability Analysis": ["https://images.unsplash.com/photo-1505705694340-019e1e335916?auto=format&fit=crop&w=1200&q=80"],
  "High School STEM Tutoring": ["https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80"],
  "Platenmeubel (Vinyl Cabinet)": ["https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=1200&q=80"],
  "Ergonomic Laptop Stand": ["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80"],
  "Photography": ["/images/photography-1.jpg", "/images/photography-2.jpg"],
  "Writing & Production": ["https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80"],
  "EasyTabMaker": ["/images/easytabmaker.png"],
};

/** Robust CSV parser that correctly supports multiline quoted fields */
function parseCSV(text: string): string[][] {
  const clean = text.replace(/^\uFEFF/, "");
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentValue = "";
  let inQuotes = false;

  for (let i = 0; i < clean.length; i += 1) {
    const char = clean[i];
    if (char === '"') {
      if (inQuotes && clean[i + 1] === '"') {
        currentValue += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      currentRow.push(currentValue);
      currentValue = "";
    } else if ((char === "\r" || char === "\n") && !inQuotes) {
      if (char === "\r" && clean[i + 1] === "\n") i += 1;
      currentRow.push(currentValue);
      if (currentRow.length > 1 || (currentRow.length === 1 && currentRow[0] !== "")) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentValue = "";
    } else {
      currentValue += char;
    }
  }

  if (currentValue !== "" || currentRow.length > 0) {
    currentRow.push(currentValue);
    rows.push(currentRow);
  }

  return rows;
}

const parsedCsvRows = parseCSV(projectsCsv).slice(1);

const PROJECTS: Project[] = parsedCsvRows.map((row) => {
  const [title, section, shortDescription, description, tags, image, period, longDescription] = row;
  const parsedImages = image
    ? image.split(",").map((s) => resolveImagePath(s)).filter(Boolean)
    : [];
  const fallbackImages = DEFAULT_PROJECT_IMAGES[title] || [];
  const images = parsedImages.length > 0 ? parsedImages : fallbackImages;

  return {
    title: (title || "").trim(),
    section: (section || "Personal Projects").trim() as ProjectSection,
    period: period && period.trim().toLowerCase() !== "none" ? period.trim() : "",
    shortDescription: (shortDescription || "").trim(),
    description: (description || "").trim(),
    tags: tags ? tags.split(";").map((tag) => tag.trim()).filter(Boolean) : [],
    images,
    longDescription: (longDescription || "").trim(),
  };
});

// ─── IMAGE CAROUSEL ───────────────────────────────────────────────────────────

function ImageCarousel({ images, alt, isExpanded = false }: { images: string[]; alt: string; isExpanded?: boolean }) {
  const [idx, setIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const hasMultiple = images.length > 1;

  if (images.length === 0) {
    return (
      <div
        className="relative w-full overflow-hidden rounded-lg mb-4"
        style={{
          aspectRatio: isExpanded ? "16 / 11" : "16 / 10",
          background: "rgba(0, 0, 0, 0.35)",
          border: "1px solid rgba(255, 255, 255, 0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ color: "#5a564f", fontSize: "0.8rem", fontFamily: "var(--font-body)" }}>No image</span>
      </div>
    );
  }

  return (
    <div
      className="relative w-full overflow-hidden rounded-lg mb-4"
      style={{
        aspectRatio: isExpanded ? "16 / 11" : "16 / 10",
        background: "rgba(0, 0, 0, 0.45)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={images[idx]}
        alt={`${alt} – ${idx + 1}`}
        loading="lazy"
        className="w-full h-full object-cover transition-all duration-500 ease-out"
        style={{ transform: isHovered ? "scale(1.03)" : "scale(1)" }}
        onError={(e) => {
          const target = e.currentTarget;
          if (idx < images.length - 1) {
            setIdx(idx + 1);
          } else {
            target.style.display = "none";
          }
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(23, 22, 20, 0.45) 0%, transparent 40%)",
          pointerEvents: "none",
        }}
      />

      {hasMultiple && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIdx((prev) => (prev - 1 + images.length) % images.length);
            }}
            aria-label="Previous image"
            className="carousel-arrow"
            style={{
              position: "absolute",
              left: "8px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "32px",
              height: "32px",
              borderRadius: "9999px",
              background: "rgba(23, 22, 20, 0.75)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              color: "#f4f1eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: "14px",
              opacity: isHovered ? 1 : 0,
              transition: "opacity 0.25s ease, background 0.2s ease",
              backdropFilter: "blur(8px)",
              zIndex: 2,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(221, 169, 87, 0.6)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(23, 22, 20, 0.75)"; }}
          >
            ‹
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIdx((prev) => (prev + 1) % images.length);
            }}
            aria-label="Next image"
            className="carousel-arrow"
            style={{
              position: "absolute",
              right: "8px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "32px",
              height: "32px",
              borderRadius: "9999px",
              background: "rgba(23, 22, 20, 0.75)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              color: "#f4f1eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: "14px",
              opacity: isHovered ? 1 : 0,
              transition: "opacity 0.25s ease, background 0.2s ease",
              backdropFilter: "blur(8px)",
              zIndex: 2,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(221, 169, 87, 0.6)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(23, 22, 20, 0.75)"; }}
          >
            ›
          </button>

          <div
            style={{
              position: "absolute",
              bottom: "8px",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: "5px",
              zIndex: 2,
              opacity: isHovered ? 1 : 0.6,
              transition: "opacity 0.25s ease",
            }}
          >
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIdx(i);
                }}
                aria-label={`Go to image ${i + 1}`}
                style={{
                  width: i === idx ? "16px" : "6px",
                  height: "6px",
                  borderRadius: "9999px",
                  background: i === idx ? "#dda957" : "rgba(255,255,255,0.45)",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  padding: 0,
                }}
              />
            ))}
          </div>

          <span
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              background: "rgba(23, 22, 20, 0.75)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#d4cfc7",
              fontSize: "0.65rem",
              fontFamily: "var(--font-body)",
              padding: "0.15rem 0.45rem",
              borderRadius: "9999px",
              zIndex: 2,
              opacity: isHovered ? 1 : 0,
              transition: "opacity 0.25s ease",
            }}
          >
            {idx + 1}/{images.length}
          </span>
        </>
      )}
    </div>
  );
}

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

  // ── AANPASBAAR: RUIMTES & HOOGTES VAN DE START (HERO SECTIE) ──────────────
  // De ruimte boven (onder de navbar) en onder (boven Explore) staat nu exact
  // afgesteld op 1/4 van de totale content/fotoblok-hoogte (~105px).
  // ────────────────────────────────────────────────────────────────────────────
  return (
    <section style={{ position: "relative", overflow: "hidden" }}>
      {/* Background photo 1 (wolken lucht) */}
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

      {/* Content — Exact 1/4 van de content/fotoblok-hoogte erboven en eronder */}
      <div
        className="relative px-6 w-full max-w-6xl mx-auto"
        style={{
          paddingTop: "calc(3.5rem + clamp(60px, 12vw, 105px))",
          paddingBottom: "clamp(60px, 12vw, 105px)",
        }}
      >
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="block w-8 h-px" style={{ background: "#dda957" }} />
              <span style={{ color: "#dda957", fontFamily: "var(--font-body)", fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                Delft, Netherlands · 2026
              </span>
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 500, color: "#f4f1eb", fontSize: "clamp(2.75rem, 6.5vw, 5rem)", lineHeight: 1, letterSpacing: "-0.045em", marginBottom: "1.25rem", textShadow: "0 2px 24px rgba(0,0,0,0.4)" }}>
              Kit <span style={{ color: "#dda957" }}>Kother</span>
            </h1>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 400, color: "rgba(244,241,235,0.85)", fontSize: "clamp(1rem, 2.2vw, 1.15rem)", lineHeight: 1.5, marginBottom: "1.25rem", maxWidth: "38ch" }}>
              {ME.tagline}
            </p>
            <p style={{ fontFamily: "var(--font-body)", fontWeight: 300, color: "rgba(244,241,235,0.68)", fontSize: "0.9rem", lineHeight: 1.75, maxWidth: "44ch", marginBottom: "1.75rem" }}>
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

          <div className="flex flex-col items-center lg:items-end justify-center">
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", inset: 0, transform: "translate(8px, 8px)", border: "1px solid #dda957", borderRadius: "4px", opacity: 0.55 }} />
              <img src={headshot} alt="Kit Kother"
                style={{ width: "clamp(200px, 28vw, 320px)", aspectRatio: "3/4", objectFit: "cover", objectPosition: "center top", borderRadius: "4px", display: "block", filter: "brightness(0.9) contrast(1.02)", position: "relative" }}
              />
            </div>
            <p style={{ marginTop: "0.85rem", fontFamily: "var(--font-body)", fontSize: "0.65rem", color: "rgba(240,237,232,0.3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Photo by Kit Kother
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── THREE PANELS / PROJECTS SECTION ──────────────────────────────────────────

const SECTION_ACCENTS: Record<ProjectSection, string> = {
  "Education": "#e09b45",
  "Career": "#66bdd3",
  "Personal Projects": "#ad91ce",
};

function ThreePanels() {
  const [activeCategory, setActiveCategory] = useState<"all" | ProjectSection>("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isFilterExpanded, setIsFilterExpanded] = useState<boolean>(false);
  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  const [renderedCategory, setRenderedCategory] = useState<"all" | ProjectSection>("all");
  const [renderedTags, setRenderedTags] = useState<string[]>([]);
  const [isExiting, setIsExiting] = useState(false);

  const activeCategoryRef = useRef<"all" | ProjectSection>("all");
  const transitionTimeoutRef = useRef<number | null>(null);
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
      const stickyTop = 56;
      const collapseDistance = 160;
      const scrolledPast = stickyTop - top;
      const progress = Math.max(0, Math.min(1, scrolledPast / collapseDistance));

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const cp = reduceMotion ? (progress > 0.5 ? 1 : 0) : progress * progress * (3 - 2 * progress);

      const isMobile = window.innerWidth < 768;

      const maxH = 210;
      const minH = 54;
      const h = maxH - (maxH - minH) * cp;
      cardRowRef.current.style.height = `${h}px`;

      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        if (isMobile) {
          if (cp > 0.45) {
            card.style.minWidth = "0px";
            card.style.flex = "1 1 0px";
          } else {
            card.style.minWidth = "82vw";
            card.style.flex = "0 0 auto";
          }
        } else {
          card.style.minWidth = "0px";
          card.style.flex = "1 1 0px";
          card.style.flexGrow = (PANEL_STYLES[i].label === activeCategoryRef.current)
            ? `${1 + cp * 0.4}`
            : `${1 - cp * 0.2}`;
        }
      });

      const maxFont = 20;
      const minFont = 13.5;
      const fontSize = maxFont - (maxFont - minFont) * cp;
      titleRefs.current.forEach(el => {
        if (el) el.style.fontSize = `${fontSize}px`;
      });

      const subOp = Math.max(0, 1 - cp * 2.2);
      subtopicRefs.current.forEach(el => {
        if (el) {
          el.style.opacity = `${subOp}`;
          el.style.pointerEvents = subOp < 0.1 ? "none" : "auto";
        }
      });

      selectedIndicatorRefs.current.forEach((el, i) => {
        if (el) el.style.opacity = (PANEL_STYLES[i].label === activeCategoryRef.current) ? "0.6" : "0";
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
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
    };
  }, []);

  const triggerTransition = (targetCategory: "all" | ProjectSection, nextTags: string[]) => {
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }
    setIsExiting(true);
    transitionTimeoutRef.current = window.setTimeout(() => {
      setRenderedCategory(targetCategory);
      setRenderedTags(nextTags);
      setIsExiting(false);
    }, 180);
  };

  const handleSelectNode = (id: number) => {
    const panel = PANEL_STYLES[id];
    const isSame = activeCategory === panel.label;
    const targetCategory = isSame ? "all" : panel.label;
    activeCategoryRef.current = targetCategory;
    setActiveCategory(targetCategory);
    triggerTransition(targetCategory, selectedTags);
  };

  // Multi-select toggle for tags & titles
  const handleToggleTag = (tag: string) => {
    const isSelected = selectedTags.includes(tag);
    const nextTags = isSelected
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];

    setSelectedTags(nextTags);
    triggerTransition(activeCategory, nextTags);
  };

  const handleClearFilters = () => {
    setSelectedTags([]);
    triggerTransition(activeCategory, []);
  };

  // Derive relevant tags according to current category
  const relevantProjects = activeCategory === "all"
    ? PROJECTS
    : PROJECTS.filter((p) => p.section === activeCategory);

  const availableTags = Array.from(
    new Set(
      relevantProjects.flatMap((p) => p.tags)
    )
  ).sort((a, b) => a.localeCompare(b));

  // Filter displayed projects based on category and multi-select tags (union filter)
  const displayedProjects = PROJECTS.filter((project) => {
    if (renderedCategory !== "all" && project.section !== renderedCategory) {
      return false;
    }
    if (renderedTags.length === 0) {
      return true;
    }
    // Matches if ANY selected tag is in the project's tags
    return renderedTags.some((tag) => project.tags.includes(tag));
  });

  return (
    <section id="panels" ref={scrollRef} style={{ position: "relative", minHeight: "100vh", paddingBottom: "4rem" }}>
      {/* Background landscape photo */}
      <img
        src={bg2Photo}
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          width: "100%",
          height: "980px",
          objectFit: "cover",
          objectPosition: "center 30%",
          filter: "brightness(0.85) saturate(0.95)",
          pointerEvents: "none",
        }}
      />

      <div style={{
        position: "absolute",
        top: "620px",
        left: 0,
        right: 0,
        height: "360px",
        background: "linear-gradient(to bottom, transparent 0%, rgba(23,22,20,0.85) 60%, #171614 100%)",
        pointerEvents: "none",
      }} />

      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "260px",
        background: "linear-gradient(to bottom, #495d70 0%, rgba(73,93,112,0.42) 40%, transparent 100%)",
        pointerEvents: "none",
      }} />

      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "320px",
        background: "linear-gradient(to bottom, transparent 0%, rgba(23,22,20,0.65) 50%, #171614 100%)",
        pointerEvents: "none",
      }} />

      {/* Main Container */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: "72rem", margin: "0 auto", padding: "1.5rem 1.5rem 0" }}>

        {/* Section label */}
        <div className="flex items-center gap-4 mb-4">
          <span style={{ fontFamily: "var(--font-body)", color: "#dda957", fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase" }}>Explore</span>
          <span style={{ flex: 1, height: "1px", background: "#34312d" }} />
        </div>

        {/* 1. THE 3 NODES (Education, Career, Personal Projects) */}
        <div
          style={{
            position: "sticky",
            top: "3.5rem",
            zIndex: 30,
            paddingTop: "0.5rem",
            paddingBottom: "0.75rem",
          }}
        >
          <div
            ref={cardRowRef}
            className="flex gap-2.5 sm:gap-3 overflow-x-auto md:overflow-hidden snap-x snap-mandatory custom-scroll pb-1 md:pb-0"
            style={{
              height: "210px",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {PANEL_STYLES.map((p, i) => {
              const isNodeActive = activeCategory === p.label;
              return (
                <div
                  key={p.id}
                  ref={el => { cardRefs.current[i] = el; }}
                  onClick={() => handleSelectNode(p.id)}
                  className="category-card snap-center shrink-0 md:shrink"
                  style={{
                    flex: 1,
                    background: p.bg,
                    border: isNodeActive ? "2px solid #dda957" : `1px solid ${p.border}`,
                    borderRadius: "8px",
                    padding: "0.85rem 1.1rem",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    overflow: "hidden",
                    position: "relative",
                    boxShadow: isNodeActive ? `0 0 20px ${p.accent}33, 0 6px 18px rgba(0,0,0,0.22)` : "none",
                    opacity: activeCategory === "all" ? 1 : isNodeActive ? 1 : 0.84,
                    transition: "border 0.25s, opacity 0.25s, box-shadow 0.25s, flex-grow 0.2s ease-out",
                  }}
                  onMouseEnter={(e) => {
                    if (!isNodeActive) {
                      e.currentTarget.style.borderColor = p.accent;
                      e.currentTarget.style.opacity = "0.9";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isNodeActive) {
                      e.currentTarget.style.borderColor = p.border;
                      e.currentTarget.style.opacity = activeCategory === "all" ? "0.9" : "0.65";
                    }
                  }}
                >
                  <div
                    ref={el => { selectedIndicatorRefs.current[i] = el; }}
                    style={{
                      position: "absolute", top: 3, left: 3, right: 3, bottom: 3,
                      border: `1px solid ${p.accent}`,
                      borderRadius: "6px",
                      opacity: isNodeActive ? 0.6 : 0,
                      transition: "opacity 0.2s",
                      pointerEvents: "none",
                    }}
                  />

                  {/* Title & Count Badge */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", marginBottom: "0.5rem" }}>
                    <div
                      ref={el => { titleRefs.current[i] = el; }}
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 500,
                        color: isNodeActive ? "#f4f1eb" : "#a8a29a",
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
                      color: isNodeActive ? p.accent : "#787268",
                      background: isNodeActive ? `${p.accent}26` : "rgba(0,0,0,0.3)",
                      border: isNodeActive ? `1px solid ${p.accent}4d` : "1px solid transparent",
                      padding: "0.15rem 0.55rem",
                      borderRadius: "9999px",
                      fontWeight: 500,
                      transition: "all 0.25s",
                    }}>
                      {p.projects.length}
                    </span>
                  </div>

                  {/* Subtopic chips inside nodes */}
                  <div
                    ref={el => { subtopicRefs.current[i] = el; }}
                    className="custom-scroll"
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignContent: "flex-start",
                      gap: "6px",
                      transition: "opacity 0.15s",
                      overflowY: "auto",
                      overflowX: "hidden",
                      maxHeight: "135px",
                      paddingRight: "2px",
                    }}
                  >
                    {Array.from(new Set(p.projects.flatMap((proj) => proj.tags))).map((tag) => {
                      const isTagActive = selectedTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleTag(tag);
                          }}
                          className="tag-pill"
                          style={{
                            background: isTagActive ? p.accent : p.chip,
                            borderColor: isTagActive ? p.accent : p.border,
                            color: isTagActive ? "#171614" : p.accent,
                            fontWeight: isTagActive ? 600 : 400,
                            boxShadow: isTagActive ? `0 2px 12px ${p.accent}66, 0 0 10px ${p.accent}33` : "none",
                            transform: isTagActive ? "translateY(-1px)" : "none",
                          }}
                          title={`Filter by: ${tag}`}
                        >
                          <span>{tag}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. FILTER BUTTON & EXPANDABLE MULTI-SELECT FILTER BAR (DIRECTLY UNDER 3 NODES) */}
        <div className="mt-3 mb-6">
          <div
            className="rounded-xl backdrop-blur-md transition-all duration-300"
            style={{
              background: "linear-gradient(to bottom, rgba(23,22,20,0.95) 0%, rgba(23,22,20,0.85) 100%)",
              border: selectedTags.length > 0 ? "1px solid rgba(221, 169, 87, 0.45)" : "1px solid rgba(255, 255, 255, 0.08)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.35)",
              padding: "0.85rem 1.25rem",
              position: "relative",
            }}
          >
            {/* Header / Toggle Row */}
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                className="cursor-pointer inline-flex items-center gap-2.5 text-sm font-medium transition-colors"
                style={{
                  fontFamily: "var(--font-body)",
                  color: isFilterExpanded || selectedTags.length > 0 ? "#dda957" : "#e5dfd5",
                }}
              >
                <span
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-transform duration-300"
                  style={{
                    background: "rgba(221, 169, 87, 0.15)",
                    border: "1px solid rgba(221, 169, 87, 0.3)",
                    color: "#dda957",
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ transform: isFilterExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.25s" }}
                  >
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                  </svg>
                </span>
                <span className="font-semibold tracking-wide">
                  {isFilterExpanded ? "Hide Filters" : "Filter Options"}
                </span>

                {selectedTags.length > 0 && (
                  <span
                    className="ml-1 text-xs px-2 py-0.5 rounded-full font-bold"
                    style={{
                      background: "#dda957",
                      color: "#171614",
                    }}
                  >
                    {selectedTags.length} active
                  </span>
                )}

                <span style={{ color: "#787268", fontSize: "0.75rem", marginLeft: "4px" }}>
                  ({isFilterExpanded ? "Click to collapse" : "Click to expand & multi-select"})
                </span>
              </button>

              {/* Stylish Cross Button on the Top Right of Filter Bar */}
              {selectedTags.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  title="Clear all active filters"
                  className="cursor-pointer flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all"
                  style={{
                    background: "rgba(221, 169, 87, 0.15)",
                    border: "1px solid rgba(221, 169, 87, 0.35)",
                    color: "#dda957",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(221, 169, 87, 0.3)";
                    e.currentTarget.style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(221, 169, 87, 0.15)";
                    e.currentTarget.style.color = "#dda957";
                  }}
                >
                  <span className="text-sm leading-none font-bold">✕</span>
                  <span className="hidden sm:inline">Clear all ({selectedTags.length})</span>
                </button>
              )}
            </div>

            {/* Active Selected Tags Pills Preview (When collapsed) */}
            {!isFilterExpanded && selectedTags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mt-3 pt-3" style={{ borderTop: "1px solid rgba(255, 255, 255, 0.06)" }}>
                <span style={{ fontSize: "0.7rem", color: "#8a847b", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  Active:
                </span>
                {selectedTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleToggleTag(tag)}
                    className="tag-pill tag-pill-active inline-flex items-center gap-1.5"
                    style={{ fontSize: "0.74rem", padding: "0.2rem 0.55rem" }}
                    title="Click to remove"
                  >
                    <span>{tag}</span>
                    <span className="text-xs font-bold opacity-80 hover:opacity-100">✕</span>
                  </button>
                ))}
              </div>
            )}

            {/* Expandable Tag Cloud for Multi-Select */}
            {isFilterExpanded && (
              <div className="mt-4 pt-3" style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
                <div className="flex items-center justify-between mb-2.5">
                  <span style={{ fontFamily: "var(--font-body)", color: "#a39d94", fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                    Select one or more topics / tags to combine:
                  </span>
                  {selectedTags.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearFilters}
                      className="text-xs hover:underline cursor-pointer"
                      style={{ color: "#dda957" }}
                    >
                      Deselect all
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto custom-scroll pr-1">
                  {availableTags.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleToggleTag(tag)}
                        className={`tag-pill ${isSelected ? "tag-pill-active" : ""}`}
                        style={{
                          fontSize: "0.78rem",
                          padding: "0.3rem 0.75rem",
                          borderRadius: "9999px",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          transition: "all 0.18s ease",
                        }}
                      >
                        <span>{tag}</span>
                        {isSelected && <span className="font-bold text-xs">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. PROJECT CARDS IN NATURAL PAGE FLOW */}
        <div ref={projectsListRef} style={{ paddingTop: "0.5rem", paddingBottom: "2rem" }}>
          {/* Active filter status badge */}
          {renderedTags.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 px-1">
              <div className="flex flex-wrap items-center gap-2">
                <span style={{ fontFamily: "var(--font-body)", color: "#a39d94", fontSize: "0.72rem", letterSpacing: "0.14em", textTransform: "uppercase" }}>
                  Filtering by ({renderedTags.length}):
                </span>
                {renderedTags.map((t) => (
                  <div
                    key={t}
                    className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium"
                    style={{ background: "rgba(221, 169, 87, 0.18)", border: "1px solid #dda957", color: "#dda957" }}
                  >
                    <span>{t}</span>
                    <button
                      type="button"
                      onClick={() => handleToggleTag(t)}
                      title={`Remove filter "${t}"`}
                      className="ml-0.5 hover:text-white transition-colors cursor-pointer text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <span style={{ fontFamily: "var(--font-body)", color: "#787268", fontSize: "0.75rem", marginLeft: "6px" }}>
                  ({displayedProjects.length} {displayedProjects.length === 1 ? "project" : "projects"} match)
                </span>
              </div>

              <button
                type="button"
                onClick={handleClearFilters}
                className="cursor-pointer text-xs transition-colors flex items-center gap-1"
                style={{
                  fontFamily: "var(--font-body)",
                  color: "#dda957",
                  textDecoration: "underline",
                  textUnderlineOffset: "4px",
                }}
              >
                <span>Clear filters</span>
                <span>✕</span>
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
            {displayedProjects.map((project, idx) => {
              const isCardSelected = renderedTags.includes(project.title);
              const accentColor = SECTION_ACCENTS[project.section] || "#dda957";
              const isExpanded = expandedProject === project.title;

              return (
                <div
                  key={`${renderedCategory}-${project.title}`}
                  className={`group project-card ${isExpanded ? "col-span-1 md:col-span-2" : "col-span-1"} ${isExiting ? "project-card-exit" : "project-card-enter"}`}
                  style={{
                    animationDelay: isExiting ? "0ms" : `${idx * 30}ms`,
                    background: "rgba(23, 22, 20, 0.78)",
                    border: isExpanded
                      ? `2px solid ${accentColor}`
                      : `1px solid ${isCardSelected ? "#dda957" : "rgba(255, 255, 255, 0.1)"}`,
                    borderRadius: "12px",
                    padding: isExpanded ? "2.25rem" : "1.75rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    backdropFilter: "blur(14px)",
                    boxShadow: isExpanded
                      ? `0 16px 48px rgba(0,0,0,0.65), 0 0 24px ${accentColor}40`
                      : isCardSelected
                        ? "0 10px 32px rgba(0,0,0,0.45), 0 0 20px rgba(221,169,87,0.28)"
                        : "0 6px 24px rgba(0,0,0,0.32)",
                    transition: "all 0.35s ease",
                    position: "relative",
                  }}
                  onMouseEnter={(e) => {
                    if (!isExpanded) {
                      e.currentTarget.style.borderColor = "#dda957";
                      e.currentTarget.style.boxShadow = `0 12px 36px rgba(0,0,0,0.5), 0 0 18px ${accentColor}30`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isExpanded) {
                      e.currentTarget.style.borderColor = isCardSelected ? "#dda957" : "rgba(255, 255, 255, 0.1)";
                      e.currentTarget.style.boxShadow = isCardSelected
                        ? "0 10px 32px rgba(0,0,0,0.45), 0 0 20px rgba(221,169,87,0.28)"
                        : "0 6px 24px rgba(0,0,0,0.32)";
                    }
                  }}
                >
                  {/* Top-right close button when expanded */}
                  {isExpanded && (
                    <button
                      type="button"
                      onClick={() => setExpandedProject(null)}
                      title="Collapse card"
                      className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold cursor-pointer transition-transform duration-200 hover:scale-110"
                      style={{
                        background: "rgba(255,255,255,0.08)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        color: "#f4f1eb",
                        zIndex: 10,
                      }}
                    >
                      ✕
                    </button>
                  )}

                  {/* Normal Card View */}
                  {!isExpanded && (
                    <div className="flex flex-col h-full justify-between">
                      <div className="flex flex-col">
                        {/* CATEGORY & SHORT DESCRIPTION (fixed height) */}
                        <div className="flex items-center justify-between gap-2 mb-3 h-7">
                          <span
                            style={{
                              fontFamily: "var(--font-body)",
                              fontSize: "0.7rem",
                              fontWeight: 600,
                              letterSpacing: "0.1em",
                              textTransform: "uppercase",
                              color: accentColor,
                              background: `${accentColor}18`,
                              border: `1px solid ${accentColor}40`,
                              padding: "0.22rem 0.65rem",
                              borderRadius: "9999px",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                              flexShrink: 0,
                            }}
                          >
                            <span style={{ width: "6px", height: "6px", borderRadius: "9999px", background: accentColor }} />
                            {project.section}
                          </span>
                          <span
                            style={{
                              fontFamily: "var(--font-body)",
                              fontSize: "0.72rem",
                              color: "#8a847b",
                              letterSpacing: "0.08em",
                              textTransform: "uppercase",
                              fontWeight: 500,
                              maxWidth: "60%",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                            title={project.shortDescription}
                          >
                            {project.shortDescription}
                          </span>
                        </div>

                        {/* TITLE & PERIOD (fixed height container so carousels align perfectly) */}
                        <div className="mb-3" style={{ minHeight: "4rem" }}>
                          <h3
                            style={{
                              fontFamily: "var(--font-display)",
                              fontWeight: 600,
                              color: "#f4f1eb",
                              fontSize: "1.45rem",
                              lineHeight: 1.25,
                              marginBottom: "0.25rem",
                            }}
                          >
                            {project.title}
                          </h3>
                          {project.period ? (
                            <span
                              style={{
                                fontFamily: "var(--font-body)",
                                fontSize: "0.75rem",
                                color: "#a39d94",
                                letterSpacing: "0.04em",
                                display: "block",
                              }}
                            >
                              {project.period}
                            </span>
                          ) : (
                            <span
                              style={{
                                display: "block",
                                height: "1.125rem",
                                visibility: "hidden",
                              }}
                            >
                              -
                            </span>
                          )}
                        </div>

                        {/* PICTURE CAROUSEL (exact 16/10 aspect ratio on every card) */}
                        <ImageCarousel images={project.images} alt={project.title} />

                        {/* SHORT/SUMMARY DESCRIPTION (uniform height block with line-clamp) */}
                        <p
                          className="line-clamp-3"
                          style={{
                            fontFamily: "var(--font-body)",
                            fontWeight: 300,
                            color: "#b8b2a7",
                            fontSize: "0.92rem",
                            lineHeight: 1.65,
                            minHeight: "4.5rem",
                            marginBottom: "1rem",
                          }}
                          title={project.description}
                        >
                          {project.description}
                        </p>
                      </div>

                      {/* BOTTOM SECTION: TAGS & READ MORE ACTION (always aligned at bottom) */}
                      <div className="mt-auto pt-3" style={{ borderTop: "1px solid rgba(255, 255, 255, 0.06)" }}>
                        <div
                          className="flex flex-wrap gap-1.5 mb-3.5 custom-scroll overflow-hidden"
                          style={{ height: "3.75rem", alignContent: "flex-start" }}
                        >
                          {project.tags.map((tag) => {
                            const isTagActive = selectedTags.includes(tag);
                            return (
                              <button
                                key={tag}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleTag(tag);
                                }}
                                title={`Filter by tag: ${tag}`}
                                className="tag-pill"
                                style={{
                                  fontFamily: "var(--font-body)",
                                  fontSize: "0.72rem",
                                  color: isTagActive ? "#171614" : "#a39d94",
                                  border: `1px solid ${isTagActive ? "#dda957" : "rgba(255,255,255,0.08)"}`,
                                  background: isTagActive ? "#dda957" : "rgba(255,255,255,0.03)",
                                  padding: "0.22rem 0.6rem",
                                  borderRadius: "9999px",
                                  cursor: "pointer",
                                  transition: "all 0.2s ease",
                                  fontWeight: isTagActive ? 600 : 400,
                                }}
                              >
                                {tag}
                              </button>
                            );
                          })}
                        </div>

                        {/* Read More button */}
                        <button
                          type="button"
                          onClick={() => setExpandedProject(project.title)}
                          className="w-full py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 cursor-pointer font-medium text-sm transition-all duration-200"
                          style={{
                            background: "rgba(255, 255, 255, 0.04)",
                            border: "1px solid rgba(255, 255, 255, 0.12)",
                            color: "#dda957",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "rgba(221, 169, 87, 0.15)";
                            e.currentTarget.style.borderColor = "#dda957";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
                            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)";
                          }}
                        >
                          <span>Read more</span>
                          <span>→</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Expanded Card View (Twice as wide & twice as tall with longDescription) */}
                  {isExpanded && (
                    <div className="w-full flex flex-col">
                      {/* Top Header */}
                      <div className="flex items-center gap-3 mb-3 pr-10">
                        <span
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            color: accentColor,
                            background: `${accentColor}18`,
                            border: `1px solid ${accentColor}40`,
                            padding: "0.25rem 0.75rem",
                            borderRadius: "9999px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <span style={{ width: "6px", height: "6px", borderRadius: "9999px", background: accentColor }} />
                          {project.section}
                        </span>
                        <span style={{ color: "#a39d94", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                          {project.shortDescription}
                        </span>
                        {project.period && (
                          <span style={{ color: "#787268", fontSize: "0.82rem" }}>
                            • {project.period}
                          </span>
                        )}
                      </div>

                      <h3
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 600,
                          color: "#f4f1eb",
                          fontSize: "clamp(1.75rem, 3.5vw, 2.35rem)",
                          lineHeight: 1.25,
                          marginBottom: "1.5rem",
                        }}
                      >
                        {project.title}
                      </h3>

                      {/* 2-Column Layout inside expanded card for spacious height & width */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-6">
                        {/* Left column: Carousel & Tags */}
                        <div className="lg:col-span-5 flex flex-col">
                          <ImageCarousel images={project.images} alt={project.title} isExpanded />

                          <div className="flex flex-wrap gap-2 mt-2">
                            {project.tags.map((tag) => {
                              const isTagActive = selectedTags.includes(tag);
                              return (
                                <button
                                  key={tag}
                                  type="button"
                                  onClick={() => handleToggleTag(tag)}
                                  className="tag-pill"
                                  style={{
                                    fontFamily: "var(--font-body)",
                                    fontSize: "0.72rem",
                                    color: isTagActive ? "#171614" : "#a39d94",
                                    border: `1px solid ${isTagActive ? "#dda957" : "rgba(255,255,255,0.08)"}`,
                                    background: isTagActive ? "#dda957" : "rgba(255,255,255,0.03)",
                                    padding: "0.22rem 0.6rem",
                                    borderRadius: "9999px",
                                    cursor: "pointer",
                                  }}
                                >
                                  {tag}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Right column: Long Description */}
                        <div className="lg:col-span-7 flex flex-col justify-start">
                          <div
                            className="p-5 rounded-xl mb-4"
                            style={{
                              background: "rgba(0, 0, 0, 0.28)",
                              border: "1px solid rgba(255, 255, 255, 0.05)",
                            }}
                          >
                            <span style={{ color: "#dda957", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 600, display: "block", marginBottom: "0.6rem" }}>
                              Project Overview
                            </span>
                            <p style={{ fontFamily: "var(--font-body)", fontWeight: 300, color: "#d5cfc5", fontSize: "0.98rem", lineHeight: 1.8 }}>
                              {project.description}
                            </p>
                          </div>

                          <div className="space-y-4">
                            <span style={{ color: "#a39d94", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 600, display: "block" }}>
                              Detailed Breakdown
                            </span>
                            {(project.longDescription || project.description)
                              .split(/\n\n+|\n/)
                              .filter((p) => p.trim().length > 0)
                              .map((paragraph, pIdx) => (
                                <p
                                  key={pIdx}
                                  style={{
                                    fontFamily: "var(--font-body)",
                                    fontWeight: 300,
                                    color: "#cac4b8",
                                    fontSize: "0.95rem",
                                    lineHeight: 1.85,
                                  }}
                                >
                                  {paragraph.trim()}
                                </p>
                              ))}
                          </div>
                        </div>
                      </div>

                      {/* Bottom close button */}
                      <div className="flex justify-end pt-4 border-t border-white/10">
                        <button
                          type="button"
                          onClick={() => setExpandedProject(null)}
                          className="px-6 py-2.5 rounded-lg flex items-center gap-2 cursor-pointer font-medium text-sm transition-all"
                          style={{
                            background: "rgba(221, 169, 87, 0.15)",
                            border: "1px solid #dda957",
                            color: "#dda957",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#dda957";
                            e.currentTarget.style.color = "#171614";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "rgba(221, 169, 87, 0.15)";
                            e.currentTarget.style.color = "#dda957";
                          }}
                        >
                          <span>Show less</span>
                          <span>↑</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
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
  useEffect(() => {
    document.title = "Kit Kother — Portfolio";
  }, []);

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
