import { createFileRoute, Link } from "@tanstack/react-router";
import { allPosts } from "content-collections";
import { buildSeo } from "@/lib/seo";

export const Route = createFileRoute("/writing/")({
  head: () =>
    buildSeo({
      path: "/writing",
      title: "Writing",
      description:
        "Essays and notes on AI-augmented engineering, leadership, productivity, and building inclusive teams.",
    }),
  component: PostsIndex,
  loader: () => ({
    posts: [...allPosts].sort((a, b) =>
      b.publishedAt.localeCompare(a.publishedAt)
    ),
  }),
});

function PostsIndex() {
  const { posts } = Route.useLoaderData();

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-8">
      <h1 className="mb-2 font-semibold text-3xl tracking-tight">Writing</h1>
      <p className="mb-8 max-w-2xl text-base/7 opacity-80">
        Thoughts on AI-augmented engineering, leadership, productivity, and the
        habits behind better software teams.
      </p>
      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post._meta.path}>
            <Link
              className="block"
              params={{ _splat: post._meta.path }}
              to="/writing/$"
            >
              <h2 className="font-medium text-lg">{post.title}</h2>
              <p className="text-sm opacity-70">{post.summary}</p>
              <time className="text-xs opacity-50" dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString()}
              </time>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
