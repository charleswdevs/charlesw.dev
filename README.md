# charlesw.dev

Personal blog and technical musings for Charles W., built with Astro and Markdown.

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
