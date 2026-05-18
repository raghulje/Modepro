const path = require('path');
const fs = require('fs');
require('dotenv').config({
  path: path.join(__dirname, '.env'),
  override: true,
});
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = Number(process.env.PORT) || 3049;
const clientOut = path.join(__dirname, '..', 'client', 'out');
const indexHtml = path.join(clientOut, 'index.html');
const hasClientBuild = fs.existsSync(indexHtml);

app.set('trust proxy', true);

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Origin'],
  })
);

app.use(express.json({ limit: '1mb' }));

app.use('/api/geo', require('./routes/geo'));
app.use('/api/contact-submissions', require('./routes/contactSubmissions'));

// Chrome DevTools probes this path; ignore to avoid noisy 404s in the console.
app.get('/.well-known/*', (_req, res) => res.status(204).end());

if (hasClientBuild) {
  app.use(express.static(clientOut));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(indexHtml, (err) => {
      if (err) next(err);
    });
  });
} else {
  app.get('/', (_req, res) => {
    res.status(503).type('html').send(`<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Modepro — build required</title></head>
<body style="font-family:system-ui,sans-serif;max-width:36rem;margin:3rem auto;padding:0 1rem">
<h1>Frontend build not found</h1>
<p>Run from the project root:</p>
<pre style="background:#f4f4f4;padding:1rem">npm run build
npm start</pre>
<p>For local development (hot reload), use:</p>
<pre style="background:#f4f4f4;padding:1rem">npm run dev</pre>
<p>Then open <a href="http://localhost:5173">http://localhost:5173</a> (not port ${PORT}).</p>
</body></html>`);
  });

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.redirect('/');
  });
}

app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, message: 'API route not found' });
  }
  res.status(404).send('Not found');
});

app.listen(PORT, () => {
  console.log(`Modepro API server listening on http://localhost:${PORT}`);
  if (!hasClientBuild) {
    console.warn(
      '\n[Modepro] client/out is missing — run "npm run build" before "npm start", or use "npm run dev" for development.\n'
    );
  }
});
