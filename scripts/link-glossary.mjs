import { existsSync } from "node:fs";
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { glossaryEntries } from "../src/data/glossary.mjs";

const rootDir = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const distDir = path.join(rootDir, "dist");
const blogDir = path.join(rootDir, "src/content/blog");
const htmlTokenPattern = /(<[^>]+>)/g;
const skippedTags = new Set([
  "a",
  "code",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "li",
  "nav",
  "pre",
  "script",
  "style",
  "svg",
  "title",
]);

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getTagName = (tag) => {
  const match = tag.match(/^<\/?\s*([a-zA-Z0-9:-]+)/);
  return match?.[1]?.toLowerCase();
};

const isClosingTag = (tag) => /^<\//.test(tag);
const isSelfClosingTag = (tag) => /\/>$/.test(tag) || /^<(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)\b/i.test(tag);

const getBlogDates = async () => {
  if (!existsSync(blogDir)) {
    return new Map();
  }

  const files = await readdir(blogDir);
  const dates = new Map();

  await Promise.all(
    files
      .filter((file) => file.endsWith(".md") || file.endsWith(".mdx"))
      .map(async (file) => {
        const source = await readFile(path.join(blogDir, file), "utf8");
        const dateMatch = source.match(/^pubDate:\s*"?([^"\n]+)"?/m);
        if (!dateMatch) {
          return;
        }

        const slug = file.replace(/\.(md|mdx)$/, "");
        dates.set(`/blog/${slug}/`, new Date(dateMatch[1]).valueOf());
      }),
  );

  return dates;
};

const collectHtmlFiles = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return collectHtmlFiles(entryPath);
      }

      return entry.name.endsWith(".html") ? [entryPath] : [];
    }),
  );

  return files.flat();
};

const routeForFile = (filePath) => {
  const relativePath = path.relative(distDir, filePath);
  if (relativePath === "index.html") {
    return "/";
  }

  return `/${relativePath.replace(/index\.html$/, "").replace(/\\/g, "/")}`;
};

const sortPages = async (files) => {
  const blogDates = await getBlogDates();
  const staticOrder = new Map([
    ["/", 1],
    ["/about/", 2],
    ["/resume/", 3],
  ]);

  return files
    .map((filePath) => {
      const route = routeForFile(filePath);
      const blogDate = blogDates.get(route);
      const sortDate = blogDate ?? Number.MAX_SAFE_INTEGER;
      const staticRank = staticOrder.get(route) ?? 100;

      return { filePath, route, sortDate, staticRank };
    })
    .filter((page) => page.route !== "/glossary/")
    .sort((a, b) => a.sortDate - b.sortDate || a.staticRank - b.staticRank || a.route.localeCompare(b.route));
};

const termMatchers = glossaryEntries.map((entry) => {
  const aliases = [entry.term, ...entry.aliases]
    .map((alias) => alias.trim())
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);

  return {
    slug: entry.slug,
    aliases,
    pattern: new RegExp(`(^|[^A-Za-z0-9])(${aliases.map(escapeRegExp).join("|")})(?=$|[^A-Za-z0-9])`, "i"),
  };
});

const findNextMatch = (text, linkedSlugs) => {
  let bestMatch = null;

  for (const matcher of termMatchers) {
    if (linkedSlugs.has(matcher.slug)) {
      continue;
    }

    const match = matcher.pattern.exec(text);
    if (!match) {
      continue;
    }

    const start = match.index + match[1].length;
    const end = start + match[2].length;

    if (
      bestMatch === null ||
      start < bestMatch.start ||
      (start === bestMatch.start && match[2].length > bestMatch.text.length)
    ) {
      bestMatch = {
        start,
        end,
        text: match[2],
        slug: matcher.slug,
      };
    }
  }

  return bestMatch;
};

const linkText = (text, linkedSlugs) => {
  let output = "";
  let remaining = text;

  while (remaining.length > 0) {
    const match = findNextMatch(remaining, linkedSlugs);
    if (!match) {
      output += remaining;
      break;
    }

    const prefix = remaining.slice(0, match.start);
    const linkedText = remaining.slice(match.start, match.end);
    const suffix = remaining.slice(match.end);

    output += `${prefix}<a class="glossary-link" href="/glossary/#${match.slug}">${linkedText}</a>`;
    linkedSlugs.add(match.slug);
    remaining = suffix;
  }

  return output;
};

const linkMainContent = (html) => {
  const mainStart = html.indexOf("<main");
  const mainEnd = html.lastIndexOf("</main>");

  if (mainStart === -1 || mainEnd === -1) {
    return html;
  }

  const beforeMain = html.slice(0, mainStart);
  const main = html.slice(mainStart, mainEnd + "</main>".length);
  const afterMain = html.slice(mainEnd + "</main>".length);
  const tokens = main.split(htmlTokenPattern).filter((token) => token.length > 0);
  const tagStack = [];
  const linkedSlugs = new Set();

  const linkedMain = tokens
    .map((token) => {
      if (token.startsWith("<")) {
        const tagName = getTagName(token);

        if (tagName && skippedTags.has(tagName)) {
          if (isClosingTag(token)) {
            const index = tagStack.lastIndexOf(tagName);
            if (index !== -1) {
              tagStack.splice(index, 1);
            }
          } else if (!isSelfClosingTag(token)) {
            tagStack.push(tagName);
          }
        }

        return token;
      }

      if (tagStack.length > 0 || token.trim().length === 0) {
        return token;
      }

      return linkText(token, linkedSlugs);
    })
    .join("");

  return `${beforeMain}${linkedMain}${afterMain}`;
};

const run = async () => {
  if (!existsSync(distDir)) {
    throw new Error("Missing dist directory. Run Astro build before linking glossary terms.");
  }

  const htmlFiles = await collectHtmlFiles(distDir);
  const pages = await sortPages(htmlFiles);

  await Promise.all(
    pages.map(async ({ filePath }) => {
      const html = await readFile(filePath, "utf8");
      const linkedHtml = linkMainContent(html);

      if (linkedHtml !== html) {
        await writeFile(filePath, linkedHtml);
      }
    }),
  );
};

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
