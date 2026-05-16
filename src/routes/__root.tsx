/// <reference types="vite/client" />

import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import type * as React from "react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_KEYWORDS,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";
import appCss from "@/styles/app.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { title: SITE_NAME },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "description", content: DEFAULT_DESCRIPTION },
      { name: "author", content: SITE_NAME },
      { name: "keywords", content: DEFAULT_KEYWORDS.join(", ") },
      { name: "robots", content: "index, follow" },
      {
        name: "googlebot",
        content:
          "index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico" },
      {
        rel: "alternate",
        type: "application/rss+xml",
        href: `${SITE_URL}/feed.xml`,
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html className="dark" lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <div className="flex min-h-screen w-full flex-col">
          <Header />
          <main className="mx-auto w-full max-w-2xl flex-1 border-accent border-r-2 border-l-2">
            {children}
          </main>
          <Footer />
        </div>
        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
      </body>
    </html>
  );
}
