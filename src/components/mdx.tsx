import { MDXContent } from "@content-collections/mdx/react";
import { mdxComponents } from "@prose-ui/react";
import { Link as RouterLink } from "@tanstack/react-router";

export function MDX({ code }: { code: string }) {
  return <MDXContent code={code} components={mdxComponents} />;
}

export const components = {
  a: (props: React.ComponentPropsWithoutRef<"a">) => {
    const href = props.href || "";
    const isExternal = href.startsWith("http");
    if (isExternal) {
      return (
        <a
          {...props}
          className="text-blue-600 hover:underline"
          rel="noopener noreferrer"
          target="_blank"
        />
      );
    }
    return (
      <RouterLink
        {...props}
        className="text-blue-600 hover:underline"
        to={href}
      />
    );
  },
};

export type MDXComponents = typeof components;
