import { getCollection } from "astro:content";
import { absoluteUrl, siteUrl, xmlEscape } from "../utils/seo";
import { profile } from "../data/site";

const mediaType = (path: string) => {
  if (path.endsWith(".png")) return "image/png";
  if (path.endsWith(".jpg") || path.endsWith(".jpeg")) return "image/jpeg";
  if (path.endsWith(".svg")) return "image/svg+xml";

  return "image/*";
};

export async function GET() {
  const posts = (await getCollection("blog"))
    .filter((post) => !post.data.draft)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  const latestDate = posts[0]?.data.pubDate ?? new Date();
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${xmlEscape(profile.domain)}</title>
    <link>${siteUrl}/</link>
    <description>${xmlEscape(profile.intro)}</description>
    <language>en-CA</language>
    <lastBuildDate>${latestDate.toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
${posts
  .map((post) => {
    const url = absoluteUrl(`/blog/${post.id}/`);
    const mediaContent = post.data.images
      .map(
        (image) =>
          `      <media:content url="${xmlEscape(absoluteUrl(image))}" medium="image" type="${mediaType(image)}" />`,
      )
      .join("\n");
    const categories = post.data.tags
      .map((tag) => `      <category>${xmlEscape(tag)}</category>`)
      .join("\n");

    return `    <item>
      <title>${xmlEscape(post.data.title)}</title>
      <link>${xmlEscape(url)}</link>
      <guid>${xmlEscape(url)}</guid>
      <description>${xmlEscape(post.data.description)}</description>
      <pubDate>${post.data.pubDate.toUTCString()}</pubDate>
${categories}
${mediaContent}
    </item>`;
  })
  .join("\n")}
  </channel>
</rss>
`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
