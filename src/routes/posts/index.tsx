import { createFileRoute, Link } from "@tanstack/react-router";
import { allPosts } from "content-collections";

export const Route = createFileRoute("/posts/")({
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
    <main className="mx-auto w-full max-w-3xl px-4 py-8">
      <h1 className="mb-6 font-semibold text-2xl">Posts</h1>
      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post._meta.path}>
            <Link
              className="block"
              params={{ _splat: post._meta.path }}
              to="/posts/$"
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
    </main>
  );
}
