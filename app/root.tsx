import {
  Links,
  Meta,
  Outlet,
  Scripts,
  useRouteError,
  ScrollRestoration,
  isRouteErrorResponse,
} from '@remix-run/react';
import favicon from '~/assets/favicon.svg';
import resetStyles from '~/styles/reset.css?url';
import appStyles from '~/styles/app.css?url';
import contactStyles from '~/styles/contact.css?url';
import { PageLayout } from '~/components/PageLayout';
import { useEffect } from 'react';

// Static site configuration for GitHub Pages
export const siteConfig = {
  siteInfo: {
    title: 'NovaBox Digital',
    description: 'We make software that doesn\'t suck.',
  },
  navigationLinks: [
    { title: 'Home', url: '/' },
    { title: 'Services', url: '/services' },
    { title: 'About', url: '/about' },
    { title: 'Contact', url: '/contact' },
    { title: 'Blog', url: '/blog' },
  ]
};

/**
 * The main and reset stylesheets are added in the Layout component
 * to prevent a bug in development HMR updates.
 *
 * This avoids the "failed to execute 'insertBefore' on 'Node'" error
 * that occurs after editing and navigating to another page.
 *
 * It's a temporary fix until the issue is resolved.
 * https://github.com/remix-run/remix/issues/9242
 */
export function links() {
  return [
    { rel: 'icon', type: 'image/svg+xml', href: favicon },
    // Display fonts for headlines - add crossOrigin
    {
      rel: 'preload',
      href: '/fonts/inter/InterDisplay-Bold.woff2',
      as: 'font',
      type: 'font/woff2',
      crossOrigin: 'anonymous',
    },
    {
      rel: 'preload',
      href: '/fonts/inter/InterDisplay-Medium.woff2',
      as: 'font',
      type: 'font/woff2',
      crossOrigin: 'anonymous',
    },
    // Text fonts for body copy - add crossOrigin
    {
      rel: 'preload',
      href: '/fonts/inter/Inter-Regular.woff2',
      as: 'font',
      type: 'font/woff2',
      crossOrigin: 'anonymous',
    },
    {
      rel: 'preload',
      href: '/fonts/inter/Inter-Medium.woff2',
      as: 'font',
      type: 'font/woff2',
      crossOrigin: 'anonymous',
    },
    // Add style tag to ensure fonts are loaded before rendering
    {
      rel: 'stylesheet',
      href: resetStyles,
    },
    {
      rel: 'stylesheet',
      href: appStyles,
    },
    {
      rel: 'stylesheet',
      href: contactStyles,
    },
  ];
}

export function Layout({ children }: { children?: React.ReactNode }) {
  useEffect(() => {
    // Reset scroll position
    const scrollTimer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);

    // Add loaded class to enable gradient
    const loadTimer = setTimeout(() => {
      document.body.classList.add('loaded');
    }, 100);

    return () => {
      clearTimeout(scrollTimer);
      clearTimeout(loadTimer);
    };
  }, []);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="theme-color" content="#0A0A0A" />
        <link rel="stylesheet" href={resetStyles}></link>
        <link rel="stylesheet" href={appStyles}></link>
        <Meta />
        <Links />
      </head>
      <body>
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: '#0A0A0A',
          zIndex: -1
        }} />
        <PageLayout>{children}</PageLayout>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  let heading = 'Something went wrong';
  let message = 'We apologize for the inconvenience. Please try again later.';

  if (isRouteErrorResponse(error)) {
    heading = `${error.status} ${error.statusText}`;
    message = error.data;
  } else if (error instanceof Error) {
    heading = 'Error';
    message = error.message;
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="theme-color" content="#0A0A0A" />
        <link rel="stylesheet" href={resetStyles}></link>
        <link rel="stylesheet" href={appStyles}></link>
        <Meta />
        <Links />
      </head>
      <body>
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: '#0A0A0A',
          zIndex: -1
        }} />
        <div className="error-container">
          <h1>{heading}</h1>
          <p>{message}</p>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
