// import.meta.env.NAME

declare interface Env {
  readonly NODE_ENV: string;
  readonly NG_APP_API_KEY: string;
}

declare interface ImportMeta {
  readonly env: Env;
}
