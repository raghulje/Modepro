require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3002;

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
