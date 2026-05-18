const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const indexHtml = path.join(__dirname, '..', '..', 'client', 'out', 'index.html');

if (fs.existsSync(indexHtml)) {
  process.exit(0);
}

console.log('[Modepro] client/out not found — building frontend…');
execSync('npm run build --prefix client', {
  cwd: path.join(__dirname, '..', '..'),
  stdio: 'inherit',
  env: process.env,
});

if (!fs.existsSync(indexHtml)) {
  console.error('[Modepro] Build failed: client/out/index.html still missing.');
  process.exit(1);
}
