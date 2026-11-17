import fs from "fs";

// Load projects_portfolio.csv and parse it to see exactly what we're working with
const csv = fs.readFileSync("src/data/projects_portfolio.csv", "utf8").replace(/^\uFEFF/, "");

function parseCSV(text) {
  const rows = [];
  let currentRow = [];
  let currentValue = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      if (inQuotes && text[i + 1] === '"') {
        currentValue += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      currentRow.push(currentValue);
      currentValue = "";
    } else if ((char === "\r" || char === "\n") && !inQuotes) {
      if (char === "\r" && text[i + 1] === "\n") i++;
      currentRow.push(currentValue);
      if (currentRow.length > 1 || currentRow[0] !== "") {
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

const rows = parseCSV(csv);
const header = rows[0];
console.log("Headers:", header);

const projects = rows.slice(1).map(r => ({
  title: r[0],
  section: r[1],
  shortDesc: r[2],
  desc: r[3],
  tags: r[4] ? r[4].split(";").map(t => t.trim()).filter(Boolean) : [],
  image: r[5],
  period: r[6],
  longDescription: r[7]
}));

console.log("Total projects:", projects.length);
projects.forEach((p, idx) => {
  console.log(`${idx + 1}. [${p.section}] ${p.title} (longDesc len: ${p.longDescription ? p.longDescription.length : 0})`);
});
