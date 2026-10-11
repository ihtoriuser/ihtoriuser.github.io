// Browsers refuse ES-module scripts from file://, so the offline build ships one classic,
// deferred script (the bundle is IIFE, see vite.config.js).
import { readFileSync, renameSync, writeFileSync } from 'node:fs';

renameSync('dist-offline/app.html', 'dist-offline/index.html');
const file = 'dist-offline/index.html';
let html = readFileSync(file, 'utf8');
const tag = html.match(/<script type="module" crossorigin src="([^"]+)"><\/script>/);
if (!tag) throw new Error('module script tag not found');
html = html.replace(tag[0], '').replace(/ crossorigin/g, '').replace('</body>', `<script defer src="${tag[1]}"></script></body>`);
writeFileSync(file, html);
console.log('Offline build ready: open dist-offline/index.html');
