import {
  absoluteUrl,
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE_PATH,
  pageTitle,
  SITE_LOCALE,
  SITE_NAME,
} from "@/lib/site";

type MetaTag =
  | { title: string }
  | { charSet: "utf-8" }
  | { name: string; content: string }
  | { property: string; content: string };

interface LinkTag {
  href: string;
  rel: string;
  type?: string;
}

interface ScriptTag {
  children?: string;
  src?: string;
  type?: string;
}

interface SeoOptions {
  description?: string;
  image?: string;
  modifiedTime?: string;
  path: string;
  publishedTime?: string;
  title?: string;
  type?: "website" | "article";
}

export function buildSeo({
  path,
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_OG_IMAGE_PATH,
  type = "website",
  publishedTime,
  modifiedTime,
}: SeoOptions): { links: LinkTag[]; meta: MetaTag[] } {
  const canonical = absoluteUrl(path);
  const fullTitle = pageTitle(title);
  const resolvedImage = absoluteUrl(image);

  const meta: MetaTag[] = [
    { title: fullTitle },
    { name: "description", content: description },
    { property: "og:title", content: fullTitle },
    { property: "og:description", content: description },
    { property: "og:url", content: canonical },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:locale", content: SITE_LOCALE },
    { property: "og:type", content: type },
    { property: "og:image", content: resolvedImage },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: fullTitle },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: resolvedImage },
  ];

  if (publishedTime) {
    meta.push({ property: "article:published_time", content: publishedTime });
  }

  if (modifiedTime) {
    meta.push({ property: "article:modified_time", content: modifiedTime });
  }

  return {
    links: [{ rel: "canonical", href: canonical }],
    meta,
  };
}

export function jsonLdScript(data: unknown): ScriptTag {
  return {
    type: "application/ld+json",
    children: JSON.stringify(data).replace(/</g, "\\u003c"),
  };
}
