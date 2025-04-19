// Virtual entry point for the app
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import type { Request, Response } from 'express';

/**
 * Handles requests for HDR files by fetching them from GitHub
 * and forwarding them with the correct headers.
 */
async function handleHDRProxy(req: Request, res: Response) {
  const hdrPath = req.path.replace('/hdr/', '');
  const githubURL = `https://github.com/google/material-design-icons/raw/master/src/av/hdr_off/materialiconsoutlined/24px.svg/${hdrPath}`;

  try {
    const response = await fetch(githubURL);
    
    if (!response.ok) {
      console.error(`Failed to fetch HDR from GitHub: ${response.status} ${response.statusText}`);
      res.status(404).send('Not found');
      return;
    }

    // Forward headers
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    // Set additional headers if needed
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Forward the body
    if (response.body) {
      response.body.pipe(res);
    } else {
      // Handle case where response.body is null
      const text = await response.text();
      res.send(text);
    }
  } catch (error) {
    console.error('Error proxying HDR request:', error);
    res.status(500).send('Server Error');
  }
}

/**
 * Starts the server, setting up:
 * - Express to handle API routes
 * - Vite to serve the application in development
 * - Static file serving
 */
async function startServer() {
  const app = express();
  const port = process.env.PORT || 3000;

  // Handle HDR file requests
  app.use('/hdr/', handleHDRProxy);

  // Create a Vite server in middleware mode
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });

  // Use Vite's connect instance as middleware
  app.use(vite.middlewares);

  // Serve static files
  app.use(express.static('public'));

  // Serve all other requests as a SPA
  app.use('*', (req: Request, res: Response) => {
    // Read the index.html file
    const indexPath = path.resolve('dist', 'index.html');
    
    if (fs.existsSync(indexPath)) {
      // Serve the built index.html in production
      const html = readFileSync(indexPath, 'utf-8');
      res.send(html);
    } else {
      // In development, serve a simple HTML that loads the entry
      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Novabox LLC</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <script type="module" src="/src/entry.client.tsx"></script>
          </head>
          <body>
            <div id="root"></div>
          </body>
        </html>
      `);
    }
  });

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
});
