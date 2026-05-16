import { MDXContent } from "@content-collections/mdx/react";
import type { Link } from "@tanstack/react-router";
import { Link as RouterLink } from "@tanstack/react-router";
import type { ImgHTMLAttributes } from "react";
import { Callout as CalloutComponent } from "./callout";
import { Badge } from "./ui/badge";

type CustomLinkProps = React.ComponentProps<typeof Link> & {
  children?: React.ReactNode;
} & React.ComponentProps<"a">;

const CustomLink: React.FC<CustomLinkProps> = (props) => {
  const href = props.href;

  if (typeof href === "string" && href.startsWith("/")) {
    return <RouterLink {...props}>{props.children}</RouterLink>;
  }

  if (typeof href === "string" && href.startsWith("#")) {
    return <a {...props} />;
  }

  return <a rel="noopener noreferrer" target="_blank" {...props} />;
};

type CustomImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  alt: string;
};

const RoundedImage: React.FC<CustomImageProps> = ({ alt, ...props }) => (
  <img alt={alt} height="auto" width="auto" {...props} />
);

export function MDX({ code }: { code: string }) {
  return <MDXContent code={code} components={components} />;
}

const Callout = (props: React.ComponentProps<typeof CalloutComponent>) => (
  <div className="mx-4 my-6">
    <CalloutComponent {...props} />
  </div>
);

export const components = {
  a: CustomLink,
  img: RoundedImage,
  Image: RoundedImage,
  Badge,
  Callout,
};

export type MDXComponents = typeof components;
