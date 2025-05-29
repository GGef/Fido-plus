/// <reference path="../.astro/types.d.ts" />

/// <reference types="vite/client" />

interface ImportMetaEnv extends Readonly<Record<string, string>> {
  readonly VITE_API_BASE_URL: string;
  // plus env variables...
}