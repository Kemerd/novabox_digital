// Virtual entry point for the app
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import * as remixBuild from 'virtual:remix/server-build';
import { storefrontRedirect } from '@shopify/hydrogen';
import { createRequestHandler } from '@shopify/remix-oxygen';
import { createAppLoadContext } from '~/lib/context';
import { createServer } from 'vite';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Handle proxied HDR requests
 */
async function handleHDRProxy(request: Request) {
  const url = new URL(request.url);
  if (url.pathname.startsWith('/assets/env/')) {
    // Map our proxy path to the githubusercontent URL
    const hdrFile = url.pathname.split('/assets/env/')[1];
    const githubUrl = `https://raw.githubusercontent.com/pmndrs/drei-assets/456060a26bbeb8fdf79326f224b6d99b8bcce736/hdri/${hdrFile}`;

    try {
      const response = await fetch(githubUrl);
      if (!response.ok) throw new Error(`Failed to fetch HDR: ${response.status}`);

      // Forward the HDR file with appropriate headers
      return new Response(response.body, {
        headers: {
          'Content-Type': 'application/octet-stream',
          'Cache-Control': 'public, max-age=31536000',
          'Access-Control-Allow-Origin': '*'
        }
      });
    } catch (error) {
      console.error('HDR proxy error:', error);
      return new Response('Failed to load environment map', { status: 500 });
    }
  }
  return null;
}

async function startServer() {
  const app = express();
  
  // Handle HDR file requests for 3D environment maps
  app.get('/assets/env/:file', async (req, res) => {
    const hdrFile = req.params.file;
    const githubUrl = `https://raw.githubusercontent.com/pmndrs/drei-assets/456060a26bbeb8fdf79326f224b6d99b8bcce736/hdri/${hdrFile}`;

    try {
      const response = await fetch(githubUrl);
      if (!response.ok) throw new Error(`Failed to fetch HDR: ${response.status}`);

      // Forward the HDR file with appropriate headers
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Cache-Control', 'public, max-age=31536000');
      res.setHeader('Access-Control-Allow-Origin', '*');
      
      response.body.pipe(res);
    } catch (error) {
      console.error('HDR proxy error:', error);
      res.status(500).send('Failed to load environment map');
    }
  });

  // Create Vite server in middleware mode and configure the app type as
  // 'custom', disabling Vite's own HTML serving logic
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom'
  });

  // Use vite's connect instance as middleware
  app.use(vite.middlewares);

  // Serve static files from the public directory
  app.use(express.static(path.resolve(__dirname, 'public')));

  // All other requests are rendered as SPA
  app.use('*', async (req, res) => {
    try {
      // If index.html exists in public, serve that
      const indexPath = path.resolve(__dirname, 'public/index.html');
      if (fs.existsSync(indexPath)) {
        let html = fs.readFileSync(indexPath, 'utf-8');
        html = await vite.transformIndexHtml(req.originalUrl, html);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      } else {
        // Otherwise, 404
        res.status(404).send('Not found');
      }
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      console.error(e);
      res.status(500).end('Internal Server Error');
    }
  });

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}

startServer();
