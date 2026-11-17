import fs from "fs";

let code = fs.readFileSync("src/App.tsx", "utf8");

// Change grid container
code = code.replace(
  '<div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-start">',
  '<div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">'
);

// Find from `{/* Normal Card View */}` to `{/* Expanded Card View`
const startIdx = code.indexOf("{/* Normal Card View */}");
const endIdx = code.indexOf("{/* Expanded Card View (Twice as wide & twice as tall with longDescription) */}");

const newNormalCard = `{/* Normal Card View */}
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
                              background: \`\${accentColor}18\`,
                              border: \`1px solid \${accentColor}40\`,
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
                                title={\`Filter by tag: \${tag}\`}
                                className="tag-pill"
                                style={{
                                  fontFamily: "var(--font-body)",
                                  fontSize: "0.72rem",
                                  color: isTagActive ? "#171614" : "#a39d94",
                                  border: \`1px solid \${isTagActive ? "#dda957" : "rgba(255,255,255,0.08)"}\`,
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

                  `;

code = code.slice(0, startIdx) + newNormalCard + code.slice(endIdx);

fs.writeFileSync("src/App.tsx", code, "utf8");
console.log("Successfully updated src/App.tsx with uniform node sizes!");
