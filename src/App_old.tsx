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
  images: string[];
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
  "Klimmende Stapelaar": ["/images/stapelaar-1.jpg", "/images/stapelaar-2.jpg"],
  "Custom Mini Vehicle": ["/images/vehicle-1.jpg", "/images/vehicle-2.jpg"],
  "Direct Air Carbon Capture Paper": [],
  "Mini CNC Machine": ["/images/cnc-1.png"],
  "Baxter Roll": [],
  "Hyperion Lyceum": [],
  "Offshore Workability Analysis": [],
  "High School STEM Tutoring": [],
  "Platenmeubel (Vinyl Cabinet)": [],
  "Ergonomic Laptop Stand": [],
  "Photography": ["/images/photography-1.jpg", "/images/photography-2.jpg"],
  "Writing & Production": [],
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
    const [title, section, shortDescription, description, tags, image] = parseCsvRow(row);
    // Parse comma-separated image paths, resolve each one
    const parsedImages = image
      ? image.split(",").map((s) => resolveImagePath(s)).filter(Boolean)
      : [];
    const fallbackImages = DEFAULT_PROJECT_IMAGES[title] || [];
    const images = parsedImages.length > 0 ? parsedImages : fallbackImages;
    return {
      title,
      section: section as ProjectSection,
      shortDescription,
      description,
      tags: tags ? tags.split(";").map((tag) => tag.trim()) : [],
      images,
    };
  });

// ─── IMAGE CAROUSEL ───────────────────────────────────────────────────────────

function ImageCarousel({ images, alt }: { images: string[]; alt: string }) {
  const [idx, setIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const hasMultiple = images.length > 1;

  // If no images at all, show placeholder
  if (images.length === 0) {
    return (
      <div
        className="relative w-full overflow-hidden rounded-lg mb-4"
        style={{
          aspectRatio: "16 / 10",
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
        aspectRatio: "16 / 10",
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
        style={{ transform: isHovered ? "scale(1.04)" : "scale(1)" }}
        onError={(e) => {
          const target = e.currentTarget;
          // Try next image or fallback
          if (idx < images.length - 1) {
            setIdx(idx + 1);
          } else {
            target.style.display = "none";
          }
        }}
      />

      {/* Gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(23, 22, 20, 0.45) 0%, transparent 40%)",
          pointerEvents: "none",
        }}
      />

      {/* Carousel arrows – only visible on hover when multiple images */}
      {hasMultiple && (
        <>
          {/* Left arrow */}
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

          {/* Right arrow */}
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

          {/* Dot indicators */}
          <div
            style={{
              position: "absolute",
              bottom: "8px",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: "5px",
              zIndex: 2,
              opacity: isHovered ? 1 : 0.5,
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

          {/* Image counter badge */}
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
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center py-12 lg:py-16">
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
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 400, color: "rgba(244,241,235,0.8)", fontSize: "clamp(1rem, 2.5vw, 1.2rem)", lineHeight: 1.55, marginBottom: "1.75rem", maxWidth: "38ch" }}>
              {ME.tagline}
            </p>
            <p style={{ fontFamily: "var(--font-body)", fontWeight: 300, color: "rgba(244,241,235,0.68)", fontSize: "0.9rem", lineHeight: 1.8, maxWidth: "44ch", marginBottom: "2rem" }}>
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
        <p style={{ position: "absolute", bottom: "0.75rem", right: "1.5rem", fontFamily: "var(--font-body)", fontSize: "0.65rem", color: "rgba(240,237,232,0.25)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Photo by Kit Kother
        </p>
      </div>
    </section>
  );
}

// ─── THREE PANELS / PROJECTS SECTION ──────────────────────────────────────────

const CATEGORIES: { id: "all" | ProjectSection; label: string }[] = [
  { id: "all", label: "All" },
  { id: "Education", label: "Education" },
  { id: "Career", label: "Career" },
  { id: "Personal Projects", label: "Personal Projects" },
];

const SECTION_ACCENTS: Record<ProjectSection, string> = {
  "Education": "#e09b45",
  "Career": "#66bdd3",
  "Personal Projects": "#ad91ce",
};

function ThreePanels() {
  const [activeCategory, setActiveCategory] = useState<"all" | ProjectSection>("all");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [renderedCategory, setRenderedCategory] = useState<"all" | ProjectSection>("all");
  const [renderedTag, setRenderedTag] = useState<string | null>(null);
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
      const stickyTop = 56; // 3.5rem navbar height
      const collapseDistance = 160;
      const scrolledPast = stickyTop - top;
      const progress = Math.max(0, Math.min(1, scrolledPast / collapseDistance));

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const cp = reduceMotion ? (progress > 0.5 ? 1 : 0) : progress * progress * (3 - 2 * progress);

      const isMobile = window.innerWidth < 768;

      // Card row height: collapses from 210px to 54px
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

  const handleSelectCategory = (catId: "all" | ProjectSection) => {
    const isReset = catId === activeCategory && selectedTag !== null;
    if (catId === activeCategory && !isReset) return;

    activeCategoryRef.current = catId;
    setActiveCategory(catId);
    setSelectedTag(null);

    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }

    setIsExiting(true);
    transitionTimeoutRef.current = window.setTimeout(() => {
      setRenderedCategory(catId);
      setRenderedTag(null);
      setIsExiting(false);
    }, 220);
  };

  const handleSelectNode = (id: number) => {
    const panel = PANEL_STYLES[id];
    handleSelectCategory(panel.label);
  };

  const handleTagClick = (tag: string | null, section?: ProjectSection) => {
    const targetCategory = section !== undefined ? section : activeCategory;
    const isDeselect = targetCategory === activeCategory && (tag === null || selectedTag === tag);
    const nextTag = isDeselect ? null : tag;

    activeCategoryRef.current = targetCategory;
    setActiveCategory(targetCategory);
    setSelectedTag(nextTag);

    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }

    setIsExiting(true);
    transitionTimeoutRef.current = window.setTimeout(() => {
      setRenderedCategory(targetCategory);
      setRenderedTag(nextTag);
      setIsExiting(false);
    }, 220);
  };

  const displayedProjects = PROJECTS.filter((project) => {
    if (renderedCategory !== "all" && project.section !== renderedCategory) {
      return false;
    }
    if (!renderedTag) {
      return true;
    }
    return project.title === renderedTag || project.tags.includes(renderedTag);
  });

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
      <div style={{ position: "relative", zIndex: 1, maxWidth: "72rem", margin: "0 auto", padding: "1.5rem 1.5rem 0" }}>

        {/* Section label */}
        <div className="flex items-center gap-4 mb-4">
          <span style={{ fontFamily: "var(--font-body)", color: "#dda957", fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase" }}>Explore</span>
          <span style={{ flex: 1, height: "1px", background: "#34312d" }} />
        </div>

        {/* 1. FILTER BAR WITH "ALL" AND TAGS (Directly above the 3 nodes) */}
        <div
          className="mb-5 rounded-xl p-3 sm:p-4 backdrop-blur-md"
          style={{
            background: "linear-gradient(to bottom, rgba(23,22,20,0.95) 0%, rgba(23,22,20,0.85) 100%)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.35)",
          }}
        >
          {/* Top row: All (13), Education (7), Career (2), Personal Projects (4) */}
          <div className="flex flex-nowrap md:flex-wrap items-center gap-2 sm:gap-3 overflow-x-auto custom-scroll pb-1">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              const count =
                cat.id === "all"
                  ? PROJECTS.length
                  : PROJECTS.filter((p) => p.section === cat.id).length;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleSelectCategory(cat.id)}
                  className={`category-tab-btn ${isActive ? "category-tab-btn-active" : "category-tab-btn-inactive"} shrink-0`}
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.85rem",
                    padding: "0.45rem 1rem",
                    borderRadius: "6px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: "pointer",
                    position: "relative",
                    userSelect: "none",
                  }}
                >
                  <span style={{ fontWeight: isActive ? 600 : 400, color: isActive ? "#f4f1eb" : "#a39d94" }}>
                    {cat.label}
                  </span>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      padding: "0.1rem 0.45rem",
                      borderRadius: "9999px",
                      background: isActive ? "rgba(221, 169, 87, 0.2)" : "rgba(255, 255, 255, 0.06)",
                      color: isActive ? "#dda957" : "#787268",
                      fontWeight: 500,
                    }}
                  >
                    {count}
                  </span>

                  {isActive && (
                    <span
                      style={{
                        position: "absolute",
                        bottom: "-1px",
                        left: "10%",
                        right: "10%",
                        height: "2px",
                        background: "#dda957",
                        borderRadius: "9999px",
                        boxShadow: "0 0 8px #dda957",
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom row: FILTER: [ ✦ All ] [ Project Tags ... ] */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-3 pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <span style={{ fontFamily: "var(--font-body)", color: "#8a847b", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.14em", marginRight: "4px" }}>
              Filter:
            </span>

            {/* All tag pill */}
            <button
              type="button"
              onClick={() => handleTagClick(null)}
              className={`tag-pill ${selectedTag === null ? "tag-pill-active" : ""}`}
              title={activeCategory === "all" ? "Show all projects" : `Show all ${activeCategory} projects`}
            >
              <span>✦ All</span>
              <span style={{ opacity: 0.7, fontSize: "0.68rem" }}>
                ({activeCategory === "all" ? PROJECTS.length : PROJECTS.filter((p) => p.section === activeCategory).length})
              </span>
            </button>

            {/* Project pills */}
            {(activeCategory === "all"
              ? PROJECTS
              : PROJECTS.filter((p) => p.section === activeCategory)
            ).map((project) => (
              <button
                key={project.title}
                type="button"
                onClick={() => handleTagClick(project.title, project.section)}
                className={`tag-pill ${selectedTag === project.title ? "tag-pill-active" : ""}`}
                title={`Filter by: ${project.title}`}
              >
                {project.title}
              </button>
            ))}
          </div>
        </div>

        {/* 2. THE 3 NODES (Education, Career, Personal Projects) as they were before */}
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
                  className={`category-card snap-center shrink-0 md:shrink`}
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
                    boxShadow: isNodeActive ? `0 0 24px rgba(221, 169, 87, 0.24), 0 8px 30px rgba(0,0,0,0.4)` : "none",
                    opacity: activeCategory === "all" ? 0.9 : isNodeActive ? 1 : 0.65,
                    transition: "border 0.25s, opacity 0.25s, box-shadow 0.25s, flex-grow 0.2s ease-out",
                  }}
                  onMouseEnter={(e) => {
                    if (!isNodeActive) {
                      e.currentTarget.style.borderColor = "rgba(221, 169, 87, 0.45)";
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
                  {/* Selected outline indicator */}
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
                      color: isNodeActive ? "#dda957" : "#787268",
                      background: isNodeActive ? "rgba(221, 169, 87, 0.16)" : "rgba(0,0,0,0.3)",
                      border: isNodeActive ? "1px solid rgba(221, 169, 87, 0.3)" : "1px solid transparent",
                      padding: "0.15rem 0.55rem",
                      borderRadius: "9999px",
                      fontWeight: 500,
                      transition: "all 0.25s",
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
                      gap: "6px",
                      transition: "opacity 0.15s",
                      overflowY: "auto",
                      overflowX: "hidden",
                      maxHeight: "135px",
                      paddingRight: "2px",
                    }}
                  >
                    {p.projects.map((project) => {
                      const isTagActive = selectedTag === project.title;
                      return (
                        <button
                          key={project.title}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTagClick(project.title, p.label);
                          }}
                          className={`tag-pill ${isTagActive ? "tag-pill-active" : ""}`}
                          style={{
                            background: isTagActive ? "#dda957" : p.chip,
                            borderColor: isTagActive ? "#dda957" : p.border,
                            color: isTagActive ? "#171614" : p.accent,
                          }}
                          title={`Filter by: ${project.title}`}
                        >
                          <span>{project.title}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. PROJECT CARDS IN NATURAL PAGE FLOW */}
        <div ref={projectsListRef} style={{ paddingTop: "1.75rem", paddingBottom: "2rem" }}>
          {/* Active filter status badge */}
          {renderedTag && (
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 px-1">
              <div className="flex items-center gap-2.5">
                <span style={{ fontFamily: "var(--font-body)", color: "#a39d94", fontSize: "0.72rem", letterSpacing: "0.14em", textTransform: "uppercase" }}>
                  Filtered by:
                </span>
                <div
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium"
                  style={{ background: "rgba(221, 169, 87, 0.15)", border: "1px solid #dda957", color: "#dda957" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#dda957" }} />
                  <span>{renderedTag}</span>
                  <button
                    type="button"
                    onClick={() => handleTagClick(null)}
                    title="Clear filter (Show all)"
                    className="ml-1 hover:text-white transition-colors cursor-pointer"
                    aria-label="Clear filter"
                  >
                    ✕
                  </button>
                </div>
                <span style={{ fontFamily: "var(--font-body)", color: "#787268", fontSize: "0.75rem" }}>
                  ({displayedProjects.length} {displayedProjects.length === 1 ? "project" : "projects"})
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleTagClick(null)}
                className="cursor-pointer text-xs transition-colors flex items-center gap-1.5"
                style={{ fontFamily: "var(--font-body)", color: "#dda957", textDecoration: "underline", textUnderlineOffset: "4px" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#f4f1eb")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#dda957")}
              >
                <span>Show all {renderedCategory === "all" ? "Projects" : renderedCategory}</span>
                <span>↗</span>
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {displayedProjects.map((project, idx) => {
              const isCardSelected = selectedTag === project.title;
              const accentColor = SECTION_ACCENTS[project.section] || "#dda957";

              return (
                <div
                  key={`${renderedCategory}-${project.title}`}
                  className={`group project-card ${isExiting ? "project-card-exit" : "project-card-enter"}`}
                  style={{
                    animationDelay: isExiting ? "0ms" : `${idx * 40}ms`,
                    background: "rgba(23, 22, 20, 0.72)",
                    border: `1px solid ${isCardSelected ? "#dda957" : "rgba(255, 255, 255, 0.1)"}`,
                    borderRadius: "10px",
                    padding: "1.75rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    backdropFilter: "blur(14px)",
                    boxShadow: isCardSelected
                      ? "0 10px 32px rgba(0,0,0,0.45), 0 0 20px rgba(221,169,87,0.28)"
                      : "0 6px 24px rgba(0,0,0,0.32)",
                    transition: "border 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#dda957";
                    e.currentTarget.style.boxShadow = `0 12px 36px rgba(0,0,0,0.5), 0 0 18px ${accentColor}30`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = isCardSelected ? "#dda957" : "rgba(255, 255, 255, 0.1)";
                    e.currentTarget.style.boxShadow = isCardSelected
                      ? "0 10px 32px rgba(0,0,0,0.45), 0 0 20px rgba(221,169,87,0.28)"
                      : "0 6px 24px rgba(0,0,0,0.32)";
                  }}
                >
                  <div className="flex flex-col">
                    {/* 1. CATEGORY */}
                    <div className="flex items-center justify-between gap-2 mb-3">
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

                    {/* 2. TITLE */}
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 600,
                        color: "#f4f1eb",
                        fontSize: "1.45rem",
                        lineHeight: 1.3,
                        marginBottom: "1rem",
                      }}
                    >
                      {project.title}
                    </h3>

                    {/* 3. PICTURE CAROUSEL */}
                    <ImageCarousel images={project.images} alt={project.title} />

                    {/* 4. DESCRIPTION */}
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontWeight: 300,
                        color: "#b8b2a7",
                        fontSize: "0.92rem",
                        lineHeight: 1.75,
                        marginBottom: "1.25rem",
                      }}
                    >
                      {project.description}
                    </p>
                  </div>

                  {/* 5. TAGS */}
                  <div
                    className="flex flex-wrap gap-2 mt-auto pt-3"
                    style={{ borderTop: "1px solid rgba(255, 255, 255, 0.06)" }}
                  >
                    {project.tags.map((tag) => {
                      const isTagActive = selectedTag === tag;
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTagClick(tag, project.section);
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
                          onMouseEnter={(e) => {
                            if (!isTagActive) {
                              e.currentTarget.style.borderColor = "#dda957";
                              e.currentTarget.style.color = "#f4f1eb";
                              e.currentTarget.style.background = "rgba(221,169,87,0.12)";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isTagActive) {
                              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                              e.currentTarget.style.color = "#a39d94";
                              e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                            }
                          }}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
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
