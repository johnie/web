import { createFileRoute } from "@tanstack/react-router";
import { allNotes } from "content-collections";
import { Divider } from "@/components/divider";
import { MDX } from "@/components/mdx";
import { buildSeo } from "@/lib/seo";

const DEFAULT_DESCRIPTION =
  "Short notes, discoveries about development, tools, and technology.";

export const Route = createFileRoute("/notes/")({
  head: () =>
    buildSeo({
      path: "/notes",
      title: "Notes",
      description: DEFAULT_DESCRIPTION,
    }),
  component: NotesIndex,
  loader: () => ({
    notes: [...allNotes].sort((a, b) =>
      b.publishedAt.localeCompare(a.publishedAt)
    ),
  }),
});

function NotesIndex() {
  const { notes } = Route.useLoaderData();

  return (
    <section>
      <div className="space-y-16">
        {notes.map((note) => {
          const formattedDate = new Date(note.publishedAt).toLocaleDateString(
            "sv-SE",
            {
              year: "numeric",
              month: "long",
              day: "numeric",
            }
          );

          return (
            <article
              className="mdx-content"
              id={note.slug}
              key={note._meta.path}
            >
              <Divider className="notes-divider" />
              <MDX code={note.mdx} />
              <div className="mx-4 flex items-center gap-3 font-medium font-mono text-muted-foreground text-xs">
                <time dateTime={note.publishedAt}>{formattedDate}</time>
                {note.type && (
                  <>
                    <span className="text-border-foreground">·</span>
                    <span>{note.type}</span>
                  </>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
