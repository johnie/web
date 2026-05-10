/// <reference types="vite/client" />

import {
  createRootRoute,
  HeadContent,
  Link,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import type * as React from "react";
import { Logo } from "@/components/logo";
import appCss from "@/styles/app.css?url";

export const Route = createRootRoute({
  head: () => ({
    links: [{ rel: "stylesheet", href: appCss }],
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
          <div className="sticky top-0 z-50 border-accent border-b-2 bg-background/70 backdrop-blur-md">
            <header className="mx-auto flex w-full max-w-3xl items-center justify-between border-accent border-r-2 border-l-2 px-4 py-4">
              <div>
                <Link to="/">
                  <Logo height={24} width={21} />
                </Link>
              </div>
              <div className="space-x-4">
                <Link to="/">Home</Link>
                <Link to="/writing">Writing</Link>
                <Link to="/about">About</Link>
              </div>
            </header>
          </div>

          <main className="mx-auto w-full max-w-3xl flex-1 border-accent border-r-2 border-l-2 py-4">
            {children}
          </main>
        </div>
        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
      </body>
    </html>
  );
}
