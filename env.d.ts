/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/node" />

/**
 * Environment variables for the application
 */
interface Env {
  NODE_ENV: 'development' | 'production' | 'test';
  SESSION_SECRET: string;
  // Add other environment variables as needed
}

/**
 * Loader context for Remix
 */
interface AppLoadContext {
  env: Env;
  session: any;
}

/**
 * Session data stored in cookies
 */
interface SessionData {
  userId?: string;
  language?: string;
  country?: string;
  // Add other session data as needed
}
