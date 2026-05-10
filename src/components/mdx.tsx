import { MDXContent } from "@content-collections/mdx/react";
import type { Link } from "@tanstack/react-router";
import { Link as RouterLink } from "@tanstack/react-router";
import type { ImgHTMLAttributes } from "react";
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
  <img alt={alt} className="my-4" height="auto" width="auto" {...props} />
);

export function MDX({ code }: { code: string }) {
  return <MDXContent code={code} components={components} />;
}

export const components = {
  a: CustomLink,
  img: RoundedImage,
  Image: RoundedImage,
  Badge,
};

export type MDXComponents = typeof components;
