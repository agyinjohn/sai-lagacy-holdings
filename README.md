# The Courtyard by Sai (prototype)

A prototype website for **The Courtyard by Sai**, a proposed 80-acre, multi-phase cultural, wellness and lifestyle destination in Akuapem, Eastern Region, Ghana, developed by Sai Legacy Holdings. Prepared by GTHINK Company Limited to support its proposal.

Creative concept: **Rooted on the Ridge**. The layered ridge line is the main graphic motif, inspired by Akuapem's ridges and the shared open courtyard of a Ghanaian compound house. No kente, Adinkra or other cultural patterns are used because no approved artwork has been supplied.

> This is a prototype. It is clearly marked as one on every page, forms warn visitors not to enter sensitive information, and **no real email is ever sent**.

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Framer Motion · Zod 4 · ExcelJS (Excel export only) · pg (Postgres adapter) · Vitest · Playwright with axe-core (browser checks, dev only).
No paid services or third-party accounts are used.

## Getting started

Requires Node.js 20.9 or later.

```bash
npm install
cp .env.example .env.local   # then fill in the TEAM_* values
npm run dev                  # http://localhost:3000
```

Generate a session secret and choose a strong team password:

```bash
openssl rand -base64 48
```

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build and server |
| `npm run lint` | ESLint (Next.js core-web-vitals and TypeScript rules) |
| `npm run typecheck` | `tsc --noEmit`, strict mode |
| `npm test` | Vitest: all 7 registration pathways, validation, honeypot, rate limit, auth, CSV and Excel export, formula injection, content rules, asset register |
| `npm run test:e2e` | Browser checks at 360 px and 1440 px (needs a running server, see below) |
| `npm run assets:register` | Regenerates `docs/asset-register.md` from `src/content/images.ts` |
| `npm run images:add` | Wires image files from `public/images/` into the image config and register |
| `npm run check` | Lint, types, tests and build in one go |

Browser checks cover: no horizontal scroll and one `h1` on every page, axe-core (WCAG 2.1 AA, serious and critical), mobile menu and Escape key, the courtyard map by hover, tap and keyboard focus, every registration pathway end to end, rate-limit messaging, cookie consent with no third-party requests, journal filters, the team view (sign-in, search, worksheet filter, CSV and Excel downloads), and reduced motion.

```bash
npm run build && npm start &
BASE_URL=http://localhost:3000 TEAM_USERNAME=... TEAM_PASSWORD=... npm run test:e2e
# If Playwright cannot find its browser, point it at an installed Chromium:
# CHROMIUM_PATH=/path/to/chromium
```

## Sitemap

| Route | Page |
|---|---|
| `/` | Home: hero, courtyard story, culture, interactive courtyard map, investment, final call to action |
| `/vision` | Our Vision & Masterplan |
| `/culture` | Culture & Experiences |
| `/hospitality` | Hospitality, Nature & Leisure |
| `/wellness` | Wellness & Transformation Retreats |
| `/later-life` | Longevity & Later-Life Living |
| `/serviced-plots` | Serviced Plots: Phase 3 |
| `/investment` | Investment Opportunities: The Legacy Unit |
| `/journal` | Journal & Development Updates, with category filters (`?category=`) |
| `/contact` | Contact & Partnerships |
| `/privacy` | Privacy Notice (draft for legal review) |
| `/register` | Chooser for the seven registrations |
| `/register/[pathway]` | `legacy-unit`, `transformation-retreat`, `assisted-living`, `retirement-village`, `serviced-plots`, `guest-updates`, `contact` |
| `/register/confirmation` | Registration confirmation (noindex) |
| `/team` | Private team view (noindex, password protected, not linked) |

## Project structure

```
src/
  app/                 Routes, metadata, sitemap, robots, API route handlers
    api/register       POST: validated, rate-limited registration
    api/team/*         login, logout and export (authenticated)
  components/          Design system and page components
  content/             All copy and configuration (CMS-ready, see below)
    pathways.ts        The 7 registration pathways, options and consent text
    pages.ts           Page copy
    images.ts          Central image config AND asset register
    map.ts             Courtyard map components and registration routes
    journal.ts         Journal categories and sample entries
  lib/
    validation.ts      Zod schemas shared by browser and server
    storage/           Storage abstraction (postgres, file, memory)
    email/             Email abstraction (console only)
    rate-limit.ts      Sliding-window limiter (memory and Upstash backends)
    rate-limit-upstash.ts  Upstash Redis REST backend
    team-auth.ts       Credentials check and signed session cookie
    export.ts          CSV and Excel export with formula-injection protection
tests/                 Vitest suites
scripts/               Browser checks and asset register generator
db/schema.sql         Registrations table (also applied automatically)
docs/asset-register.md Generated register of images, logo, fonts and illustrations
```

### Moving content to a CMS

Components read typed objects from `src/content`. To adopt a CMS, replace those exports with fetchers that return the same shapes. Nothing in the components needs to change.

## Registration pathways

Seven separate, validated flows share one engine (`src/content/pathways.ts` plus `src/lib/validation.ts`):

1. Legacy Unit investment enquiry
2. Transformation Retreat priority waitlist
3. Assisted Living priority waitlist
4. Retirement Village priority waitlist
5. Phase 3 Serviced Plots expression of interest
6. Hospitality and future guest updates
7. Contact and partnership enquiries

Every record stores: date, category, name, email and phone, location, the pathway-specific detail, optional organisation (investment and contact only), message, consent (with the version of the consent wording) and registration source. Links into the forms carry `?from=<source>` and an optional `?detail=` to pre-select an option.

Protections on `POST /api/register`:

- Zod validation on the **server** (the browser runs the same schema for quick feedback, but is never trusted)
- Required, versioned consent
- Honeypot field: bots receive a success response, nothing is stored, and the hit counts against their rate limit
- Rate limiting per client IP (default 5 accepted submissions per 10 minutes, plus a wider cap on all attempts)
- Same-origin check, JSON-only content type, 20 KB body cap, unknown fields stripped, control characters removed
- Clear success, field-level error, rate-limit and server-error states in the UI

## Team view (`/team`)

A password-protected demo area showing registrations by category, with search and CSV and Excel export.

- The area stays **closed** until `TEAM_USERNAME`, `TEAM_PASSWORD` (8+ characters) and `TEAM_SESSION_SECRET` (32+ characters) are all set. There are no default credentials.
- Credentials are compared in constant time. Sessions are HMAC-signed, expire after 8 hours and live in an `HttpOnly`, `SameSite=Strict` cookie (`Secure` in production). Login attempts are rate limited.
- Data is read and serialised into the page only after the session is verified. The export endpoint returns 404 to anyone not signed in. All `/team` and `/api` responses send `Cache-Control: no-store` and `X-Robots-Tag: noindex`, and `robots.txt` disallows them. Nothing links to `/team` from the public site.
- **Formula injection:** every exported cell beginning with `=`, `+`, `-`, `@`, tab or carriage return (including after leading whitespace) is prefixed with an apostrophe in both CSV and Excel. Excel cells are also stored as text. CSV is UTF-8 with a byte order mark so accents open correctly.
- Exports follow the current worksheet and search. The Excel file has an `All` sheet plus one sheet per category.

## Environment variables

See `.env.example`. Never commit real values. `.env*` (except the example) and `.data/` are git-ignored.

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Public URL for canonical links, sitemap, robots and Open Graph |
| `TEAM_USERNAME`, `TEAM_PASSWORD`, `TEAM_SESSION_SECRET` | Team area credentials and cookie signing secret |
| `STORAGE_DRIVER` | `postgres`, `file` (default) or `memory` |
| `DATABASE_URL` | Postgres connection string (required for `postgres`) |
| `DATABASE_AUTO_MIGRATE` | `false` to skip automatic table creation (default `true`) |
| `PG_POOL_MAX` | Connections per server instance (default 3) |
| `DATA_DIR` | Directory for the file adapter (default `.data`) |
| `EMAIL_DRIVER` | `console` only. No real email is sent |
| `TEAM_NOTIFICATION_EMAIL` | Optional recipient shown in the suppressed team notification |
| `RATE_LIMIT_DRIVER` | `upstash` or `memory`. Unset means Upstash when its credentials exist, otherwise memory |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST credentials (`KV_REST_API_URL` and `KV_REST_API_TOKEN` also work) |
| `RATE_LIMIT_MAX`, `RATE_LIMIT_WINDOW_SECONDS` | Registration rate limit (default 5 per 600 seconds) |
| `NEXT_PUBLIC_ANALYTICS_PROVIDER`, `NEXT_PUBLIC_ANALYTICS_ID` | Analytics placeholder, inactive until consent and a wired-in provider |

## Images and the asset register

No image is copied from the internet. `src/content/images.ts` is the central image configuration and the asset register in one file, so they cannot drift apart. Every slot is currently a ridge-motif placeholder that states what is needed. `docs/asset-register.md` is generated from it and also records the logo, fonts and ridge illustrations.

To add images, follow `docs/image-brief.md` (a prompt, ratio and rules for each of the eight slots), name each file after its slot id (for example `public/images/home-hero.jpg`), then run:

```bash
npm run images:add -- --tool="Name and version of the tool" --date=2026-11-02
```

This reads each file's size, points the slot at it, marks it as an AI concept image awaiting review, and regenerates `docs/asset-register.md`. Then record the prompt in each register entry in `src/content/images.ts`, and set `approvalStatus` to `approved` only once Sai Legacy Holdings has signed it off (re-running the command never resets an approved entry). Use `--kind=licensed`, `--kind=commissioned` or `--kind=client-supplied` for non-AI images. For AI images the `SiteImage` component and the hero **always** show the caption "Concept for illustration only. Not an approved design or completed facility." The homepage hero shows a supplied `home-hero` image beneath the headline, with a dark overlay for legibility and the ridge motif layered on top.

The Sai Legacy Holdings logo is used exactly as supplied (1000 x 307 px, unaltered proportions and colours). The supplied file has an opaque white background, so it is always shown on a white panel. A transparent or SVG version would let it sit directly on brand colours.

## Accessibility and motion

Skip link, landmarks, one `h1` per page, visible focus states, 44 px minimum touch targets, labelled fields with described errors and an error summary that receives focus, keyboard-operable menu (Escape closes, focus is trapped and returned) and map (focus reveals a space and its registration routes). Gold text on light backgrounds uses a darker gold (`gold-ink`, `#7A5A1E`) to meet contrast requirements. Motion is limited to a gentle reveal and hero parallax, and is switched off when `prefers-reduced-motion` is set.

## Consent and analytics

A cookie banner appears until a choice is made, and can be reopened from the footer. Analytics is off until a visitor accepts, and the prototype loads no analytics service at all. To add one, implement it in `src/lib/analytics.ts` and add its domains to the Content Security Policy.

## Deployment

1. Create a Node.js hosting project (for example Vercel or any Node host) from this repository.
2. Set the environment variables above in the host's secret store, never in the repository.
3. `npm run build` then `npm start`.
4. Set `NEXT_PUBLIC_SITE_URL` to the final domain and confirm `/sitemap.xml` and `/robots.txt`.
5. Sign in at `/team`, submit each registration, and check both exports.

### Deploying to Vercel with Postgres

1. Create a Postgres database. Any provider that gives you a connection string works (for example Neon or Supabase, including via the Vercel Marketplace). Free tiers exist, but creating the account is your decision.
2. In Vercel, add `STORAGE_DRIVER=postgres` and `DATABASE_URL=<your connection string>` alongside the other variables. Use a pooled connection string if your provider offers one.
3. Deploy. The `registrations` table is created automatically on first use. To manage the schema yourself, set `DATABASE_AUTO_MIGRATE=false` and run `db/schema.sql` once.
4. Submit a test registration and confirm it appears at `/team` and in the table.

The Postgres adapter is `src/lib/storage/postgres.ts`. It uses parameterised queries only, enforces unique references and recorded consent in the database, and is covered by tests against an in-memory Postgres emulator. It has not been run against a live database in this repository, so do step 4 before relying on it.

### Shared rate limiting with Upstash

On serverless hosts the in-memory limiter only counts per instance, so limits are easy to sidestep. Use Upstash Redis for limits shared across instances:

1. Create an Upstash Redis database (a free tier exists, but creating the account is your decision). Copy the REST URL and REST token from its console, or add Upstash through the Vercel Marketplace, which sets `KV_REST_API_URL` and `KV_REST_API_TOKEN`.
2. In Vercel, set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` (or rely on the KV names). Optionally set `RATE_LIMIT_DRIVER=upstash` to make a missing credential a hard error instead of a silent in-memory fallback.
3. Redeploy. No code changes are needed.

How it works (`src/lib/rate-limit-upstash.ts`): a sliding window kept as a Redis sorted set per client, using Upstash's REST API through `fetch` with no extra dependency. Client IP addresses are SHA-256 hashed before being sent, so the raw address never reaches Redis. If Upstash is unreachable, the limiter logs the error and answers from the in-memory limiter for that request, so a Redis outage never blocks genuine visitors and each instance still protects itself. Check-then-record is two requests, so simultaneous requests from one client can briefly exceed the limit. That is acceptable for abuse protection and is not a strict quota.

The adapter is tested against an in-process fake of the Upstash REST endpoint, not a live Upstash database. After deploying, confirm it works by submitting six registrations quickly from one device (the sixth should be refused) and checking that keys beginning `cbs:rl:` appear in the Upstash data browser.

## What must change before production

- [ ] **Real storage:** use the Postgres adapter (`STORAGE_DRIVER=postgres`) or another approved database, and decide on retention, backups and access controls. The JSON file is for local demonstration only.
- [ ] **Real email:** implement `EmailAdapter` (`src/lib/email/index.ts`) with an approved provider, and supply the team inbox address. Review the acknowledgement wording.
- [ ] **Shared rate limiting:** configure the Upstash backend (or another shared store) so limits hold across instances, and verify it against the live service.
- [ ] **Team access:** replace the single shared password with named accounts or the host's SSO, add audit logging of exports, and consider server-side pagination for large volumes.
- [ ] **Legal:** final privacy notice, cookie wording, consent wording, retention and deletion process, data controller details and any local registration requirements, all approved by the legal adviser to Sai Legacy Holdings.
- [ ] **Investment content:** supply the approved Legacy Unit overview and legal disclaimer. Do not publish sensitive investment documents. Have investment promotion wording reviewed for regulatory compliance.
- [ ] **Content:** replace every bracketed placeholder (masterplan and phase dates, contact details, later-life and plot details, journal articles). Use "proposed" or "planned" until things are built or approved. Do not add prices, returns, dates, room counts, statistics, partners, testimonials or awards without approved sources.
- [ ] **Images:** supply licensed, commissioned or approved images, complete the asset register, and keep the concept caption on all AI-generated images.
- [ ] **Remove prototype signals:** the prototype banner, form notices and footer wording should be removed or revised at launch.
- [ ] **Content Security Policy:** it currently allows inline scripts, which Next.js needs without a nonce. Add per-request nonces through a proxy for a stricter policy.
- [ ] **Monitoring and backups:** error monitoring, uptime checks and backups for stored registrations.
- [ ] **Dependencies:** `npm audit` reports moderate minimatch advisories (denial of service via glob patterns). They arrive through lint tooling and through `exceljs` (a runtime dependency, used only by the authenticated Excel export and not fed user-controlled glob patterns). Re-check before launch, and consider a lighter Excel library if one is acceptable.
- [ ] **Accessibility:** automated axe checks pass, but commission a manual audit with assistive technology before launch.

## Content rules followed

Facts come only from the project brief and homepage concept. Anything not built or approved is described as proposed or planned. No prices, returns, dates, room counts, statistics, partners, testimonials or awards are stated. Copy uses British English and no em dashes (enforced by a test).
