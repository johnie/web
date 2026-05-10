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
    <section className="space-y-6 px-4">
      <h1 className="font-bold font-mono text-xl tracking-tight">
        Johnie Hjelm.
      </h1>
      <p className="text-muted-foreground">
        Since my teenage years, I have engaged in both design and coding,
        unwilling to be confined to just one specialty. I have excelled as a
        Jack of all Trades across different teams, engaging in a wide range of
        tasks from graphic and digital design to both frontend and backend
        development, along with product and API strategy.
      </p>
      <p className="text-muted-foreground">
        In addition to technology, I have a strong enthusiasm for efficient team
        management and intelligent work habits. I think a team‘s wellness is
        crucial for effective operations, and although ideas inspire innovation,
        it‘s the execution that leads to success.
      </p>
    </section>
  );
}
