import fs from "fs";

let code = fs.readFileSync("src/App.tsx", "utf8");

// 1. In grid container: remove items-start so grid items stretch equally to the same height in each row
code = code.replace(
  '<div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-start">',
  '<div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">'
);

// 2. In normal card view:
// We want all normal cards to have a consistent height, with title and period heights aligned,
// description having a consistent minimum/clamped line height or min-height,
// and the tags + "Read more" pinned to the bottom.

const oldNormalCardPattern = `{/* Normal Card View */}
                  {!isExpanded && (
                    <>
                      <div className="flex flex-col">
                        {/* CATEGORY & SHORT DESCRIPTION */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span
                            style={{
                              fontFamily: "var(--font-body)",
                              fontSize: "0.7rem",
                              fontWeight: 600,
                              letterSpacing: "0.1em",
                              textTransform: "uppercase",
                              color: accentColor,
                              background: \\\`\\\${accentColor}18\\\`,
                              border: \\\`1px solid \\\${accentColor}40\\\`,
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

                        {/* TITLE */}
                        <h3
                          style={{
                            fontFamily: "var(--font-display)",
                            fontWeight: 600,
                            color: "#f4f1eb",
                            fontSize: "1.45rem",
                            lineHeight: 1.3,
                            marginBottom: "0.5rem",
                          }}
                        >
                          {project.title}
                        </h3>

                        {/* PERIOD */}
                        {project.period && (
                          <span
                            style={{
                              fontFamily: "var(--font-body)",
                              fontSize: "0.75rem",
                              color: "#a39d94",
                              letterSpacing: "0.04em",
                              display: "block",
                              marginBottom: "1rem",
                            }}
                          >
                            {project.period}
                          </span>
                        )}

                        {/* PICTURE CAROUSEL */}
                        <ImageCarousel images={project.images} alt={project.title} />

                        {/* SHORT/SUMMARY DESCRIPTION */}
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

                      {/* TAGS & READ MORE ACTION */}
                      <div className="mt-auto">
                        <div
                          className="flex flex-wrap gap-2 pt-3 mb-4"
                          style={{ borderTop: "1px solid rgba(255, 255, 255, 0.06)" }}
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
                                title={\\\`Filter by tag: \\\${tag}\\\`}
                                className="tag-pill"
                                style={{
                                  fontFamily: "var(--font-body)",
                                  fontSize: "0.72rem",
                                  color: isTagActive ? "#171614" : "#a39d94",
                                  border: \\\`1px solid \\\${isTagActive ? "#dda957" : "rgba(255,255,255,0.08)"}\\\`,
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
                    </>
                  )}`;

console.log("Check index of oldNormalCardPattern in file:", code.indexOf("{/* Normal Card View */}"));
