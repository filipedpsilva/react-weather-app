/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_BASE_API_URL: string;
    readonly VITE_API_KEY: string;
    readonly VITE_ACCESS_KEY: string;
    readonly VITE_BASE_URL: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  