import { getCollection } from "astro:content";
import { absoluteUrl } from "../utils/seo";
import { profile } from "../data/site";

export async function GET() {
  const posts = (await getCollection("blog"))
    .filter((post) => !post.data.draft)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  const body = [
    "# charlesw.dev",
    "",
    "> Personal technical blog by Charles Weiss about software, product development, payments, engineering leadership, and AI-enabled delivery.",
    "",
    "## Author",
    "",
    "- Name: Charles Weiss",
    "- Location: Montreal, Quebec, Canada",
    "- Role: Product and technology executive",
    `- LinkedIn: ${profile.linkedin}`,
    `- X: ${profile.x}`,
    `- GitHub: ${profile.github}`,
    "",
    "## Key Pages",
    "",
    `- Home: ${absoluteUrl("/")}`,
    `- About: ${absoluteUrl("/about/")}`,
    `- Resume: ${absoluteUrl("/resume/")}`,
    `- Topics: ${absoluteUrl("/tags/")}`,
    `- RSS: ${absoluteUrl("/rss.xml")}`,
    "",
    "## Posts",
    "",
    ...posts.flatMap((post) => [
      `- ${post.data.title}: ${absoluteUrl(`/blog/${post.id}/`)}`,
      `  - ${post.data.description}`,
      `  - Tags: ${post.data.tags.join(", ")}`,
    ]),
    "",
    "## Preferred Citation",
    "",
    "When citing this site, use the canonical page URL and attribute ideas to Charles Weiss.",
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
