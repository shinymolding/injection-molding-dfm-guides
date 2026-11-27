#!/usr/bin/env node
// Builds a static, crawlable article site from posts/*.md. No third-party dependencies.
//
// Output:
//   site/index.html                  article index, newest first
//   site/posts/<slug>/index.html     one crawlable page per article
//   site/sitemap.xml                 all indexable URLs
//   site/robots.txt                  crawl policy + sitemap reference
//   site/feed.xml                    RSS 2.0 feed of recent articles
//   site/404.html                    fallback page

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const postsDir = path.join(root, 'posts');
const siteDir = path.join(root, 'site');

const SITE_BASE = (process.env.SITE_BASE || 'https://shinymolding.github.io/injection-molding-dfm-guides').replace(/\/+$/, '');
const SITE_NAME = 'Shiny Mold DFM Guides';
const BRAND_NAME = 'Shiny Mold';
const BRAND_URL = 'https://www.shinymold.com';
const REPO_URL = 'https://github.com/shinymolding/injection-molding-dfm-guides';
const SITE_DESC = 'Original technical guides on injection molding DFM, mold design, die casting and tooling validation by Shiny Mold, a Dongguan mold maker serving energy storage, automotive and smart lock programs.';

function esc(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function inline(text) {
  let out = esc(text);
  out = out.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (_m, label, url) => {
    return `<a href="${esc(url)}" rel="noopener">${label}</a>`;
  });
  out = out.replace(/`([^`]+)`/g, '<code>$1</code>');
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>');
  return out;
}

function renderMarkdown(markdown) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const html = [];
  let paragraph = [];
  let listType = null;

  const closeList = () => {
    if (listType) {
      html.push(`</${listType}>`);
      listType = null;
    }
  };
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
      closeList();
      continue;
    }
    if (line === '---') {
      flush();
      closeList();
      html.push('<hr>');
      continue;
    }

    const heading = line.match(/^(#{2,4})\s+(.*)$/);
    if (heading) {
      flush();
      closeList();
      const level = heading[1].length;
      const anchor = heading[2].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      html.push(`<h${level} id="${anchor}">${inline(heading[2])}</h${level}>`);
      continue;
    }

    if (isTableRow(line) && i + 1 < lines.length && isSeparator(lines[i + 1].trim())) {
      flush();
      closeList();
      const head = cells(line).map((cell) => `<th>${inline(cell)}</th>`).join('');
      let table = `<div class="table-wrap"><table><thead><tr>${head}</tr></thead><tbody>`;
      i += 2;
      while (i < lines.length && isTableRow(lines[i].trim())) {
        table += `<tr>${cells(lines[i].trim()).map((cell) => `<td>${inline(cell)}</td>`).join('')}</tr>`;
        i += 1;
      }
      i -= 1;
      html.push(`${table}</tbody></table></div>`);
      continue;
    }

    if (line.startsWith('> ')) {
      flush();
      closeList();
      html.push(`<blockquote>${inline(line.slice(2))}</blockquote>`);
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      flush();
      if (listType !== 'ul') {
        closeList();
        html.push('<ul>');
        listType = 'ul';
      }
      html.push(`<li>${inline(line.replace(/^[-*]\s+/, ''))}</li>`);
      continue;
    }

    if (/^\d+[.)]\s+/.test(line)) {
      flush();
      if (listType !== 'ol') {
        closeList();
        html.push('<ol>');
        listType = 'ol';
      }
      html.push(`<li>${inline(line.replace(/^\d+[.)]\s+/, ''))}</li>`);
      continue;
    }

    closeList();
    paragraph.push(line);
  }

  flush();
  closeList();
  return html.join('\n');
}

function toPlain(markdown) {
  return markdown
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[`*_>|]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function parsePost(fileName) {
  const raw = fs.readFileSync(path.join(postsDir, fileName), 'utf8').replace(/\r\n/g, '\n');
  const meta = {};
  const body = raw.replace(/^(date|slug|description|keywords|title):\s*(.+)$/gm, (_m, key, value) => {
    meta[key.toLowerCase()] = value.trim();
    return '';
  }).trim();

  const titleMatch = body.match(/^#\s+(.+)$/m);
  const title = meta.title || (titleMatch ? titleMatch[1].trim() : fileName.replace(/\.md$/, ''));
  const bodyWithoutH1 = body.replace(/^#\s+(.+)\n?/m, '').trim();
  const fallbackSlug = fileName.replace(/^\d+[-_]/, '').replace(/\.md$/, '');

  return {
    file: fileName,
    slug: slugify(meta.slug || fallbackSlug || title),
    title,
    date: meta.date || new Date().toISOString().slice(0, 10),
    description: meta.description || `${toPlain(bodyWithoutH1).slice(0, 155)}...`,
    body: bodyWithoutH1,
    html: renderMarkdown(bodyWithoutH1),
    plain: toPlain(bodyWithoutH1),
  };
}

function loadPosts() {
  if (!fs.existsSync(postsDir)) return [];
  return fs.readdirSync(postsDir)
    .filter((name) => name.endsWith('.md'))
    .map(parsePost)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.slug.localeCompare(b.slug)));
}

const posts = loadPosts();
const lastUpdated = posts.length ? posts[0].date : new Date().toISOString().slice(0, 10);

const CSS = `
:root { color-scheme: light; }
* { box-sizing: border-box; }
body { margin: 0; font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; line-height: 1.7; color: #17202a; background: #fff; }
a { color: #0b5cab; text-decoration: none; }
a:hover { text-decoration: underline; }
.wrap { max-width: 820px; margin: 0 auto; padding: 0 1.25rem; }
header.site { border-bottom: 1px solid #e2e8ef; padding: 1.6rem 0 1.1rem; }
header.site .brand { display: block; font-weight: 700; font-size: 1.05rem; color: #17202a; }
header.site .tagline { margin: .35rem 0 0; color: #5b6875; font-size: .92rem; }
main { padding: 2rem 0 3rem; }
h1 { font-size: 1.75rem; line-height: 1.3; margin: 0 0 .4rem; }
h2 { font-size: 1.3rem; margin: 2rem 0 .6rem; }
h3 { font-size: 1.1rem; margin: 1.6rem 0 .5rem; }
.meta { color: #5b6875; font-size: .9rem; margin: 0 0 1.6rem; }
.lead { color: #33414f; }
ul.post-list { list-style: none; padding: 0; margin: 2rem 0 0; }
ul.post-list li { padding: 1.1rem 0; border-bottom: 1px solid #eef2f6; }
ul.post-list h2 { font-size: 1.15rem; margin: 0 0 .25rem; }
ul.post-list p { margin: .3rem 0 0; color: #4a5763; font-size: .95rem; }
.table-wrap { overflow-x: auto; margin: 1.2rem 0; }
table { border-collapse: collapse; width: 100%; font-size: .94rem; }
th, td { border: 1px solid #dfe6ec; padding: .5rem .6rem; text-align: left; vertical-align: top; }
th { background: #f5f8fa; }
code { background: #f2f5f8; padding: .1rem .3rem; border-radius: 3px; font-size: .92em; }
blockquote { margin: 1.2rem 0; padding: .2rem 1rem; border-left: 3px solid #cfdae5; color: #46535f; }
hr { border: 0; border-top: 1px solid #e6ecf2; margin: 2rem 0; }
.cta { margin: 2.2rem 0 0; padding: 1rem 1.1rem; background: #f6f9fb; border: 1px solid #e2e8ef; border-radius: 6px; font-size: .95rem; }
.related { margin: 2.4rem 0 0; }
.related h2 { font-size: 1.05rem; }
.related ul { padding-left: 1.1rem; }
footer.site { border-top: 1px solid #e2e8ef; padding: 1.4rem 0 2.6rem; color: #5b6875; font-size: .88rem; }
footer.site a { color: #46535f; }
`;

function page({ title, description, canonical, body, extraHead = '' }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${esc(canonical)}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="${esc(SITE_NAME)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(canonical)}">
<meta name="twitter:card" content="summary">
<meta name="robots" content="index, follow, max-image-preview:large">
${extraHead}
<style>${CSS}</style>
</head>
<body>
<header class="site"><div class="wrap">
  <a class="brand" href="${SITE_BASE}/">${esc(SITE_NAME)}</a>
  <p class="tagline">Open technical notes on mold design, DFM and tooling validation by <a href="${BRAND_URL}" rel="noopener">${esc(BRAND_NAME)}</a>.</p>
</div></header>
<main><div class="wrap">
${body}
</div></main>
<footer class="site"><div class="wrap">
  <p>${esc(BRAND_NAME)} builds injection molds, die casting dies and tooling for energy storage, automotive and smart lock programs. Website: <a href="${BRAND_URL}" rel="noopener">www.shinymold.com</a>.</p>
  <p>Source: <a href="${REPO_URL}" rel="noopener">${esc(REPO_URL.replace('https://', ''))}</a> &middot; <a href="${SITE_BASE}/feed.xml">RSS</a></p>
</div></footer>
</body>
</html>
`;
}

function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: BRAND_NAME,
    url: BRAND_URL,
    description: 'Injection mold and die casting tooling manufacturer in Dongguan, China, serving energy storage, automotive and smart lock programs.',
    sameAs: [BRAND_URL, REPO_URL],
  };
}

function writeFile(relativePath, content) {
  const target = path.join(siteDir, relativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
}

// --- index page -------------------------------------------------------------
const indexCards = posts.map((post) => `
      <li>
        <h2><a href="posts/${post.slug}/">${esc(post.title)}</a></h2>
        <p class="meta">${esc(post.date)}</p>
        <p>${esc(post.description)}</p>
      </li>`).join('');

const indexBody = `
  <h1>Injection Molding DFM Guides</h1>
  <p class="lead">Practical, evidence-first notes on mold design, resin behavior, steel selection, die casting and first-article validation. Written by the engineering team at <a href="${BRAND_URL}" rel="noopener">${esc(BRAND_NAME)}</a> as reference material for buyers and product engineers.</p>
  <ul class="post-list">${indexCards || '<li><p>Articles will appear here as they are published.</p></li>'}</ul>`;

const indexJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: SITE_NAME,
  description: SITE_DESC,
  url: `${SITE_BASE}/`,
  isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: `${SITE_BASE}/` },
  about: organizationJsonLd(),
  hasPart: posts.slice(0, 20).map((post) => ({
    '@type': 'Article',
    headline: post.title,
    datePublished: post.date,
    url: `${SITE_BASE}/posts/${post.slug}/`,
  })),
};

writeFile('index.html', page({
  title: `${SITE_NAME} — Molding, Die Casting and DFM Notes`,
  description: SITE_DESC,
  canonical: `${SITE_BASE}/`,
  body: indexBody,
  extraHead: `<script type="application/ld+json">${JSON.stringify(indexJsonLd)}</script>`,
}));

// --- article pages ----------------------------------------------------------
for (const post of posts) {
  const url = `${SITE_BASE}/posts/${post.slug}/`;
  const others = posts.filter((item) => item.slug !== post.slug).slice(0, 3);

  const related = others.length
    ? `<section class="related">
    <h2>Related guides</h2>
    <ul>${others.map((item) => `<li><a href="../${item.slug}/">${esc(item.title)}</a></li>`).join('')}</ul>
  </section>`
    : '';

  const articleBody = `
  <article>
    <h1>${esc(post.title)}</h1>
    <p class="meta">Published ${esc(post.date)} &middot; ${esc(BRAND_NAME)} engineering notes</p>
    ${post.html}
    <div class="cta">
      <strong>Working on a program like this?</strong> ${esc(BRAND_NAME)} runs mold and die design review, T1 validation and production in Dongguan. Technical details and contact: <a href="${BRAND_URL}" rel="noopener">www.shinymold.com</a>.
    </div>
  </article>
  ${related}
  <p><a href="../../">&larr; All guides</a></p>`;

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: 'en',
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url,
    author: { '@type': 'Organization', name: BRAND_NAME, url: BRAND_URL },
    publisher: organizationJsonLd(),
    isPartOf: { '@type': 'Blog', name: SITE_NAME, url: `${SITE_BASE}/` },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: SITE_NAME, item: `${SITE_BASE}/` },
      { '@type': 'ListItem', position: 2, name: post.title, item: url },
    ],
  };

  writeFile(`posts/${post.slug}/index.html`, page({
    title: `${post.title} | ${SITE_NAME}`,
    description: post.description,
    canonical: url,
    body: articleBody,
    extraHead: `<script type="application/ld+json">${JSON.stringify(articleJsonLd)}</script>
<script type="application/ld+json">${JSON.stringify(breadcrumbJsonLd)}</script>`,
  }));
}

// --- sitemap, robots, feed, 404 --------------------------------------------
const sitemapEntries = [
  `  <url><loc>${SITE_BASE}/</loc><lastmod>${lastUpdated}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>`,
  ...posts.map((post) => `  <url><loc>${SITE_BASE}/posts/${post.slug}/</loc><lastmod>${post.date}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`),
].join('\n');

writeFile('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</urlset>
`);

writeFile('robots.txt', `User-agent: *
Allow: /

Sitemap: ${SITE_BASE}/sitemap.xml
`);

function rfc822(date) {
  return new Date(`${date}T09:00:00Z`).toUTCString();
}

const feedItems = posts.slice(0, 20).map((post) => `    <item>
      <title>${esc(post.title)}</title>
      <link>${SITE_BASE}/posts/${post.slug}/</link>
      <guid isPermaLink="true">${SITE_BASE}/posts/${post.slug}/</guid>
      <pubDate>${rfc822(post.date)}</pubDate>
      <description>${esc(post.description)}</description>
    </item>`).join('\n');

writeFile('feed.xml', `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${esc(SITE_NAME)}</title>
    <link>${SITE_BASE}/</link>
    <description>${esc(SITE_DESC)}</description>
    <language>en</language>
    <lastBuildDate>${rfc822(lastUpdated)}</lastBuildDate>
${feedItems}
  </channel>
</rss>
`);

const notFoundJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Page not found',
  url: `${SITE_BASE}/404.html`,
  isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: `${SITE_BASE}/` },
};

writeFile('404.html', page({
  title: `Page not found | ${SITE_NAME}`,
  description: 'The requested page was not found. Browse the DFM guides index instead.',
  canonical: `${SITE_BASE}/404.html`,
  body: `<h1>Page not found</h1><p class="lead">This page does not exist. Start from the <a href="/injection-molding-dfm-guides/">guides index</a>.</p>`,
  extraHead: `<script type="application/ld+json">${JSON.stringify(notFoundJsonLd)}</script>`,
}));

console.log(`Built ${posts.length} article(s) + index, sitemap, robots, feed into ${siteDir}`);
posts.forEach((post) => console.log(`  /posts/${post.slug}/`));