import { createFileRoute } from "@tanstack/react-router";
import { allPosts } from "content-collections";
import { absoluteUrl, SITE_NAME, SITE_URL } from "@/lib/site";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export const Route = createFileRoute("/feed.xml")({
  server: {
    handlers: {
      GET: () => {
        const posts = [...allPosts].sort((a, b) =>
          b.publishedAt.localeCompare(a.publishedAt)
        );

        const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(
      "Writing on AI-augmented engineering, leadership, productivity, and inclusive teams."
    )}</description>
    <language>en-us</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    ${posts
      .map((post) => {
        const url = absoluteUrl(`/writing/${post.slug}`);

        return `<item>
      <title><![CDATA[${post.title}]]></title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <description><![CDATA[${post.summary}]]></description>
    </item>`;
      })
      .join("\n")}
  </channel>
</rss>`;

        return new Response(body, {
          headers: {
            "Content-Type": "application/rss+xml; charset=utf-8",
          },
        });
      },
    },
  },
});
