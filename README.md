# charlesw.dev

Source for [charlesw.dev](https://charlesw.dev), Charles W.'s personal site for
technical writing, project notes, career context, and public contact links. The
site is built with Astro, uses Markdown for blog content, and deploys to GitHub
Pages from the `main` branch.

## What is included

- A Markdown-powered blog under `src/content/blog`
- Home, about, and resume pages in `src/pages`
- Shared profile and site metadata in `src/data/site.ts`
- SEO helpers, JSON-LD, RSS, sitemap, robots.txt, and web manifest routes
- Global styling for a quiet, writing-first layout
- A static resume PDF in `public/charles-weiss-resume.pdf`

## Writing

Create a new Markdown file in `src/content/blog`:

```md
---
title: "Post title"
description: "One sentence summary."
pubDate: 2026-05-29
tags: ["notes"]
---

Write the post here.
```

Use `draft: true` in the frontmatter to keep a post off the published index.

## Development

```sh
npm install
npm run dev
```

## Build

```sh
npm run build
```

The site deploys to GitHub Pages from the `main` branch.
