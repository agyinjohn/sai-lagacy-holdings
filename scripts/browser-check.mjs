// Browser checks at mobile (360) and desktop (1440). Usage:
//   npm run build && npm start   (in one terminal, with TEAM_* set)
//   BASE_URL=http://localhost:3000 TEAM_USERNAME=... TEAM_PASSWORD=... npm run test:e2e
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const BASE = process.env.BASE_URL ?? 'http://localhost:3000';
const USER = process.env.TEAM_USERNAME ?? 'team-demo';
const PASS = process.env.TEAM_PASSWORD ?? 'demo-password-123';
const exe = process.env.CHROMIUM_PATH ?? (process.env.PW_USE_SYSTEM ? '/opt/pw-browsers/chromium' : undefined);

const PAGES = ['/', '/vision', '/culture', '/hospitality', '/wellness', '/later-life', '/serviced-plots', '/investment', '/journal', '/contact', '/privacy', '/register',
  '/register/legacy-unit', '/register/transformation-retreat', '/register/assisted-living', '/register/retirement-village', '/register/serviced-plots', '/register/guest-updates', '/register/contact', '/team'];
const PATHWAYS = ['legacy-unit', 'transformation-retreat', 'assisted-living', 'retirement-village', 'serviced-plots', 'guest-updates', 'contact'];

let failures = 0;
const ok = (cond, msg) => { if (!cond) { failures++; console.log('  FAIL', msg); } else console.log('  ok  ', msg); };

const browser = await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] });

for (const [label, width, height, mobile] of [['mobile 360', 360, 740, true], ['desktop 1440', 1440, 900, false]]) {
  console.log(`\n== ${label} ==`);
  const ctx = await browser.newContext({ viewport: { width, height }, acceptDownloads: true, isMobile: mobile, hasTouch: mobile, extraHTTPHeaders: { 'x-forwarded-for': `10.0.${width % 250}.${Math.floor(Math.random() * 250)}` } });
  const page = await ctx.newPage();
  const consoleErrors = [];
  page.on('console', (m) => { if (m.type() === 'error' && !/status of 429/.test(m.text())) consoleErrors.push(m.text()); });
  page.on('response', async (r) => { if (r.url().includes('/api/register') && r.status() >= 400 && r.status() !== 429) console.log('  API', r.status(), await r.text()); });
  page.on('pageerror', (e) => consoleErrors.push(String(e)));
  await page.addInitScript(() => { try { localStorage.setItem('cbs-consent-v1', 'denied'); } catch {} });

  for (const path of PAGES) {
    const res = await page.goto(BASE + path, { waitUntil: 'networkidle' });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    const h1s = await page.locator('h1').count();
    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    const serious = axe.violations.filter((v) => ['serious', 'critical'].includes(v.impact));
    ok(res.status() === 200 && overflow <= 0 && h1s === 1 && serious.length === 0,
      `${path} (status ${res.status()}, overflow ${overflow}px, h1 ${h1s}, axe serious ${serious.length}${serious.length ? ' ' + serious.map((v) => v.id + ':' + v.nodes[0].target).join(' | ') : ''})`);
  }

  // Navigation
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  if (mobile) {
    await page.getByRole('button', { name: 'Menu' }).click();
    ok(await page.locator('#mobile-nav').isVisible(), 'mobile menu opens');
    ok((await page.getByRole('button', { name: /Close/ }).getAttribute('aria-expanded')) === 'true', 'menu button reports expanded');
    await page.keyboard.press('Escape');
    ok(!(await page.locator('#mobile-nav').isVisible()), 'Escape closes the menu');
    await page.getByRole('button', { name: 'Menu' }).click();
    await page.locator('#mobile-nav').getByRole('link', { name: 'Culture' }).click();
    await page.waitForURL('**/culture');
    ok(!(await page.locator('#mobile-nav').isVisible()), 'menu closes after navigating');
  } else {
    ok(await page.getByRole('navigation', { name: 'Main', exact: true }).getByRole('link', { name: 'Vision' }).isVisible(), 'desktop nav visible');
  }

  // Courtyard map: hover (desktop), tap (mobile), keyboard focus
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  const panel = page.getByRole('region', { name: 'Courtyard details' });
  const room = (n) => page.getByRole('button', { name: n });
  await room('Wellness & Transformation Retreats').scrollIntoViewIfNeeded();
  if (mobile) await room('Wellness & Transformation Retreats').tap(); else await room('Wellness & Transformation Retreats').hover();
  ok(await panel.getByRole('link', { name: 'Join the retreat waitlist' }).isVisible(), `map reveals retreat registration route via ${mobile ? 'tap' : 'hover'}`);
  await room('Longevity & Later-Life Living').focus();
  ok(await panel.getByRole('link', { name: 'Assisted Living waitlist' }).isVisible() && await panel.getByRole('link', { name: 'Retirement Village waitlist' }).isVisible(), 'map reveals both later-life routes via keyboard focus');
  await panel.getByRole('link', { name: 'Retirement Village waitlist' }).click();
  await page.waitForURL('**/register/retirement-village?from=home-map');
  ok(true, 'map link opens the right pathway with its source');

  // Every registration pathway end to end
  let n = 0;
  for (const slug of PATHWAYS) {
    // Distinct client address per submission so the rate limiter (5 per 10 minutes) does not interfere.
    await ctx.setExtraHTTPHeaders({ 'x-forwarded-for': `10.9.${width % 250}.${++n + Math.floor(Math.random() * 200)}` });
    await page.goto(`${BASE}/register/${slug}?from=home-hero`, { waitUntil: 'networkidle' });
    // Validation first
    await page.locator('form button[type=submit]').click();
    ok(await page.getByRole('alert').first().isVisible(), `${slug}: empty submit shows an error summary`);
    await page.getByLabel('Full name').fill('Ama Mensah');
    await page.getByLabel('Email address').fill(`ama+${slug}@example.com`);
    await page.getByLabel('Country or city').fill('Accra, Ghana');
    await page.locator('select').selectOption({ index: 1 });
    await page.getByLabel('Message (optional)').fill(`Test message for ${slug}`);
    await page.getByLabel(/I agree that Sai Legacy Holdings/).check();
    await page.locator('form button[type=submit]').click();
    await page.waitForURL('**/register/confirmation**', { timeout: 15000 });
    ok(/CBS-[A-Z0-9]{8}/.test(await page.locator('main').innerText()), `${slug}: submits and shows confirmation reference`);
  }

  // Rate limiting is visible to the user: the 6th submission from one address shows a clear message.
  await ctx.setExtraHTTPHeaders({ 'x-forwarded-for': `10.8.${width % 250}.${Math.floor(Math.random() * 250)}` });
  for (let i = 1; i <= 6; i++) {
    await page.goto(`${BASE}/register/guest-updates`, { waitUntil: 'networkidle' });
    await page.getByLabel('Full name').fill('Rate Test');
    await page.getByLabel('Email address').fill('rate@example.com');
    await page.getByLabel('Country or city').fill('Accra');
    await page.locator('select').selectOption({ index: 1 });
    await page.getByLabel(/I agree that Sai Legacy Holdings/).check();
    await page.locator('form button[type=submit]').click();
    if (i < 6) await page.waitForURL('**/register/confirmation**');
  }
  await page.getByText(/several registrations in a short time/).waitFor();
  ok(true, 'rate limit message shown on the sixth submission');

  // Cookie consent: banner appears with no stored choice, and no analytics requests are made
  const fresh = await browser.newContext({ viewport: { width, height } });
  const fp = await fresh.newPage();
  const requests = [];
  fp.on('request', (r) => requests.push(r.url()));
  await fp.goto(BASE + '/', { waitUntil: 'networkidle' });
  ok(await fp.getByRole('region', { name: 'Cookie preferences' }).isVisible(), 'cookie banner shows before a choice');
  ok(requests.every((u) => u.startsWith(BASE)), 'no third-party requests before consent');
  await fp.getByRole('button', { name: 'Decline' }).click();
  ok(!(await fp.getByRole('region', { name: 'Cookie preferences' }).isVisible()), 'banner closes after a choice');
  await fp.getByRole('button', { name: 'Cookie settings' }).click();
  ok(await fp.getByRole('region', { name: 'Cookie preferences' }).isVisible(), 'footer cookie settings reopens the banner');
  await fresh.close();

  // Journal filters
  await page.goto(BASE + '/journal', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Cultural stories' }).click();
  ok((await page.locator('article').count()) === 1, 'journal filter narrows to one category');
  await page.getByRole('button', { name: 'All' }).click();
  ok((await page.locator('article').count()) === 6, 'journal "All" shows every category');

  // Team view: private, login, search, exports
  const anon = await browser.newContext({ extraHTTPHeaders: {} });
  const ap = await anon.newPage();
  const exp = await ap.request.get(BASE + '/api/team/export?format=csv');
  ok(exp.status() === 404, 'export is hidden from signed-out callers');
  await ap.goto(BASE + '/team');
  ok(!(await ap.content()).includes('example.com'), 'team page exposes no data when signed out');
  ok((await (await ap.request.get(BASE + '/team')).headers()['x-robots-tag'] ?? '').includes('noindex'), 'team page is noindex');
  await ap.getByLabel('Username').fill(USER);
  await ap.getByLabel('Password').fill('wrong-password');
  await ap.getByRole('button', { name: 'Sign in' }).click();
  ok(await ap.getByText('were not recognised').waitFor({ timeout: 5000 }).then(() => true, () => false), 'wrong password shows an error');
  await ap.getByLabel('Password').fill(PASS);
  await ap.getByRole('button', { name: 'Sign in' }).click();
  await ap.getByRole('heading', { name: /Registration tracker/ }).waitFor();
  await ap.getByRole('button', { name: /^Investment \(/ }).waitFor();
  ok(await ap.locator('table:visible, [data-testid=registration-cards]:visible').first().isVisible(), 'team view lists registrations after sign in');
  await ap.getByRole('button', { name: /^Investment \(/ }).click();
  ok((await ap.locator('tbody tr').count()) >= 1, 'category worksheet filter works');
  await ap.getByLabel('Search registrations').fill('zzz-no-match');
  ok(await ap.getByText('No registrations match').isVisible(), 'search with no match shows an empty state');
  await ap.getByLabel('Search registrations').fill('');
  const [csv] = await Promise.all([ap.waitForEvent('download'), ap.getByRole('link', { name: 'Export CSV' }).click()]);
  ok(/\.csv$/.test(csv.suggestedFilename()), `CSV download (${csv.suggestedFilename()})`);
  const [xlsx] = await Promise.all([ap.waitForEvent('download'), ap.getByRole('link', { name: 'Export Excel' }).click()]);
  ok(/\.xlsx$/.test(xlsx.suggestedFilename()), `Excel download (${xlsx.suggestedFilename()})`);
  const axe = await new AxeBuilder({ page: ap }).withTags(['wcag2a', 'wcag2aa']).analyze();
  ok(axe.violations.filter((v) => ['serious', 'critical'].includes(v.impact)).length === 0, 'team view has no serious axe violations');
  await anon.close();

  ok(consoleErrors.length === 0, `no console errors${consoleErrors.length ? ': ' + consoleErrors.slice(0, 3).join(' | ') : ''}`);
  await ctx.close();
}

// Reduced motion: no scroll-triggered hidden content
const rm = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } });
const rp = await rm.newPage();
await rp.addInitScript(() => localStorage.setItem('cbs-consent-v1', 'denied'));
await rp.goto(BASE + '/', { waitUntil: 'networkidle' });
const hidden = await rp.evaluate(() => [...document.querySelectorAll('main *')].filter((e) => getComputedStyle(e).opacity === '0').length);
ok(hidden === 0, 'reduced motion: nothing is held invisible awaiting animation');
await rm.close();

await browser.close();
console.log(failures ? `\n${failures} check(s) FAILED` : '\nAll browser checks passed');
process.exit(failures ? 1 : 0);
