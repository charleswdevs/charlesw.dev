import { profile } from "../data/site";

export function GET() {
  return new Response(
    JSON.stringify({
      name: profile.domain,
      short_name: "charlesw.dev",
      description: profile.intro,
      start_url: "/",
      display: "minimal-ui",
      background_color: "#fbfaf7",
      theme_color: "#fbfaf7",
      icons: [
        {
          src: "/favicon.svg",
          sizes: "any",
          type: "image/svg+xml",
          purpose: "any",
        },
      ],
    }),
    {
      headers: {
        "Content-Type": "application/manifest+json; charset=utf-8",
      },
    },
  );
}
