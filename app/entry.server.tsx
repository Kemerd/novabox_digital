import type { EntryContext, AppLoadContext } from '@shopify/remix-oxygen';
import { RemixServer } from '@remix-run/react';
import { isbot } from 'isbot';
import { renderToReadableStream } from 'react-dom/server';
import { createContentSecurityPolicy } from '@shopify/hydrogen';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  context: AppLoadContext,
) {
  const { nonce, header, NonceProvider } = createContentSecurityPolicy({
    shop: {
      checkoutDomain: context.env.PUBLIC_CHECKOUT_DOMAIN,
      storeDomain: context.env.PUBLIC_STORE_DOMAIN,
    },
    styleSrc: [
      "'self'",
      "'unsafe-inline'",
      "https://cdn.shopify.com",
      "http://localhost:*",
      "https://fonts.googleapis.com",
      "https://fonts.gstatic.com",
      "https://*.myshopify.com",
      "https://*.myshopify.dev",
    ],
    connectSrc: [
      "'self'",
      "https://monorail-edge.shopifysvc.com",
      "https://monorail-edge.shopifysvc.com",
      "https://events.shopifyanalytics.com",
      "https://o.b.a.shopify.com",
      "https://checkout.shopify.com",
      "https://shop.app",
      `https://${context.env.PUBLIC_CHECKOUT_DOMAIN}`,
      `https://${context.env.PUBLIC_STORE_DOMAIN}`,
      "https://*.myshopify.com",
      "https://*.myshopify.dev",
      "http://localhost:*",
      "ws://localhost:*",
      "ws://127.0.0.1:*",
      "ws://*.tryhydrogen.dev:*",
      "https://raw.githack.com",
      "https://www.facebook.com",
    ],
    imgSrc: [
      "'self'",
      "data:",
      "https://cdn.shopify.com",
      `https://${context.env.PUBLIC_STORE_DOMAIN}`,
      "https://*.shopify.com",
      "https://*.shopifycdn.com",
      "https://www.facebook.com",
    ],
    scriptSrc: [
      "'self'",
      // Note: nonce will be added automatically by NonceProvider
      "https://cdn.shopify.com",
      "https://shopify.com",
      "http://localhost:*",
      "https://*.myshopify.com",
      "https://*.myshopify.dev",
      "https://shop.app",
      `https://${context.env.PUBLIC_CHECKOUT_DOMAIN}`,
      "'strict-dynamic'",
      "https://connect.facebook.net",
    ],
    defaultSrc: [
      "'self'",
      "https://cdn.shopify.com",
      "https://shopify.com",
      "http://localhost:*",
      "'unsafe-eval'", // Required for WebAssembly
    ],
    // Allow frames for Web Pixels and checkout
    frameSrc: [
      "'self'",
      "https://shop.app",
      "https://checkout.shopify.com",
      `https://${context.env.PUBLIC_CHECKOUT_DOMAIN}`,
    ],
  });

  const body = await renderToReadableStream(
    <NonceProvider>
      <RemixServer context={remixContext} url={request.url} nonce={nonce} />
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  responseHeaders.set('Content-Security-Policy', header);

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
