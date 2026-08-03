const fs = require('fs');
const path = require('path');

const winesDir = path.join(__dirname, 'content', 'wines');
const outputFile = path.join(__dirname, 'wines.json');

if (!fs.existsSync(winesDir)) {
  fs.writeFileSync(outputFile, JSON.stringify([]));
  process.exit(0);
}

const files = fs.readdirSync(winesDir).filter(f => f.endsWith('.md'));
const wines = files.map(file => {
  const content = fs.readFileSync(path.join(winesDir, file), 'utf8');
  return parseFrontmatter(content);
});

fs.writeFileSync(outputFile, JSON.stringify(wines, null, 2));

function parseFrontmatter(md) {
  const result = { title: '', price: '', image: '', notes: '', type: '', region: '' };
  const match = md.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  if (match) {
    const fm = match[1];
    const body = match[2].trim();
    fm.split('\n').forEach(line => {
      const [key, ...val] = line.split(':');
      if (key && val.length) {
        const value = val.join(':').trim().replace(/^["']|["']$/g, '');
        if (key.trim() === 'title') result.title = value;
        else if (key.trim() === 'price') result.price = value;
        else if (key.trim() === 'image') result.image = value;
        else if (key.trim() === 'type') result.type = value;
        else if (key.trim() === 'region') result.region = value;
      }
    });
    result.notes = body.replace(/[#*_]/g, '').substring(0, 200);
  }
  return result;
}
