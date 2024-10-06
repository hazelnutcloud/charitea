/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SERVER_URL: string
  readonly VITE_PROJECT_ID: string
  readonly VITE_WORLDID_APP_ID: string
  readonly VITE_PINATA_GATEWAY: string
  readonly VITE_PINATA_JWT: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
