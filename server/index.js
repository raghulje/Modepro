const path = require('path');
require('dotenv').config({
  path: path.join(__dirname, '.env'),
  override: true,
});
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = Number(process.env.PORT) || 3020;

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

const clientOut = path.join(__dirname, '..', 'client', 'out');
app.use(express.static(clientOut));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  const indexPath = path.join(clientOut, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) next();
  });
});

app.listen(PORT, () => {
  console.log(`Modepro API server listening on http://localhost:${PORT}`);
});
