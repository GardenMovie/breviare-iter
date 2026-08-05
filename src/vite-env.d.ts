/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_CLIENT_ID: string
  /** Short-link domain used to build /u/<username> URLs. Defaults to the current origin. */
  readonly VITE_BASE_URL?: string
  readonly VITE_UNDER_CONSTRUCTION?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
