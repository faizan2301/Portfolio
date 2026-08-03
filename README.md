# Faizan Shaikh — Portfolio

Personal portfolio and developer toolkit for [Faizan Shaikh](https://www.faizanshaikh.dev) — React Native & Flutter developer building iOS, Android, and web apps.

**Live:** [faizanshaikh.dev](https://www.faizanshaikh.dev)

## Features

- Cyber-themed portfolio: hero, about, experience, projects, skills, and contact
- Working contact form with Resend email delivery + visitor auto-reply
- Spam protection via Cloudflare Turnstile, honeypot, Zod validation, and rate limiting
- Free developer tools at `/tools` (JSON converters, mobile toolkit, date/time, color/UI, Git/DevOps, RN/Flutter, network)

## Tech stack

- [Next.js](https://nextjs.org) 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS 4
- Framer Motion
- [Resend](https://resend.com) (email)
- [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/) (spam protection)
- Zod (validation)
- Vercel Analytics

## Getting started

### Prerequisites

- Node.js 20+
- npm

### Install

```bash
npm install
```

### Environment variables

Copy the example file and fill in your keys:

```bash
cp .env.example .env
```

| Variable | Required | Description |
|---|---|---|
| `RESEND_API_KEY` | Yes (contact form) | API key from [resend.com](https://resend.com/api-keys) |
| `CONTACT_TO_EMAIL` | Yes | Inbox that receives form submissions |
| `CONTACT_FROM_EMAIL` | Yes | Sender address on your **verified** Resend domain (e.g. `Portfolio <hello@faizanshaikh.dev>`) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Yes | Cloudflare Turnstile site key |
| `TURNSTILE_SECRET_KEY` | Yes | Cloudflare Turnstile secret key |

> Use a verified domain address for `CONTACT_FROM_EMAIL`. `onboarding@resend.dev` only allows sending to your Resend account email.

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

## Project structure

```
app/
  page.tsx                 # Portfolio home
  api/contact/route.ts     # Contact form API
  tools/                   # Developer tools pages
components/
  contact.tsx              # Contact form UI
  hero.tsx, about.tsx, …   # Portfolio sections
  tools/                   # Tool UIs
  ui/                      # Shared UI primitives
lib/
  contact/                 # Schema, emails, Turnstile, rate limit
  tools/                   # Tool business logic
```

## Contact form

`POST /api/contact` accepts:

```json
{
  "name": "…",
  "email": "…",
  "subject": "…",
  "message": "…",
  "turnstileToken": "…"
}
```

Flow:

1. Zod validates input
2. Honeypot + Turnstile check spam
3. Rate limit: 5 requests / hour / IP
4. Resend sends notification to you (with `replyTo` set to the visitor)
5. Auto-reply confirmation goes to the visitor

## Developer tools

Browse all tools at [`/tools`](https://www.faizanshaikh.dev/tools):

| Category | Examples |
|---|---|
| JSON | → TypeScript, → Dart, → Java POJO |
| Mobile | APK signatures, deep links, FCM, ADB, permissions |
| Date & Time | Unix timestamps, time zones, ISO, countdowns |
| Color & UI | Picker, converter, gradients, glassmorphism |
| Git & DevOps | `.gitignore`, commits, changelog, Compose/YAML |
| RN & Flutter | Styles, themes, icon sizes, splash preview |
| Network | HTTP status, MIME, DNS, IP lookup, URL parser |
| Students | GPA / CGPA converter |

## Deploy

Designed for [Vercel](https://vercel.com). Add the same environment variables in the Vercel project settings, then deploy:

```bash
npx vercel
```

Or connect the GitHub repo and enable automatic deployments.

## License

Private portfolio project. All rights reserved.
