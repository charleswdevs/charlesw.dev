import { profile } from "../data/site";

export const siteUrl = "https://www.charlesw.dev";
export const defaultImage = `${siteUrl}/favicon.svg`;

export const absoluteUrl = (path = "/") => new URL(path, siteUrl).toString();

export const personSchema = {
  "@type": "Person",
  "@id": `${siteUrl}/#person`,
  name: "Charles Weiss",
  alternateName: profile.name,
  jobTitle: "Product and Technology Executive",
  url: siteUrl,
  sameAs: [profile.github, profile.linkedin, profile.x],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Montreal",
    addressRegion: "Quebec",
    addressCountry: "CA",
  },
  knowsAbout: [
    "Product development",
    "Engineering leadership",
    "Payment optimization",
    "SaaS platforms",
    "AI-enabled delivery",
    "Technical strategy",
  ],
};

export const websiteSchema = {
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  name: profile.domain,
  url: siteUrl,
  description: profile.intro,
  publisher: {
    "@id": `${siteUrl}/#person`,
  },
  inLanguage: "en-CA",
};

export const blogSchema = {
  "@type": "Blog",
  "@id": `${siteUrl}/#blog`,
  name: profile.domain,
  url: siteUrl,
  description: profile.intro,
  author: {
    "@id": `${siteUrl}/#person`,
  },
  publisher: {
    "@id": `${siteUrl}/#person`,
  },
  inLanguage: "en-CA",
};

export const graph = (...items: Array<Record<string, unknown>>) => ({
  "@context": "https://schema.org",
  "@graph": items,
});

export const xmlEscape = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
