import { exec } from "node:child_process";
import { createHash } from "node:crypto";
import { statSync } from "node:fs";
import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX, type Options } from "@content-collections/mdx";
import remarkGfm from "remark-gfm";
import { highlight } from "remark-sugar-high";
import z from "zod";
import { absoluteUrl, SITE_URL } from "./src/lib/site";

function run(cmd: string) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        return reject(error);
      }
      if (stderr) {
        return reject(stderr);
      }
      resolve(stdout);
    });
  });
}

function generateId(inputString: string): string {
  const hash = createHash("sha256").update(inputString).digest("hex");

  const shortId = Buffer.from(hash).toString("base64").slice(0, 8);

  return shortId;
}

const getFileCreationDate = (filePath: string) => {
  const stats = statSync(filePath);
  return new Date(stats.birthtime).toISOString();
};

const mdxOptions: Options = {
  remarkPlugins: [remarkGfm, highlight],
};

const setStructuredData = (doc: {
  title: string;
  publishedAt: string;
  summary: string;
  image?: string;
  _meta: { path: string };
}) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: doc.title,
  datePublished: doc.publishedAt,
  dateModified: doc.publishedAt,
  description: doc.summary,
  image: absoluteUrl(doc.image ?? "/images/og-image.png"),
  url: absoluteUrl(`/writing/${doc._meta.path}`),
  author: {
    "@type": "Person",
    name: "Johnie Hjelm",
    url: SITE_URL,
  },
  publisher: {
    "@type": "Person",
    name: "Johnie Hjelm",
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": absoluteUrl(`/writing/${doc._meta.path}`),
  },
});

interface CacheContext {
  cache: <T>(key: string, fn: (key: string) => Promise<T>) => Promise<T>;
}

const getLastModified = async (
  context: CacheContext,
  filePath: string,
  directory: string
) =>
  context.cache(filePath, async (cachedFilePath) => {
    try {
      const stdout = (await run(
        `git log -1 --format=%ai -- ${directory}/${cachedFilePath}`
      )) as string;
      return new Date(stdout.toString().trim()).toISOString();
    } catch {
      return new Date().toISOString();
    }
  });

const PostSchema = z.object({
  title: z.string(),
  publishedAt: z
    .string()
    .refine((value) => !Number.isNaN(Date.parse(value)), "Invalid date string")
    .transform<string>((value) => new Date(value).toISOString()),
  summary: z.string(),
  image: z.string().optional(),
  leading: z.boolean().optional().default(false),
  content: z.string(),
});

const calcReadingTime = (
  text: string,
  options?: { wordsPerMinute: number }
) => {
  const wordsPerMinute = options?.wordsPerMinute || 200;
  const WORDS_REGEX = /\w+/g;
  const words = (text.match(WORDS_REGEX) || []).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return {
    text: `${minutes} min read`,
    minutes,
    words,
  };
};

const Post = defineCollection({
  name: "Post",
  directory: "content/writing/",
  include: "*.mdx",
  schema: PostSchema,
  transform: async (document, context) => {
    const mdx = await compileMDX(context, document, mdxOptions);
    const slug = document._meta.path;
    const readingTime = calcReadingTime(document.content, {
      wordsPerMinute: 275,
    }).text;
    const structuredData = setStructuredData(document);
    const lastModified = await getLastModified(
      context,
      document._meta.filePath,
      "content/writing"
    );

    return {
      ...document,
      slug,
      readingTime,
      structuredData,
      lastModified,
      mdx,
    };
  },
});

const Page = defineCollection({
  name: "Page",
  directory: "content/page/",
  include: "*.mdx",
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    image: z.string().optional(),
    content: z.string(),
  }),
  transform: async (document, context) => {
    const mdx = await compileMDX(context, document, mdxOptions);
    const slug = document._meta.path;
    const lastModified = await getLastModified(
      context,
      document._meta.filePath,
      "content/page"
    );

    return {
      ...document,
      slug,
      lastModified,
      mdx,
    };
  },
});

const Work = defineCollection({
  name: "Work",
  directory: "content/work/",
  include: "*.yml",
  parser: "yaml",
  schema: z.object({
    company: z.string(),
    role: z.string(),
    url: z.string().optional(),
    startYear: z.number().int(),
    endYear: z.number().int().optional(),
    present: z.boolean().optional(),
    image: z.string().optional(),
  }),
  transform: (document) => {
    const _id = generateId(
      document.company + document.role + document.startYear
    );
    return {
      ...document,
      _id,
    };
  },
});

const Project = defineCollection({
  name: "Project",
  directory: "content/projects/",
  include: "*.yml",
  parser: "yaml",
  schema: z.object({
    name: z.string(),
    description: z.string(),
    url: z.string().optional(),
    projectType: z.string().optional(),
    image: z.string().optional(),
    order: z.number().optional(),
    active: z.boolean().optional(),
  }),
  transform: (document) => {
    const _id = generateId(document.name + document.url);
    return {
      ...document,
      _id,
    };
  },
});

export const Notes = defineCollection({
  name: "Notes",
  directory: "content/notes/",
  include: "*.mdx",
  schema: z.object({
    publishedAt: z
      .string()
      .refine(
        (value) => !Number.isNaN(Date.parse(value)),
        "Invalid date string"
      )
      .transform<string>((value) => new Date(value).toISOString())
      .optional(),
    type: z.enum(["article", "code", "podcast", "general"]).optional(),
    url: z.string().optional(),
    content: z.string(),
  }),
  transform: async (document, context) => {
    const mdx = await compileMDX(context, document, mdxOptions);
    const slug = document._meta.path;
    const publishedAt =
      document.publishedAt ?? getFileCreationDate(document._meta.filePath);

    return {
      ...document,
      slug,
      mdx,
      publishedAt,
    };
  },
});

export default defineConfig({
  content: [Post, Page, Work, Project, Notes],
});
