import { cloudflare } from "@cloudflare/vite-plugin";
import contentCollections from "@content-collections/vite";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import buildMetadataPlugin from "./tools/vite/build-metadata";

export default defineConfig({
  server: {
    port: 3000,
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    buildMetadataPlugin(),
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tanstackStart(),
    contentCollections(),
    viteReact(),
    tailwindcss(),
  ],
});
