import { createFileRoute } from "@tanstack/react-router";
import { allPages, allPosts } from "content-collections";
import { absoluteUrl } from "@/lib/site";

interface SitemapEntry {
  changefreq: "monthly" | "weekly";
  lastmod: string;
  loc: string;
  priority: number;
}

const INDEXED_PAGE_SLUGS = new Set(["about", "colophon"]);

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function xmlEntry(entry: SitemapEntry) {
  return `<url>
  <loc>${escapeXml(entry.loc)}</loc>
  <lastmod>${entry.lastmod}</lastmod>
  <changefreq>${entry.changefreq}</changefreq>
  <priority>${entry.priority.toFixed(1)}</priority>
</url>`;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const pages = allPages
          .filter((page) => INDEXED_PAGE_SLUGS.has(page.slug))
          .map<SitemapEntry>((page) => ({
            changefreq: "monthly",
            lastmod: page.lastModified,
            loc: absoluteUrl(`/${page.slug}`),
            priority: page.slug === "about" ? 0.8 : 0.5,
          }));

        const posts = [...allPosts]
          .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
          .map<SitemapEntry>((post) => ({
            changefreq: "monthly",
            lastmod: post.lastModified,
            loc: absoluteUrl(`/writing/${post.slug}`),
            priority: 0.7,
          }));

        const staticRoutes: SitemapEntry[] = [
          {
            changefreq: "weekly",
            lastmod: posts[0]?.lastmod ?? new Date().toISOString(),
            loc: absoluteUrl("/"),
            priority: 1,
          },
          {
            changefreq: "weekly",
            lastmod: posts[0]?.lastmod ?? new Date().toISOString(),
            loc: absoluteUrl("/writing"),
            priority: 0.9,
          },
        ];

        const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticRoutes, ...pages, ...posts].map(xmlEntry).join("\n")}
</urlset>`;

        return new Response(body, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
          },
        });
      },
    },
  },
});
