import { createFileRoute, notFound } from "@tanstack/react-router";
import { allPosts } from "content-collections";
import { PostFooterCta } from "@/components/cta-footer";
import { Divider } from "@/components/divider";
import { MDX } from "@/components/mdx";
import { buildSeo, jsonLdScript } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

const findPage = (pathArr: string[]) => {
  const path = pathArr && pathArr.length > 0 ? `${pathArr.join("/")}` : "/";
  return allPosts.find((post) => post._meta.path === path);
};

export const Route = createFileRoute("/writing/$")({
  component: PostPage,
  loader: ({ params }) => {
    const splat = (params as { _splat?: string })._splat;
    const pathSegments = splat ? splat.split("/").filter(Boolean) : [];
    const page = findPage(pathSegments);

    if (!page) {
      throw notFound();
    }

    return { page };
  },
  head: ({ loaderData }) => {
    const post = loaderData?.page;

    if (!post) {
      return buildSeo({ path: "/writing", title: "Writing" });
    }

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Writing",
          item: `${SITE_URL}/writing`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: post.title,
          item: `${SITE_URL}/writing/${post.slug}`,
        },
      ],
    };

    return {
      ...buildSeo({
        path: `/writing/${post.slug}`,
        title: post.title,
        description: post.summary,
        image: post.image,
        type: "article",
        publishedTime: post.publishedAt,
        modifiedTime: post.lastModified,
      }),
      scripts: [
        jsonLdScript(post.structuredData),
        jsonLdScript(breadcrumbSchema),
      ],
    };
  },
});

function PostPage() {
  const { page } = Route.useLoaderData();

  if (!page) {
    throw notFound();
  }

  const publishedDate = new Date(page.publishedAt);
  const formattedDate = publishedDate.toLocaleDateString("sv-SE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div>
      <article className="mdx-content" id="post-start">
        <div className="mb-4 flex items-center gap-3 px-4 font-medium font-mono text-muted-foreground text-xs">
          <span className="font-bold text-emerald-400">#{page.edition}</span>
          <span className="text-border-foreground">·</span>
          <time>{formattedDate}</time>
          <span className="text-border-foreground">·</span>
          <span>{page.readingTime}</span>
        </div>
        <h1 className="mb-4 font-bold text-xl tracking-tight">{page.title}</h1>
        {page.leading && (
          <p className="mt-0 font-mono text-muted-foreground text-sm">
            {page.summary}
          </p>
        )}
        <Divider />
        <MDX code={page.mdx} />
      </article>

      <PostFooterCta />
    </div>
  );
}
