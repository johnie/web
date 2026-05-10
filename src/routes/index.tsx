import { createFileRoute } from "@tanstack/react-router";
import { buildSeo, jsonLdScript } from "@/lib/seo";
import { DEFAULT_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description: DEFAULT_DESCRIPTION,
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE_NAME,
  url: SITE_URL,
  description: DEFAULT_DESCRIPTION,
};

export const Route = createFileRoute("/")({
  head: () => ({
    ...buildSeo({ path: "/", description: DEFAULT_DESCRIPTION }),
    scripts: [jsonLdScript([websiteSchema, personSchema])],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section className="space-y-6 px-4 py-8">
      <h1 className="font-semibold text-3xl tracking-tight">
        Developer, engineering leader, and inclusive tech advocate.
      </h1>
      <p className="max-w-2xl text-base/7 opacity-80">
        I write about AI-augmented engineering, leadership, inclusive teams, and
        the systems that help people do their best work.
      </p>
      <p className="max-w-2xl text-base/7 opacity-80">
        Start with the writing archive for essays and notes, or read more about
        my work and approach on the about page.
      </p>
    </section>
  );
}
