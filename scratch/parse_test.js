const fs = require('fs');
let text = fs.readFileSync('src/data/projects_portfolio.csv', 'utf8').replace(/^\uFEFF/, '');

function parseCSV(input) {
  const rows = [];
  let row = [];
  let cell = '';
  let inQuotes = false;
  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    if (c === '"') {
      if (inQuotes && input[i + 1] === '"') {
        cell += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      row.push(cell.trim());
      cell = '';
    } else if ((c === '\r' || c === '\n') && !inQuotes) {
      if (c === '\r' && input[i + 1] === '\n') i++;
      row.push(cell.trim());
      cell = '';
      if (row.some(x => x.length > 0)) rows.push(row);
      row = [];
    } else {
      cell += c;
    }
  }
  if (cell.length > 0 || row.length > 0) {
    row.push(cell.trim());
    if (row.some(x => x.length > 0)) rows.push(row);
  }
  return rows;
}

const rows = parseCSV(text);
console.log('Header:', rows[0]);
console.log('Total data rows:', rows.length - 1);
for (let i = 1; i < rows.length; i++) {
  const r = rows[i];
  console.log(`${i}. Title: "${r[0]}", Section: "${r[1]}", Period: "${r[6]}", Img: "${r[5]}", LongDesc: ${r[7] ? r[7].length : 0} chars`);
}
