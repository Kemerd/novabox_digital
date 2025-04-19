import { RemixServer } from '@remix-run/react';
import { isbot } from 'isbot';
import { renderToReadableStream } from 'react-dom/server';
import type { EntryContext } from '@remix-run/server-runtime';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  // Define basic security headers
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval';
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' data: https://raw.githack.com;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' ws://localhost:* ws://127.0.0.1:*;
    frame-src 'self';
    object-src 'none';
  `.trim().replace(/\s+/g, ' ');

  const body = await renderToReadableStream(
    <RemixServer context={remixContext} url={request.url} />,
    {
      signal: request.signal,
      onError(error) {
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  // For bots, wait for the stream to be fully ready for SEO purposes
  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  responseHeaders.set('Content-Security-Policy', cspHeader);

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
