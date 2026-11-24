#!/usr/bin/env node
// Builds a static article site from posts/*.md. No third-party dependencies.
// Every markdown link in a post becomes a real, clickable <a href="...">.

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const postsDir = path.join(root, 'posts');
const siteDir = path.join(root, 'site');

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function inline(text) {
  let out = escapeHtml(text);
  out = out.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (_m, label, url) => {
    const safeUrl = escapeHtml(url);
    return `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer">${label}</a>`;
  });
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  return out;
}

function renderMarkdown(markdown) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const html = [];
  let paragraph = [];

  const flush = () => {
    if (paragraph.length) {
      html.push(`<p>${inline(paragraph.join(' '))}</p>`);
      paragraph = [];
    }
  };

  const isTableRow = (line) => line.startsWith('|') && line.endsWith('|');
  const isSeparator = (line) => /^\|[\s:|-]+\|$/.test(line);
  const cells = (line) => line.slice(1, -1).split('|').map((cell) => cell.trim());

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i].trim();
    if (!line) {
      flush();
      continue;
    }
    if (line === '---') {
      flush();
      html.push('<hr>');
      continue;
    }
    const heading = line.match(/^(#{1,3})\s+(.*)$/);
    if (heading) {
      flush();
      const level = heading[1].length + 1;
      html.push(`<h${level}>${inline(heading[2])}</h${level}>`);
      continue;
    }
    if (isTableRow(line) && i + 1 < lines.length && isSeparator(lines[i + 1].trim())) {
      flush();
      const head = cells(line).map((cell) => `<th>${inline(cell)}</th>`).join('');
      let table = `<table><thead><tr>${head}</tr></thead><tbody>`;
      i += 2;
      while (i < lines.length && isTableRow(lines[i].trim())) {
        table += `<tr>${cells(lines[i].trim()).map((cell) => `<td>${inline(cell)}</td>`).join('')}</tr>`;
        i += 1;
      }
      i -= 1;
      table += '</tbody></table>';
      html.push(table);
      continue;
    }
    if (line.startsWith('- ')) {
      flush();
      html.push(`<li>${inline(line.slice(2))}</li>`);
      continue;
    }
    paragraph.push(line);
  }
  flush();
  return html.join('\n');
}

function readPosts() {
  if (!fs.existsSync(postsDir)) return [];
  return fs.readdirSync(postsDir)
    .filter((name) => name.endsWith('.md'))
    .sort()
    .map((name) => {
      const markdown = fs.readFileSync(path.join(postsDir, name), 'utf8');
      const titleMatch = markdown.match(/^#\s+(.+)$/m);
      const dateMatch = markdown.match(/^date:\s*(.+)$/m);
      return {
        name,
        title: titleMatch ? titleMatch[1].trim() : name.replace(/\.md$/, ''),
        date: dateMatch ? dateMatch[1].trim() : '',
        html: renderMarkdown(markdown.replace(/^date:\s*.+\n?/m, '')),
      };
    });
}

const posts = readPosts();
const cards = posts.map((post) => `
    <article class="post">
      <h2>${inline(post.title)}</h2>
      ${post.date ? `<p class="date">${inline(post.date)}</p>` : ''}
      ${post.html}
    </article>`).join('\n');

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Shiny Mold — Injection Molding DFM Guides</title>
  <meta name="description" content="Original technical guides on injection mold design, DFM and tooling by Shiny Mold.">
  <style>
    body { font-family: system-ui, -apple-system, Segoe UI, sans-serif; line-height: 1.65; color: #17202a; max-width: 820px; margin: 0 auto; padding: 2rem 1.25rem 4rem; }
    header { border-bottom: 1px solid #dfe6ec; margin-bottom: 2rem; }
    h1 { font-size: 1.8rem; margin-bottom: .25rem; }
    h2 { font-size: 1.35rem; margin-top: 2rem; }
    a { color: #0b5cab; }
    .post { padding-bottom: 2.5rem; border-bottom: 1px solid #edf0f3; }
    .date { color: #5b6875; font-size: .9rem; }
    li { margin-bottom: .4rem; }
    table { border-collapse: collapse; width: 100%; margin: 1.2rem 0; font-size: .94rem; }
    th, td { border: 1px solid #dfe6ec; padding: .5rem .6rem; text-align: left; vertical-align: top; }
    th { background: #f5f8fa; }
  </style>
</head>
<body>
  <header>
    <h1>Shiny Mold — Injection Molding DFM Guides</h1>
    <p>Open-source technical notes on mold design, resin behavior, tooling checks and production validation by <a href="https://www.shinymold.com" target="_blank" rel="noopener noreferrer">www.shinymold.com</a>.</p>
  </header>
  <main>${cards || '\n    <p>Posts will appear here after they are added to the repository.</p>\n  '}</main>
  <footer>
    <p>Published automatically by GitHub Actions. Source: <a href="https://github.com/shinymolding/injection-molding-dfm-guides" target="_blank" rel="noopener noreferrer">shinymolding/injection-molding-dfm-guides</a>.</p>
  </footer>
</body>
</html>
`;

fs.mkdirSync(siteDir, { recursive: true });
fs.writeFileSync(path.join(siteDir, 'index.html'), html);
console.log(`Built ${posts.length} post(s) into ${path.join(siteDir, 'index.html')}`);
