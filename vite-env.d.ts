/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BUILD_GIT_SHA: string;
  readonly VITE_BUILD_GIT_SHA_URL: string;
  readonly VITE_BUILD_TIME: string;
  readonly VITE_BUILD_VERSION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
