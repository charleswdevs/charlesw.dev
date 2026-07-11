export function GET() {
  return new Response(
    [
      "/* TEAM */",
      "Author: Charles Weiss",
      "Site: https://www.charlesw.dev",
      "Location: Montreal, Quebec, Canada",
      "",
      "/* SITE */",
      "Built with: Astro",
      "Language: English",
      "Purpose: Personal technical blog and public notes",
      "",
    ].join("\n"),
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    },
  );
}
