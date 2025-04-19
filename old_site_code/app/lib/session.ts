import { createCookieSessionStorage } from '@remix-run/server-runtime';

/**
 * A simple session implementation for Remix
 */
export class AppSession {
  private sessionStorage: ReturnType<typeof createCookieSessionStorage>;
  private session: any;
  public isPending = false;

  /**
   * Constructor for AppSession
   * 
   * @param sessionStorage - The session storage mechanism
   * @param session - The current session
   */
  constructor(sessionStorage: ReturnType<typeof createCookieSessionStorage>, session: any) {
    this.sessionStorage = sessionStorage;
    this.session = session;
  }

  /**
   * Initialize a session from a request
   * 
   * @param request - The incoming request
   * @param secrets - The secret keys for the session
   * @returns A new AppSession instance
   */
  static async init(request: Request, secrets: string[]) {
    const sessionStorage = createCookieSessionStorage({
      cookie: {
        name: 'app_session',
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        secrets,
        secure: process.env.NODE_ENV === 'production',
      },
    });

    const session = await sessionStorage.getSession(
      request.headers.get('Cookie'),
    );

    return new AppSession(sessionStorage, session);
  }

  /**
   * Check if the session has a key
   */
  get has() {
    return (key: string) => this.session.has(key);
  }

  /**
   * Get a value from the session
   */
  get get() {
    return <T = any>(key: string): T => this.session.get(key);
  }

  /**
   * Get and remove a value from the session (flash)
   */
  get flash() {
    return <T = any>(key: string): T => this.session.flash(key);
  }

  /**
   * Remove a value from the session
   */
  get unset() {
    return (key: string) => this.session.unset(key);
  }

  /**
   * Set a value in the session
   */
  get set() {
    return <T = any>(key: string, value: T) => this.session.set(key, value);
  }

  /**
   * Destroy the session
   */
  destroy() {
    return this.sessionStorage.destroySession(this.session);
  }

  /**
   * Commit the session to a cookie header
   */
  commit() {
    return this.sessionStorage.commitSession(this.session);
  }
}
