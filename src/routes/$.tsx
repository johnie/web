import { createFileRoute, notFound } from "@tanstack/react-router";
import { allPages } from "content-collections";
import { MDX } from "@/components/mdx";
import { buildSeo, jsonLdScript } from "@/lib/seo";
import { absoluteUrl, SITE_NAME, SITE_URL } from "@/lib/site";

const findPage = (splat?: string) => {
  const path = splat?.split("/").filter(Boolean).join("/") ?? "";
  return allPages.find((page) => page._meta.path === path);
};

export const Route = createFileRoute("/$")({
  component: Page,
  loader: ({ params }) => {
    const page = findPage(params._splat);

    if (!page) {
      throw notFound();
    }

    return { page };
  },
  head: ({ loaderData }) => {
    const page = loaderData?.page;

    if (!page) {
      return buildSeo({ path: "/" });
    }

    const schema =
      page.slug === "about"
        ? {
            "@context": "https://schema.org",
            "@type": "Person",
            name: SITE_NAME,
            url: SITE_URL,
            description: page.summary,
            image: absoluteUrl("/images/johnie-omni.jpg"),
          }
        : {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: page.title,
            description: page.summary,
            url: absoluteUrl(`/${page.slug}`),
          };

    return {
      ...buildSeo({
        path: `/${page.slug}`,
        title: page.title,
        description: page.summary,
        image: page.image,
      }),
      scripts: [jsonLdScript(schema)],
    };
  },
});

function Page() {
  const { page } = Route.useLoaderData();

  return (
    <article className="mdx-content" id="page-start">
      <h1 className="mb-0 text-2xl">{page.title}</h1>
      <MDX code={page.mdx} />
    </article>
  );
}
