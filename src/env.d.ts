/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MODE: string
  readonly DEV: boolean
  // Add more env vars here if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
