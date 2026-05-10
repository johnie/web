import { createFileRoute, notFound } from "@tanstack/react-router";
import { allPages } from "content-collections";
import { MDX } from "@/components/mdx";

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
