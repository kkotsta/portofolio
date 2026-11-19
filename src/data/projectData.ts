// ─── SHARED PROJECT DATA & TYPES ──────────────────────────────────────────────
// imported by App.tsx and all layout pages

import projectsCsv from "@/data/projects_portfolio.csv?raw";
import softwareCsv from "@/data/software_tools.csv?raw";

export type ProjectSection = "Education" | "Career" | "Personal Projects";

export type Project = {
  title: string;
  section: ProjectSection;
  period: string;
  shortDescription: string;
  description: string;
  tags: string[];
  images: string[];
  longDescription: string;
};

export const ME = {
  name: "Kit Kother",
  tagline: "I engineer things, then make them feel right.",
  bio: "MSc student in Integrated Product Design at TU Delft. Background in mechanical engineering. I work at the intersection of how things function and how they should feel to use — currently applying that at Ampelmann, analysing the feasibility of future offshore access operations.",
  email: "kitkother@gmail.com",
  links: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/kit-kother/" },
    { label: "GitHub", href: "https://github.com/kkotsta" },
  ],
};

function resolveImagePath(raw: string): string {
  const s = raw.trim();
  if (!s) return "";
  if (s.startsWith("http://") || s.startsWith("https://") || s.startsWith("/") || s.startsWith("data:")) return s;
  return `/images/${s}`;
}

const DEFAULT_PROJECT_IMAGES: Record<string, string[]> = {
  "Research through Design (RtD)": ["/images/rtd-1.png"],
  "Klimmende Stapelaar": ["/images/stapelaar1.png", "/images/stapelaar-1.jpg", "/images/stapelaar-2.jpg"],
  "Custom Mini Vehicle": ["/images/car.png", "/images/Self_stopping_car.jpeg", "/images/car_launch.jpeg", "/images/launch_actual.jpeg"],
  "Direct Air Carbon Capture Paper": ["https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1200&q=80"],
  "Mini CNC Machine": ["/images/cnc.jpg"],
  "Baxter Roll": ["/images/Baxter_render.jpeg", "/images/Baxter_SW.jpeg"],
  "Hyperion Lyceum": ["https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80"],
  "IDE Business Fair": ["https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80"],
  "Offshore Workability Analysis": ["https://images.unsplash.com/photo-1505705694340-019e1e335916?auto=format&fit=crop&w=1200&q=80"],
  "High School STEM Tutoring": ["https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80"],
  "Platenmeubel (Vinyl Cabinet)": [
    "/images/Meubel1.jpeg",
    "/images/meubel2.jpeg",
    "/images/meubel3.jpeg",
    "/images/meubel4.jpeg",
  ],
  "Ergonomic Laptop Stand": ["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80"],
  "Photography": ["/images/photography-1.jpg", "/images/photography-2.jpg"],
  "Writing & Production": ["https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80"],
  "EasyTabMaker": ["/images/easytabmaker.png"],
};

function parseCSV(text: string): string[][] {
  const clean = text.replace(/^\uFEFF/, "");
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentValue = "";
  let inQuotes = false;
  for (let i = 0; i < clean.length; i += 1) {
    const char = clean[i];
    if (char === '"') {
      if (inQuotes && clean[i + 1] === '"') { currentValue += '"'; i += 1; }
      else { inQuotes = !inQuotes; }
    } else if (char === "," && !inQuotes) {
      currentRow.push(currentValue); currentValue = "";
    } else if ((char === "\r" || char === "\n") && !inQuotes) {
      if (char === "\r" && clean[i + 1] === "\n") i += 1;
      currentRow.push(currentValue);
      if (currentRow.length > 1 || (currentRow.length === 1 && currentRow[0] !== "")) rows.push(currentRow);
      currentRow = []; currentValue = "";
    } else { currentValue += char; }
  }
  if (currentValue !== "" || currentRow.length > 0) { currentRow.push(currentValue); rows.push(currentRow); }
  return rows;
}

const parsedCsvRows = parseCSV(projectsCsv).slice(1);

export const PROJECTS: Project[] = parsedCsvRows.map((row) => {
  const [title, section, shortDescription, description, tags, image, period, longDescription] = row;
  const parsedImages = image ? image.split(",").map((s) => resolveImagePath(s)).filter(Boolean) : [];
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

const parsedSoftwareRows = parseCSV(softwareCsv).slice(1);

export type SoftwareTool = {
  name: string;
  category: string;
  proficiency: string;
  description: string;
};

export const SOFTWARE_TOOLS: SoftwareTool[] = parsedSoftwareRows.map((row) => ({
  name: (row[0] || "").trim(),
  category: (row[1] || "").trim(),
  proficiency: (row[2] || "").trim(),
  description: (row[3] || "").trim(),
}));
