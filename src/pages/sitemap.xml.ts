import { getCollection } from "astro:content";
import { absoluteUrl, tagSlug, xmlEscape } from "../utils/seo";

const staticPages = [
  { path: "/", priority: "1.0", images: [] },
  { path: "/about/", priority: "0.7", images: [] },
  { path: "/resume/", priority: "0.7", images: [] },
  { path: "/glossary/", priority: "0.7", images: [] },
  { path: "/tags/", priority: "0.6", images: [] },
];

export async function GET() {
  const posts = (await getCollection("blog"))
    .filter((post) => !post.data.draft)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  const urls = [
    ...staticPages.map((page) => ({
      loc: absoluteUrl(page.path),
      lastmod: new Date().toISOString(),
      changefreq: "weekly",
      priority: page.priority,
      images: page.images,
    })),
    ...posts.map((post) => ({
      loc: absoluteUrl(`/blog/${post.id}/`),
      lastmod: (post.data.updatedDate ?? post.data.pubDate).toISOString(),
      changefreq: "monthly",
      priority: "0.8",
      images: post.data.images,
    })),
    ...Array.from(new Set(posts.flatMap((post) => post.data.tags)))
      .sort()
      .map((tag) => ({
        loc: absoluteUrl(`/tags/${tagSlug(tag)}/`),
        lastmod: new Date().toISOString(),
        changefreq: "weekly",
        priority: "0.6",
        images: [],
      })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls
  .map(
    (url) => `  <url>
    <loc>${xmlEscape(url.loc)}</loc>
    <lastmod>${xmlEscape(url.lastmod)}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
${(url.images ?? [])
  .map(
    (image) => `    <image:image>
      <image:loc>${xmlEscape(absoluteUrl(image))}</image:loc>
    </image:image>`,
  )
  .join("\n")}
  </url>`,
  )
  .join("\n")}
</urlset>
`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
