import { createFileRoute, notFound } from "@tanstack/react-router";
import { allPosts } from "content-collections";
import { MDX } from "@/components/mdx";

const findPage = (pathArr: string[]) => {
  const path = pathArr && pathArr.length > 0 ? `${pathArr.join("/")}` : "/";
  return allPosts.find((post) => post._meta.path === path);
};

export const Route = createFileRoute("/posts/$")({
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
});

function PostPage() {
  const { page } = Route.useLoaderData();

  if (!page) {
    throw notFound();
  }

  return (
    <div className="min-h-screen w-full">
      <article className="prose-ui mx-auto w-full max-w-3xl px-4 py-8">
        <MDX code={page.mdx} />
      </article>
    </div>
  );
}
