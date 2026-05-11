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
      <h1 className="mb-2 font-semibold text-3xl tracking-tight">Notes</h1>
      <p className="mb-8 max-w-2xl text-base/7 opacity-80">
        {DEFAULT_DESCRIPTION}
      </p>
      <div className="space-y-10">
        {notes.map((note, index) => {
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
              <MDX code={note.mdx} />
              <div className="mx-4 mb-4 flex items-center gap-3 font-medium font-mono text-muted-foreground text-xs">
                <time dateTime={note.publishedAt}>{formattedDate}</time>
                {note.type && (
                  <>
                    <span className="text-border-foreground">·</span>
                    <span>{note.type}</span>
                  </>
                )}
              </div>
              {index < notes.length - 1 ? <Divider /> : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
