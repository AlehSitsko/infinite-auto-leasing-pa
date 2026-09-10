# Infinite Auto Leasing PA

Server-rendered marketing and lead-generation website for **9831 Bustleton Ave, Philadelphia, PA 19115 · 215-856-0202**. Individual and family buyers are the primary audience. No inventory system, CRM, database, employee dashboard, credit application, or visitor authentication.

## Built

Nine pages: Home, Find a Car, How It Works, Financing, Cars We’ve Delivered, Partnerships, About, Reviews, Contact. Includes mobile navigation, sticky Call/Text/Find My Car links, three accessible inquiry forms, conservative financing copy, local-business JSON-LD, per-page canonical/social metadata, sitemap and robots. Instagram is social proof, never assumed current inventory. No invented testimonials, ratings, pricing, partners, or business history.

Owner revisions included: infinity wordmark, blanked hero license plate, personal/family-focused copy, Kia removed from displayed makes.

## Structure and architectural decisions

```text
app/                      Pages, SEO routes, error states
  api/leads/route.ts       One server submission endpoint
components/
  brand.tsx               Shared infinity wordmark
  forms/lead-form.tsx      Vehicle, contact, partnership forms
  sections.tsx            Reusable steps, CTA, delivery gallery
  analytics.tsx           Conversion click listener
  ui/                     Bundled UI primitives; only used imports ship
config/business.ts        Central NAP, social links, languages, hours
config/reviews.ts         Typed, intentionally empty real-review collection
lib/forms/                Validation, rate limiter, handler, email adapter
lib/instagram/            Fetch → normalize → classify → cache
lib/analytics.ts          Privacy-conscious event adapter
lib/seo.ts                Trusted origin and metadata helper
public/images/hero.webp   Optimized illustrative vehicle, blank plate
tests/core.test.ts        Seven deterministic test suites
proxy.ts                  Security headers and baseline CSP
.env.example             Application keys, never real credentials
.openai/hosting.json      Sites registration, no database bindings
build/ + scripts/        Retained hosting support
```

The Sites-provided locked stack is **Vinext 1.0.0-beta.5**, Next.js 16.2.6 App Router APIs, React 19.2.6, TypeScript, Tailwind 4, targeting Cloudflare Workers ESM. **Vinext is a beta deployment adapter**; this is not a claim that all versions are current stable. The platform's tested lock was retained rather than speculatively upgrading its adapter. Before public launch, review supported stable Next.js/React security updates and the supported hosting adapter. Application modules use standard App Router patterns and remain separate from the hosting layer.

## Development

Node 22.13+ and npm; tested with Node 22.17.

```sh
npm run install:ci
cp .env.example .env
npm run dev
npm run typecheck
npm run lint
npm test
npm run build
npm start
```

Development uses port 5173. `npm start` serves the compiled Worker locally through Wrangler. On this Windows host, Sites helpers encountered a broken npm shell shim. The equivalent direct npm entrypoint worked:

```powershell
& 'C:\Program Files\nodejs\node.exe' 'C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js' run build
```

The Sites build helper was attempted; its shim failure was bypassed by running the same project build script directly. Installation used this entrypoint too.

## Environment variables

| Variable | Purpose | Required |
|---|---|---|
| `SITE_URL` | Trusted canonical HTTPS origin | Set per deployment |
| `INSTAGRAM_ACCESS_TOKEN` | Professional-account token; server only | For feed |
| `INSTAGRAM_USER_ID` | Numeric authorized account ID | For feed |
| `INSTAGRAM_API_VERSION` | Supported version from Meta dashboard, `vNN.0` | For feed |
| `RESEND_API_KEY` | Server-only email credential | For submissions |
| `LEAD_FROM_EMAIL` | Sender at a Resend-verified domain | For submissions |
| `LEAD_TO_EMAIL` | Inbox, defaulting to business email | Optional |

Use ignored `.env` locally and host secret settings for deployment. Keep local keys aligned with `.env.example`. Never prefix secrets with `NEXT_PUBLIC_`. No credentials were supplied or committed. Without them the website shows working contact alternatives.

## Instagram setup

Uses **Instagram API with Instagram Login** for professional Business/Creator accounts, not scraping or retired Basic Display. The professional-account direction and `instagram_business_basic` scope were checked against [Meta's official collection](https://www.postman.com/meta/instagram/folder/6raa77c/instagram-api-with-instagram-login).

1. Verify that the account belongs to **Infinite Auto Leasing PA at the Philadelphia address**. Add the exact profile URL in `config/business.ts`.
2. In the Meta developer dashboard, create/select the app, configure Instagram with Instagram Login, and authorize the professional account for basic media access. App roles/testers and review/advanced-access requirements depend on app mode and the accounts using it.
3. Follow the current authenticated [Get Started](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/get-started/) and [Business Login](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/business-login/) flows to obtain the numeric account ID and long-lived token. A future custom OAuth callback must validate state and exact redirect URI and exchange tokens server-side. No account-management/login UI is added to this marketing site.
4. Set all three Instagram variables. Select a supported API version in the actual app dashboard; `.env.example` deliberately does not guess one.
5. Add `#IALsold` to an authorized delivery post and confirm its image/permalink after the cache expires.
6. Assign token expiry/renewal to a developer or hosting process. Verify actual expiry and arrange renewal before it; persist the replacement in the hosting secret store. See [Meta refresh reference](https://developers.facebook.com/docs/instagram-platform/reference/refresh_access_token/). Automatic secret rotation is not implemented because no secret-store integration/account was authorized. An expired token safely produces a fallback, not an indefinitely live feed.

**Verification gap:** Meta's main documentation returned 429/unavailable during implementation. The official published collection was consulted, but the final account-specific authorization flow, permissions, and supported API version must be verified in the authenticated dashboard before activation. Live Instagram has not been tested without credentials.

### Service behavior

`client.ts` requests `/{version}/{user-id}/media` at `graph.instagram.com` using a server-only Bearer header, requesting id, caption, media type, media/thumbnail URL, permalink, timestamp. Maximum 50 recent posts; no historical pagination. Six-second timeout.

`normalize.ts` validates supported types, timestamps, HTTPS URLs, and expected Meta image hosts. Images/carousels use the cover image; videos/Reels use a thumbnail linked to the original post. Unsupported media are skipped. Caption titles are rendered as text, never HTML.

Explicit tags: `#IALsold`, `#IALavailable`, `#IALcomingsoon`. Sold wins conflicts. Words such as “available” alone are not classified. **Only sold-tagged posts appear in the gallery.** There is no available-vehicle section in v1.

Caching uses a 30-minute framework cache and Cloudflare edge Cache API when present. Both successes and safe empty fallbacks are cached. Edge cache is per-location, not globally durable. Tokens never enter returned JSON. Changes can take 30 minutes to appear. If the exact profile is configured but fetch fails, the fallback links to Instagram; if the profile is unknown, it links to Contact rather than inventing a profile.

## Forms

All three forms POST to `/api/leads`. Server validation covers inquiry-specific required fields, choices, field lengths, phone/email, amounts, and website protocols. Unknown/irrelevant fields are discarded. Security includes same-origin checks, streaming 16 KB body limit, honeypot, bounded 5-per-10-minute per-isolate rate limiting. IPs are hashed into ephemeral limiter keys; the application does not log lead bodies or store leads.

The isolated `deliver.ts` adapter uses Resend's HTTPS [Send Email API](https://resend.com/docs/api-reference/emails/send-email), sending plain text. Verify a sending domain and configure the key/sender, then test to an approved test inbox before using the business inbox. Success is shown only after provider acceptance. Failure/timeout shows Call/Text/Email alternatives. Provider acceptance is not proof of inbox delivery; monitor delivery at Resend. No persistent retry queue is included.

The feature-detected `stage_lead_request` WebMCP tool fills the visible form for review; it **cannot submit**. Normal browsers use the same form without WebMCP. Valid and invalid staging were tested through the browser tool surface.

## Analytics

`lib/analytics.ts` emits local `infinite:conversion` events with allowlisted event names only. Clicks include find-car, call, text, Instagram, directions; forms emit successful inquiry events. No external provider, cookies, visitor identifiers, or tracking transmission are enabled. A later approved GA/Cloudflare adapter can subscribe; update CSP and disclosures when adding it.

## Deployment and Cloudflare

Build emits `dist/server/index.js` with a default fetch handler, client assets, and hosting metadata. Preserve `sites()` in `vite.config.ts`. Publish exact validated source through Sites with runtime values in host settings. Initial hosting is owner-private. **No business domain or DNS settings were changed.**

For eventual launch: obtain explicit DNS/domain authorization; confirm ownership of `infiniteautoleasingpa.com`; configure the hosting target, TLS, and www redirect; set `SITE_URL` to the final origin; exclude `/api/leads` from edge caching. Re-test forms, Instagram, metadata, and redirects on that origin. Add Cloudflare WAF/rate limiting because isolate limits are best effort across instances.

Headers include nosniff, referrer policy, same-origin framing, device-permission restrictions, and baseline CSP. Framework hydration requires inline allowances; eval remains allowed for development. Nonce-based production CSP is a future hardening step. No full security audit is claimed.

## Content updates and remaining inputs

Static content stays in code; staff publish on Instagram and tag delivery posts with `#IALsold`. No website listings or dashboard to maintain.

- Before public launch: email provider key/verified sender; exact Instagram URL, credentials and version; exact Google Business URL; business hours; confirmation that `267-506-1130` supports SMS.
- Optional: verified Facebook profile, approved genuine reviews, original logo assets, owned photography.
- `yearFounded` stays null until verified. “Since 2006” is not displayed.
- Reviews remain empty. Google CTA uses an exact business/address Maps search until the profile is verified.
- Hero is illustrative, never a delivery claim. [Marius Walter / Unsplash source](https://unsplash.com/photos/a-silver-car-parked-in-front-of-a-building-TogV56h_dJ0), [commercial license](https://unsplash.com/license). Built-in ImageGen prompt: “Change only the front license plate to a completely blank neutral light-gray plate; preserve its frame, perspective, lighting, and every other part of the photograph.” Final web asset: `public/images/hero.webp`.
- Social title/description metadata exists; no sharing image was generated without an explicit request.

## Validation and limits

Seven passing automated suites cover classifier precedence, media normalization/safety, validation, rate limits, accepted delivery, and rejection/failure paths. TypeScript, lint, and Worker build are checked. All nine routes, sitemap, robots, and hero respond in local checks. Browser QA covers 360/390 phone, 768 tablet, and 1440 desktop widths, menu navigation, form validation/fallback, staging, and console inspection.

Live Meta and real email delivery still require credentials. There is no claimed Lighthouse score, full accessibility audit, guaranteed financing, guaranteed availability, or production readiness independent of the launch checklist above.

## Recommended next five improvements

1. Connect email delivery and provider monitoring; send a real approved test inquiry.
2. Connect the correct Instagram account and arrange token renewal/expiry monitoring.
3. Confirm hours, SMS, social/Google links; add approved reviews and owned photographs.
4. Review supported stable dependency/security updates; complete final-domain QA and authorized DNS/TLS launch with edge abuse protection.
5. Add privacy-reviewed analytics, then refine the funnel using measured performance and conversion data.
