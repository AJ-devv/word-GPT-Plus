/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MODE: string;
  readonly DEV: boolean;
  readonly VITE_OPENAI_KEY: string; // ✅ required
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
