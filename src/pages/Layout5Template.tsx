import { useState, useRef, useEffect } from "react";
import { PROJECTS, SOFTWARE_TOOLS, ME, type Project, type ProjectSection } from "@/data/projectData";
import headshot from "@/imports/IMG_6839__1_.jpg";
import bgPhoto from "@/imports/bg.jpg";
import bg2Photo from "@/imports/bg2.jpg";
import bg3Photo from "@/imports/bg3.jpg";

export type VariantTheme = "5A" | "5B" | "5C" | "5C-Sticky" | "5D" | "5E" | "5F";

// 5F: one continuous background (hero bg.jpg + slate fade + bg2.jpg).
// Total height of the stacked background layer in px.
const F_HERO_H = 680;
const F_OVERLAP = 0;
const F_BG2_H = 1000;
const F_TOTAL_H = F_HERO_H - F_OVERLAP + F_BG2_H;

interface Layout5TemplateProps {
  variant: VariantTheme;
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

export default function Layout5Template({ variant }: Layout5TemplateProps) {
  const [activeCategory, setActiveCategory] = useState<"all" | ProjectSection>("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isFilterExpanded, setIsFilterExpanded] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Smooth direct DOM parallax ref (identical to original Hero)
  const heroBgRef = useRef<HTMLImageElement>(null);
  const secondBgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) return;

      const sy = window.scrollY;

      // 1. Hero background moves slightly down (subtle parallax like original)
      if (heroBgRef.current) {
        const heroOffset = Math.min(sy, window.innerHeight) * 0.18;
        heroBgRef.current.style.transform = `translate3d(0, ${heroOffset}px, 0)`;
      }

      // 2. Second background: moves down slower, then reaches its pinned resting state
      if (secondBgRef.current) {
        if (variant === "5C-Sticky") {
          // Slow parallax glide down before pinning
          // Moves at 0.35x scroll speed up to 260px, then softly holds
          const glide = Math.min(sy * 0.35, 260);
          secondBgRef.current.style.transform = `translate3d(0, ${glide}px, 0)`;
        } else if (variant === "5C") {
          // Continuous smooth slow drag
          const drag = sy * 0.15;
          secondBgRef.current.style.transform = `translate3d(0, ${drag}px, 0)`;
        }
      }
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
  }, [variant]);

  // Available tags in currently active category
  const relevantProjects = activeCategory === "all"
    ? PROJECTS
    : PROJECTS.filter((p) => p.section === activeCategory);

  const availableTags = Array.from(
    new Set(relevantProjects.flatMap((p) => p.tags))
  ).sort((a, b) => a.localeCompare(b));

  // Filter projects by category and selected tags
  const filtered = PROJECTS.filter((project) => {
    if (activeCategory !== "all" && project.section !== activeCategory) {
      return false;
    }
    if (selectedTags.length === 0) {
      return true;
    }
    return selectedTags.some((tag) => project.tags.includes(tag));
  });

  const handleSelectNode = (label: ProjectSection) => {
    if (activeCategory === label) {
      setActiveCategory("all");
    } else {
      setActiveCategory(label);
    }
  };

  const handleToggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleClearFilters = () => {
    setSelectedTags([]);
  };

  const isLight = variant === "5B" || variant === "5D";
  const isPhotoVariant = variant === "5C" || variant === "5C-Sticky" || variant === "5F";

  let containerStyle: React.CSSProperties = {
    minHeight: "100vh",
    position: "relative",
    fontFamily: "Inter, system-ui, sans-serif",
  };

  if (variant === "5A") {
    containerStyle = { ...containerStyle, background: "#111010", color: "#ececec" };
  } else if (variant === "5B") {
    containerStyle = { ...containerStyle, background: "#fcfbf9", color: "#1c1917" };
  } else if (isPhotoVariant) {
    containerStyle = { ...containerStyle, background: "#171614", color: "#f4f1eb" };
  } else if (variant === "5E") {
    containerStyle = { ...containerStyle, background: "#151311", color: "#f4f1eb" };
  } else if (variant === "5D") {
    containerStyle = {
      ...containerStyle,
      backgroundImage: "url('/images/white-pattern-background.jpg')",
      backgroundRepeat: "repeat",
      backgroundSize: "1400px auto",
      backgroundPosition: "top center",
      backgroundAttachment: "fixed",
      color: "#22201d",
    };
  }

  const primaryGold = isLight ? "#92400e" : "#dda957";
  const navBg = isLight
    ? "rgba(255,255,255,0.85)"
    : (isPhotoVariant || variant === "5E" ? "rgba(23, 22, 20, 0.75)" : "rgba(18, 17, 16, 0.85)");
  const navBorder = isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)";
  const cardBg = isLight
    ? (variant === "5D" ? "rgba(255,255,255,0.85)" : "#ffffff")
    : (isPhotoVariant || variant === "5E" ? "rgba(27, 25, 23, 0.84)" : "#181717");
  const cardBorder = isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)";
  const textColor = isLight ? "#1c1917" : "#f4f1eb";
  const mutedText = isLight ? "#6b7280" : "rgba(244,241,235,0.65)";
  const softwareBoxBg = isLight
    ? "rgba(255,255,255,0.8)"
    : (isPhotoVariant || variant === "5E" ? "rgba(24, 22, 20, 0.88)" : "rgba(24, 23, 23, 0.75)");

  return (
    <div style={containerStyle}>
      {/* ─────────────────────────────────────────────────────────────
          5C & 5C-STICKY BACKGROUNDS
          Exact original dual-photo positioning & gradient fades:
          1. Hero sky bg.jpg
          2. Sunset-to-slate gradient (#495d70)
          3. Second photo bg2.jpg (with slow glide + stick behavior)
          4. Soft atmospheric fade into base (#171614)
         ───────────────────────────────────────────────────────────── */}
      {/* ─────────────────────────────────────────────────────────────
          5F: ONE CONTINUOUS STICKY BACKGROUND
          Hero photo + slate fade + bg2 are stacked in one layer that
          scrolls with the page until the bottom of bg2 meets the bottom
          of the viewport, then stays pinned (sticky with negative top).
          Negative marginBottom removes it from the flow so the nav and
          content sit on top of it. Pure CSS, no scroll JS.
         ───────────────────────────────────────────────────────────── */}
      {variant === "5F" && (
        <div
          aria-hidden="true"
          style={{
            position: "sticky",
            top: `min(0px, calc(100vh - ${F_TOTAL_H}px))`,
            height: `${F_TOTAL_H}px`,
            marginBottom: `-${F_TOTAL_H}px`,
            width: "100%",
            zIndex: 0,
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          {/* Hero photo */}
          <div style={{ position: "relative", width: "100%", height: `${F_HERO_H}px`, overflow: "hidden" }}>
            <img
              src={bgPhoto}
              alt=""
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center 40%",
                filter: "brightness(0.76) saturate(0.95)",
              }}
            />
            <div style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "48%",
              background: "linear-gradient(to bottom, transparent 0%, rgba(73,93,112,0.38) 58%, #495d70 100%)",
            }} />
          </div>

          {/* Second photo, overlapping the seam so the join is seamless */}
          <div style={{ position: "relative", width: "100%", height: `${F_BG2_H}px`, marginTop: `-${F_OVERLAP}px`, background: "#495d70" }}>
            <img
              src={bg2Photo}
              alt=""
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center bottom",
              }}
            />
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "360px",
              background: "linear-gradient(to bottom, #495d70 0%, rgba(73,93,112,0.6) 30%, rgba(73,93,112,0.2) 70%, transparent 100%)",
            }} />
          </div>
        </div>
      )}

      {(variant === "5C" || variant === "5C-Sticky") && (
        <div style={{ position: "absolute", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
          {/* Top Hero Landscape Photo (bg.jpg) */}
          <div style={{ position: "relative", width: "100%", height: "680px", overflow: "hidden" }}>
            <img
              ref={heroBgRef}
              src={bgPhoto}
              alt=""
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "120%",
                top: "-10%",
                objectFit: "cover",
                objectPosition: "center 40%",
                filter: "brightness(0.76) saturate(0.95)",
                willChange: "transform",
              }}
            />
            {/* Exact original sunset-to-slate blend gradient */}
            <div style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "48%",
              background: "linear-gradient(to bottom, transparent 0%, rgba(73,93,112,0.38) 58%, #495d70 100%)",
            }} />
          </div>

          {/* Second photo section container */}
          <div style={{ position: "relative", width: "100%", minHeight: "100%", marginTop: "-40px" }}>
            {/* Moving container: moves slower then stays positioned */}
            <div
              ref={secondBgRef}
              style={{
                position: "relative",
                width: "100%",
                height: variant === "5C-Sticky" ? "1200px" : "1800px",
                willChange: "transform",
              }}
            >
              <img
                src={bg2Photo}
                alt=""
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center 25%",
                  filter: "brightness(0.85) saturate(0.95)",
                }}
              />
              {/* Exact original top slate blend overlay */}
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "260px",
                background: "linear-gradient(to bottom, #495d70 0%, rgba(73,93,112,0.42) 40%, transparent 100%)",
              }} />
              {/* Long, gentle atmospheric fade into dark base */}
              <div style={{
                position: "absolute",
                top: "450px",
                left: 0,
                right: 0,
                bottom: 0,
                background: "linear-gradient(to bottom, transparent 0%, rgba(23,22,20,0.7) 400px, rgba(23,22,20,0.92) 800px, #171614 100%)",
              }} />
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          5E: BG3 BACKGROUND
          bg3.jpg as atmospheric background covering hero and softly fading down
         ───────────────────────────────────────────────────────────── */}
      {variant === "5E" && (
        <div style={{ position: "absolute", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
          {/* Top section with bg3.jpg */}
          <div style={{ position: "relative", width: "100%", height: "1100px", overflow: "hidden" }}>
            <img
              src={bg3Photo}
              alt=""
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center 30%",
                filter: "brightness(0.82) saturate(0.95)",
              }}
            />
            {/* Smooth sunset / atmospheric blend down into base */}
            <div style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "550px",
              background: "linear-gradient(to bottom, transparent 0%, rgba(21,19,17,0.4) 40%, rgba(21,19,17,0.85) 75%, #151311 100%)",
            }} />
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <nav style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: "blur(14px)",
        background: navBg,
        borderBottom: `1px solid ${navBorder}`,
        padding: "1rem 2.5rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ fontWeight: 800, fontSize: "1.1rem", letterSpacing: "0.08em", color: primaryGold }}>KIT KOTHER</span>
          <span style={{ fontSize: "0.8rem", color: mutedText, borderLeft: `1px solid ${navBorder}`, paddingLeft: "1rem" }}>
            Layout {variant}
          </span>
        </div>
        <div style={{ display: "flex", gap: "0.85rem", fontSize: "0.82rem", alignItems: "center", flexWrap: "wrap" }}>
          <a href="#/5a" style={{ color: variant === "5A" ? primaryGold : mutedText, textDecoration: "none", fontWeight: variant === "5A" ? 700 : 500 }}>5A (Dark)</a>
          <a href="#/5b" style={{ color: variant === "5B" ? primaryGold : mutedText, textDecoration: "none", fontWeight: variant === "5B" ? 700 : 500 }}>5B (Light)</a>
          <a href="#/5c" style={{ color: variant === "5C" ? primaryGold : mutedText, textDecoration: "none", fontWeight: variant === "5C" ? 700 : 500, padding: "2px 8px", borderRadius: "9999px", background: variant === "5C" ? "rgba(221,169,87,0.15)" : "transparent" }}>5C (Long Fade)</a>
          <a href="#/5c-sticky" style={{ color: variant === "5C-Sticky" ? primaryGold : mutedText, textDecoration: "none", fontWeight: variant === "5C-Sticky" ? 700 : 500, padding: "2px 8px", borderRadius: "9999px", background: variant === "5C-Sticky" ? "rgba(221,169,87,0.15)" : "transparent" }}>5C (Sticky Glide)</a>
          <a href="#/5d" style={{ color: variant === "5D" ? primaryGold : mutedText, textDecoration: "none", fontWeight: variant === "5D" ? 700 : 500 }}>5D (Paper)</a>
          <a href="#/5e" style={{ color: variant === "5E" ? primaryGold : mutedText, textDecoration: "none", fontWeight: variant === "5E" ? 700 : 500, padding: "2px 8px", borderRadius: "9999px", background: variant === "5E" ? "rgba(221,169,87,0.15)" : "transparent" }}>5E (bg3)</a>
          <a href="#/5f" style={{ color: variant === "5F" ? primaryGold : mutedText, textDecoration: "none", fontWeight: variant === "5F" ? 700 : 500, padding: "2px 8px", borderRadius: "9999px", background: variant === "5F" ? "rgba(221,169,87,0.15)" : "transparent" }}>5F (Pinned)</a>
        </div>
      </nav>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "3.5rem 2rem", position: "relative", zIndex: 1 }}>
        {/* HERO SECTION WITH HEADSHOT PHOTO */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 0.8fr",
          gap: "3rem",
          marginBottom: "3.5rem",
          alignItems: "center"
        }}>
          <div>
            <div style={{ color: primaryGold, textTransform: "uppercase", letterSpacing: "0.15em", fontSize: "0.75rem", fontWeight: 700, marginBottom: "0.75rem" }}>
              Delft, Netherlands · 2026
            </div>
            <h1 style={{ fontSize: "3.4rem", fontWeight: 800, lineHeight: 1.05, margin: "0 0 1rem", letterSpacing: "-0.03em", color: textColor, textShadow: isPhotoVariant ? "0 2px 20px rgba(0,0,0,0.5)" : "none" }}>
              Kit <span style={{ color: primaryGold }}>Kother</span>
            </h1>
            <p style={{ color: textColor, opacity: 0.9, fontSize: "1.15rem", fontWeight: 500, lineHeight: 1.5, margin: "0 0 1rem" }}>
              {ME.tagline}
            </p>
            <p style={{ color: mutedText, fontSize: "0.95rem", lineHeight: 1.7, margin: "0 0 1.75rem", maxWidth: "48ch" }}>
              {ME.bio}
            </p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <a href={`mailto:${ME.email}`} style={{
                background: primaryGold,
                color: isLight ? "#fff" : "#171614",
                padding: "0.65rem 1.4rem",
                borderRadius: "8px",
                fontWeight: 700,
                textDecoration: "none",
                fontSize: "0.88rem",
                boxShadow: isLight ? "0 2px 8px rgba(146,64,14,0.25)" : "none"
              }}>
                Contact Me
              </a>
              {ME.links.map(l => (
                <a key={l.label} href={l.href} target="_blank" rel="noreferrer" style={{
                  border: `1px solid ${cardBorder}`,
                  background: isLight ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.3)",
                  color: textColor,
                  padding: "0.65rem 1.2rem",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontSize: "0.88rem",
                  backdropFilter: "blur(6px)"
                }}>
                  {l.label} ↗
                </a>
              ))}
            </div>
          </div>

          {/* HEADSHOT FOTO */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{
              position: "relative",
              width: "100%",
              maxWidth: "340px",
              aspectRatio: "3/4",
              borderRadius: "18px",
              overflow: "hidden",
              boxShadow: isLight ? "0 20px 40px rgba(0,0,0,0.12)" : "0 24px 50px rgba(0,0,0,0.65)",
              border: `2px solid ${cardBorder}`
            }}>
              <img
                src={headshot}
                alt="Kit Kother"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div style={{
                position: "absolute",
                bottom: 0,
                insetInline: 0,
                padding: "1.25rem",
                background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)",
                color: "#fff",
              }}>
                <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>Kit Kother</div>
                <div style={{ fontSize: "0.8rem", color: "#dda957" }}>Integrated Product Design • TU Delft</div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── 3 CATEGORY NODES ─── */}
        <div style={{ marginBottom: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
            <span style={{ color: primaryGold, fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700 }}>
              Explore Categories
            </span>
            <span style={{ flex: 1, height: "1px", background: cardBorder }} />
            {activeCategory !== "all" && (
              <button
                onClick={() => setActiveCategory("all")}
                style={{
                  background: "transparent",
                  border: "none",
                  color: primaryGold,
                  fontSize: "0.75rem",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Reset to All ({PROJECTS.length})
              </button>
            )}
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1rem",
          }}>
            {PANEL_STYLES.map((p) => {
              const isNodeActive = activeCategory === p.label;
              return (
                <div
                  key={p.id}
                  onClick={() => handleSelectNode(p.label)}
                  style={{
                    background: p.bg,
                    border: isNodeActive ? `2px solid ${p.accent}` : `1px solid ${p.border}`,
                    borderRadius: "14px",
                    padding: "1.1rem 1.25rem",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    position: "relative",
                    boxShadow: isNodeActive ? `0 0 25px ${p.accent}44, 0 8px 24px rgba(0,0,0,0.3)` : "none",
                    opacity: activeCategory === "all" ? 1 : isNodeActive ? 1 : 0.65,
                    backdropFilter: "blur(10px)",
                    transition: "border 0.25s, opacity 0.25s, box-shadow 0.25s, transform 0.25s",
                    transform: isNodeActive ? "translateY(-3px)" : "none",
                    minHeight: "185px",
                  }}
                  onMouseEnter={(e) => {
                    if (!isNodeActive) {
                      e.currentTarget.style.borderColor = p.accent;
                      e.currentTarget.style.opacity = "0.95";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isNodeActive) {
                      e.currentTarget.style.borderColor = p.border;
                      e.currentTarget.style.opacity = activeCategory === "all" ? "1" : "0.65";
                    }
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.85rem" }}>
                    <div style={{ fontWeight: 700, fontSize: "1.2rem", color: isNodeActive ? "#f4f1eb" : "#d6d3d1" }}>
                      {p.label}
                    </div>
                    <span style={{
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      color: p.accent,
                      background: isNodeActive ? `${p.accent}33` : "rgba(0,0,0,0.3)",
                      border: `1px solid ${p.accent}55`,
                      padding: "2px 8px",
                      borderRadius: "9999px"
                    }}>
                      {p.projects.length}
                    </span>
                  </div>

                  {/* Subtopic tags inside nodes */}
                  <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignContent: "flex-start",
                    gap: "6px",
                    overflow: "hidden",
                  }}>
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
                          style={{
                            background: isTagActive ? p.accent : p.chip,
                            border: `1px solid ${isTagActive ? p.accent : p.border}`,
                            color: isTagActive ? "#171614" : p.accent,
                            fontWeight: isTagActive ? 700 : 500,
                            padding: "3px 8px",
                            borderRadius: "9999px",
                            fontSize: "0.72rem",
                            cursor: "pointer",
                            transition: "all 0.15s ease",
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

        {/* ─── FILTER BUTTON & MULTI-SELECT EXPANDER BAR ─── */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{
            background: "rgba(23, 22, 20, 0.9)",
            border: selectedTags.length > 0 ? `1px solid ${primaryGold}` : `1px solid ${cardBorder}`,
            borderRadius: "12px",
            padding: "0.85rem 1.25rem",
            backdropFilter: "blur(12px)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button
                type="button"
                onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: isFilterExpanded || selectedTags.length > 0 ? primaryGold : textColor,
                  fontWeight: 600,
                  fontSize: "0.88rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <span
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: `${primaryGold}22`,
                    border: `1px solid ${primaryGold}44`,
                    color: primaryGold,
                    transition: "transform 0.25s ease, background 0.2s",
                    transform: isFilterExpanded ? "rotate(180deg) scale(1.05)" : "rotate(0deg) scale(1)",
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                  </svg>
                </span>
                <span style={{ fontWeight: 600, letterSpacing: "0.01em" }}>
                  {isFilterExpanded ? "Hide Filters" : "Filter Options"}
                </span>
                <span style={{ fontSize: "0.75rem", color: mutedText, fontWeight: 400 }}>
                  ({isFilterExpanded ? "Click to collapse" : "Click to expand & multi-select"})
                </span>
                {selectedTags.length > 0 && (
                  <span style={{
                    background: `${primaryGold}33`,
                    border: `1px solid ${primaryGold}`,
                    color: primaryGold,
                    fontSize: "0.7rem",
                    padding: "1px 8px",
                    borderRadius: "9999px",
                    fontWeight: 700
                  }}>
                    {selectedTags.length} active
                  </span>
                )}
              </button>

              {selectedTags.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  style={{
                    background: "rgba(221, 169, 87, 0.15)",
                    border: `1px solid ${primaryGold}`,
                    color: primaryGold,
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    padding: "3px 10px",
                    borderRadius: "6px",
                    cursor: "pointer"
                  }}
                >
                  Clear all ({selectedTags.length}) ✕
                </button>
              )}
            </div>

            {/* EXPANDED FILTER CHIPS */}
            {isFilterExpanded && (
              <div style={{ marginTop: "1rem", paddingTop: "0.85rem", borderTop: `1px solid ${cardBorder}` }}>
                <div style={{ fontSize: "0.72rem", color: mutedText, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.75rem" }}>
                  Select one or more topics / tags to combine:
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {availableTags.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleToggleTag(tag)}
                        style={{
                          background: isSelected ? primaryGold : "rgba(255,255,255,0.06)",
                          border: isSelected ? `1px solid ${primaryGold}` : `1px solid ${cardBorder}`,
                          color: isSelected ? "#171614" : textColor,
                          fontWeight: isSelected ? 700 : 500,
                          fontSize: "0.78rem",
                          padding: "4px 10px",
                          borderRadius: "9999px",
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                        }}
                      >
                        {tag} {isSelected && "✓"}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CASE STUDY CARDS GRID */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "2rem", marginBottom: "5rem" }}>
          {filtered.map((proj) => (
            <div
              key={proj.title}
              onClick={() => setSelectedProject(proj)}
              style={{
                background: cardBg,
                border: `1px solid ${cardBorder}`,
                borderRadius: "16px",
                overflow: "hidden",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                backdropFilter: isPhotoVariant || variant === "5D" ? "blur(10px)" : "none",
                boxShadow: isLight ? "0 4px 16px rgba(0,0,0,0.06)" : "0 10px 25px rgba(0,0,0,0.35)",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.borderColor = primaryGold;
                e.currentTarget.style.boxShadow = isLight ? "0 12px 28px rgba(0,0,0,0.12)" : "0 16px 36px rgba(0,0,0,0.55)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.borderColor = cardBorder;
                e.currentTarget.style.boxShadow = isLight ? "0 4px 16px rgba(0,0,0,0.06)" : "0 10px 25px rgba(0,0,0,0.35)";
              }}
            >
              <div style={{ aspectRatio: "16/10", overflow: "hidden", background: isLight ? "#e5e5e5" : "#0c0c0c", position: "relative" }}>
                {proj.images[0] ? (
                  <>
                    {/* Blurred fill so the full photo can be shown without hard cropping */}
                    <img
                      src={proj.images[0]}
                      alt=""
                      aria-hidden="true"
                      style={{ position: "absolute", inset: "-24px", width: "calc(100% + 48px)", height: "calc(100% + 48px)", objectFit: "cover", filter: "blur(22px) brightness(0.55) saturate(1.1)" }}
                    />
                    <img
                      src={proj.images[0]}
                      alt={proj.title}
                      style={{ position: "relative", display: "block", width: "100%", height: "100%", objectFit: "contain" }}
                    />
                  </>
                ) : (
                  <div style={{ display: "flex", height: "100%", alignItems: "center", justifyContent: "center", color: mutedText }}>No image available</div>
                )}
                <span style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  background: isLight ? "rgba(255,255,255,0.92)" : "rgba(0,0,0,0.75)",
                  backdropFilter: "blur(4px)",
                  padding: "4px 10px",
                  borderRadius: "9999px",
                  fontSize: "0.72rem",
                  color: primaryGold,
                  fontWeight: 600,
                  border: `1px solid ${cardBorder}`
                }}>
                  {proj.section}
                </span>
              </div>

              <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <h3 style={{ margin: "0 0 0.5rem", fontSize: "1.25rem", fontWeight: 700, color: textColor }}>
                    {proj.title}
                  </h3>
                  <p style={{ color: mutedText, fontSize: "0.88rem", lineHeight: 1.55, margin: 0 }}>
                    {proj.shortDescription || proj.description}
                  </p>
                </div>

                <div style={{ marginTop: "1.25rem", paddingTop: "1rem", borderTop: `1px solid ${cardBorder}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                    {proj.tags.slice(0, 3).map((t) => (
                      <span key={t} style={{
                        background: isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.06)",
                        color: mutedText,
                        padding: "2px 7px",
                        borderRadius: "4px",
                        fontSize: "0.72rem"
                      }}>
                        {t}
                      </span>
                    ))}
                  </div>
                  <span style={{ color: primaryGold, fontSize: "0.82rem", fontWeight: 600 }}>Read more →</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* SOFTWARE & CAD TOOLS AT BOTTOM */}
        <div style={{
          background: softwareBoxBg,
          border: `1px solid ${cardBorder}`,
          backdropFilter: "blur(14px)",
          borderRadius: "20px",
          padding: "2.5rem",
          boxShadow: isLight ? "0 10px 30px rgba(0,0,0,0.05)" : "0 15px 35px rgba(0,0,0,0.3)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <div style={{ color: primaryGold, textTransform: "uppercase", letterSpacing: "0.15em", fontSize: "0.72rem", fontWeight: 700 }}>
                Proficiencies & Skills
              </div>
              <h2 style={{ fontSize: "1.8rem", fontWeight: 800, margin: "0.3rem 0 0", color: textColor }}>
                Software & CAD Stack
              </h2>
            </div>
            <p style={{ color: mutedText, fontSize: "0.88rem", margin: 0 }}>
              Loaded from <code style={{ fontSize: "0.8rem", background: isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.1)", padding: "2px 6px", borderRadius: "4px" }}>software_tools.csv</code>
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1rem" }}>
            {SOFTWARE_TOOLS.map((tool) => (
              <div
                key={tool.name}
                style={{
                  background: isLight ? "#ffffff" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${cardBorder}`,
                  borderRadius: "12px",
                  padding: "1rem 1.25rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 700, fontSize: "0.95rem", color: textColor }}>{tool.name}</span>
                  <span style={{
                    fontSize: "0.68rem",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    background: isLight ? "rgba(146,64,14,0.1)" : "rgba(221, 169, 87, 0.15)",
                    color: primaryGold,
                    padding: "2px 7px",
                    borderRadius: "4px"
                  }}>
                    {tool.proficiency || tool.category}
                  </span>
                </div>
                <div style={{ fontSize: "0.78rem", color: mutedText }}>{tool.category}</div>
                {tool.description && (
                  <div style={{ fontSize: "0.75rem", color: mutedText, marginTop: "4px", lineHeight: 1.4 }}>
                    {tool.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DETAIL MODAL OVERLAY */}
      {selectedProject && (
        <div onClick={() => setSelectedProject(null)} style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.8)",
          backdropFilter: "blur(6px)",
          zIndex: 120,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem"
        }}>
          <div onClick={(e) => e.stopPropagation()} style={{
            background: isLight ? "#ffffff" : "#181717",
            border: `1px solid ${cardBorder}`,
            color: textColor,
            borderRadius: "18px",
            maxWidth: "800px",
            width: "100%",
            maxHeight: "88vh",
            overflowY: "auto",
            padding: "2.5rem",
            boxShadow: "0 25px 60px rgba(0,0,0,0.6)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.15em", color: primaryGold, fontWeight: 700 }}>
                {selectedProject.section} {selectedProject.period && `• ${selectedProject.period}`}
              </span>
              <button onClick={() => setSelectedProject(null)} style={{ background: "none", border: "none", color: mutedText, fontSize: "1.5rem", cursor: "pointer" }}>✕</button>
            </div>

            <h2 style={{ fontSize: "2rem", fontWeight: 800, margin: "0 0 1rem", color: textColor }}>{selectedProject.title}</h2>

            {selectedProject.images.length > 0 && (
              <div style={{ marginBottom: "1.5rem" }}>
                <img src={selectedProject.images[0]} alt={selectedProject.title} style={{ display: "block", width: "100%", height: "400px", objectFit: "contain", borderRadius: "10px", background: isLight ? "#f1f1f1" : "#0c0c0c" }} />
                {selectedProject.images.length > 1 && (
                  <div style={{ display: "flex", gap: "8px", marginTop: "8px", overflowX: "auto" }}>
                    {selectedProject.images.map((img, i) => (
                      <img key={i} src={img} alt="" style={{ height: "65px", width: "95px", objectFit: "cover", borderRadius: "6px" }} />
                    ))}
                  </div>
                )}
              </div>
            )}

            <p style={{ color: isLight ? "#374151" : "#d1d1d1", lineHeight: 1.8, fontSize: "0.95rem", whiteSpace: "pre-wrap" }}>
              {selectedProject.longDescription || selectedProject.description}
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "1.5rem" }}>
              {selectedProject.tags.map((t) => (
                <span key={t} style={{
                  background: isLight ? "rgba(146,64,14,0.12)" : "rgba(221, 169, 87, 0.15)",
                  color: primaryGold,
                  padding: "4px 10px",
                  borderRadius: "6px",
                  fontSize: "0.78rem"
                }}>
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
