# Injection Molding & Die Casting DFM Guides

Technical notes written by the engineering team at **Shiny Mold (SHINY)** — a Dongguan toolmaker building injection molds and aluminum / magnesium die casting dies for energy storage, automotive and smart lock programs.

- Company website: https://www.shinymold.com
- Published site (GitHub Pages): https://shinymolding.github.io/injection-molding-dfm-guides/
- RSS feed: https://shinymolding.github.io/injection-molding-dfm-guides/feed.xml
- Sitemap: https://shinymolding.github.io/injection-molding-dfm-guides/sitemap.xml

## Guides

| # | Guide |
| --- | --- |
| 001 | [Resin Shrinkage and Gate Strategy: A Practical DFM Checklist](https://shinymolding.github.io/injection-molding-dfm-guides/posts/resin-shrinkage-and-gate-strategy/) |
| 002 | [Mold Steel Selection: A Decision Matrix, Not a Brand Preference](https://shinymolding.github.io/injection-molding-dfm-guides/posts/mold-steel-selection-matrix/) |
| 003 | [Die Casting or Injection Molding? A Process Decision for Enclosure Housings](https://shinymolding.github.io/injection-molding-dfm-guides/posts/die-casting-vs-injection-molding-enclosures/) |
| 004 | [DFM Checklist for Battery Energy Storage Enclosure Parts](https://shinymolding.github.io/injection-molding-dfm-guides/posts/bess-enclosure-dfm-checklist/) |
| 005 | [Smart Lock Housing: Closing the Tolerance Stack-up](https://shinymolding.github.io/injection-molding-dfm-guides/posts/smart-lock-housing-tolerance-stackup/) |

## How the site is published

1. Each guide lives in `posts/` as Markdown with a `date:` line, a `# H1` title and an optional `description:` line.
2. `node scripts/build-site.js` renders one crawlable page per guide (`site/posts/<slug>/`), an index, `sitemap.xml`, `robots.txt`, `feed.xml` and `404.html`.
3. `.github/workflows/publish.yml` rebuilds and deploys to GitHub Pages on every push to `posts/`, `scripts/` or the workflow itself, and once a day at 09:00 UTC.

No third-party dependencies are required; the builder is plain Node.

## Reuse

Technical text may be quoted or summarized with attribution to Shiny Mold and a link to https://www.shinymold.com. Corrections and questions are welcome via GitHub Issues.