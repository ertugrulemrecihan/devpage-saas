/**
 * An array of routes that are accessible to the public.
 * These routes do not require authentication.
 * @type {string[]}
 */
export const publicRoutes = ['/', '/auth/new-verification', '/api/uploadthing'];

/**
 * An array of routes that are private.
 * These routes do require authentication.
 * @type {string[]}
 */
export const privateRoutes = ['/panel', '/settings'];

/**
 * An array of routes that are used for error handling.
 * These routes are used to display error pages.
 * @type {string[]}
 */
export const errorRoutes = ['/404'];

/**
 * An array of routes that are used for authentication.
 * These routes will redirect logged in users to the settings.
 * @type {string[]}
 */
export const authRoutes = [
  '/auth/login',
  '/auth/register',
  '/auth/reset',
  '/auth/new-password',
  '/auth/error',
];

/**
 * The prefix for API authentication routes.
 * Routes that start this prefix are used for API authentication process.
 * @type {string}
 */
export const apiAuthPrefix = '/api/auth';

/**
 * The default redirect path after logged in.
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = '/panel';
