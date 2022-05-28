interface ImportMetaEnv {
  // vite
  readonly MODE: string;
  readonly BASE_URL: string;
  readonly PROD: boolean;
  readonly DEV: boolean;
  // env
  readonly VITE_API_KEY: string;
  readonly VITE_APP_ID: string;
  readonly VITE_AUTH_DOMAIN: string;
  readonly VITE_DATABASE_URL: string;
  readonly VITE_MESSAGING_SENDER_ID: string;
  readonly VITE_PROJECT_ID: string;
  readonly VITE_STORAGE_BUCKET: string;
  readonly VITE_MEASUREMENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Fake type to avoid problems in "vue-gtag-next"
// See: https://github.com/MatteoGabriele/vue-gtag-next/issues/16
declare module "vue-gtag-next" {
  export type VueRouter = any;
}
declare module "vue-router/types/router" {
  export type Route = any;
}
