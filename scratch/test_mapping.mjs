import fs from 'fs';
const text = fs.readFileSync('src/data/projects_portfolio.csv', 'utf8');

function parseCSV(text) {
  const cleanText = text.replace(/^\uFEFF/, "");
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < cleanText.length; i++) {
    const c = cleanText[i];
    if (c === '"') {
      if (inQuotes && cleanText[i + 1] === '"') {
        cell += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === "," && !inQuotes) {
      row.push(cell.trim());
      cell = "";
    } else if ((c === "\r" || c === "\n") && !inQuotes) {
      if (c === "\r" && cleanText[i + 1] === "\n") i++;
      row.push(cell.trim());
      cell = "";
      if (row.some((x) => x.length > 0)) rows.push(row);
      row = [];
    } else {
      cell += c;
    }
  }
  if (cell.length > 0 || row.length > 0) {
    row.push(cell.trim());
    if (row.some((x) => x.length > 0)) rows.push(row);
  }
  return rows;
}

const parsed = parseCSV(text);
const rows = parsed.slice(1);
console.log('Parsed projects count:', rows.length);
rows.forEach((r, idx) => {
  const [title, section, shortDesc, desc, tags, image, period, longDesc] = r;
  console.log(`${idx + 1}. [${section}] ${title} (Period: "${period || 'none'}")`);
  console.log(`   Tags (${(tags||'').split(';').length}): ${tags}`);
  console.log(`   Image: ${image}`);
  console.log(`   LongDesc length: ${longDesc ? longDesc.length : 0}`);
});
