// Copies the production build to the repository root, which GitHub Pages serves.
import { cpSync, existsSync, readdirSync, rmSync, writeFileSync } from 'node:fs';

if (!existsSync('dist/app.html')) throw new Error('Run `vite build` first.');
rmSync('assets', { recursive: true, force: true });
cpSync('dist/assets', 'assets', { recursive: true });
cpSync('dist/app.html', 'index.html');
// Everything else from public/ (favicon, avatar, …) lands next to index.html.
for (const f of readdirSync('dist')) if (f !== 'app.html' && f !== 'assets') cpSync(`dist/${f}`, f, { recursive: true });
writeFileSync('.nojekyll', '');
console.log('Site published to ./index.html + ./assets — commit and push to update https://ihtoriuser.github.io/');
