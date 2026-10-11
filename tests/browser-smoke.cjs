// Browser smoke test. Needs a running dev or preview server:  npm run dev  →  npm run test:browser
// PLAYWRIGHT_PATH overrides where Playwright is loaded from, PW_CHANNEL=chrome uses installed Chrome, TEST_URL the address.
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const base = process.env.TEST_URL || 'http://127.0.0.1:5173/app.html';
const SLIDES = 14;

(async () => {
  fs.mkdirSync('test-results', { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: process.env.PW_CHANNEL || undefined });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  const errors = []; page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  const layouts = [], failures = [];
  const open = async (n, lang = 'uz') => { await page.goto(`${base}?lang=${lang}#${n}`); await page.locator('.slide').first().waitFor(); };

  // 1. Every slide, three sizes (UZ) and projector size (RU, EN): renders, no horizontal overflow, no error boundary.
  const runs = [['uz', 1920, 1080], ['uz', 1366, 768], ['uz', 390, 844], ['ru', 1920, 1080], ['en', 1920, 1080]];
  for (const [lang, width, height] of runs) {
    await page.setViewportSize({ width, height });
    for (let n = 1; n <= SLIDES; n++) {
      await open(n, lang); await page.waitForTimeout(250);
      const r = await page.evaluate(() => { const m = document.querySelector('main'); return { hOverflow: document.documentElement.scrollWidth > innerWidth + 1, vScroll: m.scrollHeight - m.clientHeight, failed: !!document.querySelector('.slide-frame .notice h2') }; });
      layouts.push({ lang, width, height, slide: n, ...r });
      if (r.hOverflow || r.failed) failures.push(layouts.at(-1));
    }
  }

  await page.setViewportSize({ width: 1920, height: 1080 });
  // 2. No PDF anywhere; the legal slide is a table with 5 laws and Lex.uz links.
  await open(5);
  assert.equal(await page.locator('.law-table tbody tr').count(), 5);
  assert.equal(await page.locator('a[href*="lex.uz"]').count(), 5);
  assert.equal(await page.locator('object, a[href$=".pdf"]').count(), 0);

  // 3. Keyboard: → / ← navigation, chapter digits, sidebar toggle, notes, language cycling.
  await open(1); await page.locator('main').focus();
  await page.keyboard.press('ArrowRight'); assert.ok(page.url().endsWith('#2'));
  await page.keyboard.press('ArrowLeft'); assert.ok(page.url().endsWith('#1'));
  await page.keyboard.press('Digit4'); assert.ok(page.url().endsWith('#6'));
  const sidebarBefore = await page.locator('.app.with-sidebar').count();
  await page.keyboard.press('KeyB'); assert.notEqual(await page.locator('.app.with-sidebar').count(), sidebarBefore);
  await page.keyboard.press('KeyB');
  await page.keyboard.press('KeyN'); assert.equal(await page.locator('dialog[open]').count(), 1); await page.keyboard.press('Escape');
  await page.keyboard.press('KeyL'); assert.equal(await page.evaluate(() => document.documentElement.lang), 'ru');
  await page.keyboard.press('KeyL'); assert.equal(await page.evaluate(() => document.documentElement.lang), 'en');
  await page.getByRole('button', { name: 'UZ', exact: true }).click(); assert.equal(await page.evaluate(() => document.documentElement.lang), 'uz');

  // 4. Timers: T starts the lecture clock; the per-slide clock counts too.
  // The first → already started the clock automatically; make sure it is running.
  if (await page.getByRole('button', { name: 'Taymerni boshlash' }).count()) await page.keyboard.press('KeyT');
  await page.waitForTimeout(2300);
  assert.notEqual(await page.locator('.slide-timer b').innerText(), '00:00');
  assert.notEqual(await page.locator('.timer-box').nth(1).locator('b').innerText(), '00:00');
  await page.keyboard.press('KeyT');

  // 5. Agent lab: → drives the agent; it picks find_responsible itself; → at the gate approves; then the next slide.
  await open(7); await page.locator('main').focus();
  for (let i = 0; i < 8; i++) { await page.keyboard.press('ArrowRight'); assert.ok(page.url().endsWith('#7'), `press ${i}`); }
  assert.equal(await page.locator('.call code', { hasText: 'find_responsible' }).count(), 1);
  assert.equal(await page.locator('.call code', { hasText: 'send_notice' }).count(), 3);
  assert.equal(await page.locator('.stats').count(), 1);
  await page.keyboard.press('ArrowRight'); assert.ok(page.url().endsWith('#8'));
  // Mouse path: deny permission, then reject at the gate.
  await open(7);
  await page.getByRole('button', { name: 'Keyingi qadam' }).click(); await page.getByRole('button', { name: 'Keyingi qadam' }).click();
  await page.locator('.stage input[type=checkbox]').uncheck(); await page.getByRole('button', { name: 'Keyingi qadam' }).click();
  assert.equal(await page.locator('.call.denied').count(), 1); assert.equal(await page.getByRole('alert').count(), 1);
  await page.locator('.stage input[type=checkbox]').check();
  for (let i = 0; i < 4; i++) await page.getByRole('button', { name: 'Keyingi qadam' }).click();
  await page.locator('.draft.approve input').first().uncheck();
  await page.getByRole('button', { name: 'Rad etish' }).click();
  assert.equal(await page.locator('.call code', { hasText: 'send_notice' }).count(), 0);

  // 6. Build steps: case study (5) and dilemma (3) consume → before moving on.
  await open(9); await page.locator('main').focus();
  for (let i = 0; i < 5; i++) await page.keyboard.press('ArrowRight');
  assert.ok(page.url().endsWith('#9')); assert.ok((await page.locator('.case-steps li.on').innerText()).startsWith('6.'));
  await page.keyboard.press('ArrowRight'); assert.ok(page.url().endsWith('#10'));
  await open(11); await page.locator('main').focus();
  assert.equal(await page.locator('.who.shown').count(), 0);
  for (let i = 0; i < 3; i++) await page.keyboard.press('ArrowRight');
  assert.equal(await page.locator('.who.shown').count(), 1);
  await page.keyboard.press('ArrowRight'); assert.ok(page.url().endsWith('#12'));
  // Going back lands on the fully built dilemma.
  await page.keyboard.press('ArrowLeft'); assert.ok(page.url().endsWith('#11')); assert.equal(await page.locator('.who.shown').count(), 1);

  // 7. Reduced motion is respected.
  const reduced = await browser.newPage({ reducedMotion: 'reduce' }); await reduced.goto(base); assert.equal(await reduced.locator('.motion-paused').count(), 1); await reduced.close();

  fs.writeFileSync('test-results/browser-report.json', JSON.stringify({ errors, failures, layouts }, null, 2));
  assert.deepEqual(errors, []); assert.deepEqual(failures, []);
  const tall = layouts.filter(l => l.width >= 1366 && l.vScroll > 0).map(l => `${l.lang}@${l.width}#${l.slide}:${l.vScroll}px`);
  console.log(JSON.stringify({ checks: layouts.length, errors: errors.length, failures: failures.length, scrollsAtDesktop: tall, interactions: 'passed' }, null, 2));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
