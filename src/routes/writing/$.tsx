import { createFileRoute, notFound } from "@tanstack/react-router";
import { allPosts } from "content-collections";
import { PostFooterCta } from "@/components/cta-footer";
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

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <article className="mdx-content" id="post-start">
        <h1 className="mb-0 text-2xl">{page.title}</h1>
        <MDX code={page.mdx} />
      </article>

      <PostFooterCta />
    </div>
  );
}
