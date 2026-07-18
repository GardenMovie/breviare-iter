# Breviare

The web frontend for **Breviare**, a URL shortener. Turn long links into short
ones in seconds — and, once signed in, claim a username and track your links.

Built with React 19, TypeScript, Vite, Tailwind CSS v4, and shadcn/ui.

## Features

- **Shorten** any URL from the landing page — no account required.
- **Sign in with Google** (Google Identity Services / OAuth) to register.
- **Claim a username** and check its availability before claiming.
- Copy the short link to the clipboard and shorten another in one click.
- Light/dark theming via a theme provider.

## How it works

This repo is the frontend only. It talks to the Breviare backend API over
`/api/v1/*`. In development, Vite proxies API traffic to the backend; in
production, `vercel.json` rewrites do the same. Both currently point at
`http://54.20.64.179:8080`.

Key routes handled by the frontend:

- `/` — landing page with the shorten form.
- `/registration` — Google sign-in and username claiming.
- Short codes (e.g. `/abc-def`) are proxied to the backend for redirection.

Relevant API endpoints consumed by the client:

| Endpoint | Purpose |
| --- | --- |
| `POST /api/v1/links` | Create a short link |
| `POST /api/v1/auth/google` | Sign in with a Google ID token |
| `POST /api/v1/auth/refresh` | Refresh the session |
| `POST /api/v1/auth/logout` | Log out |
| `GET /api/v1/users/username-availability` | Check if a username is free |
| `POST /api/v1/users/username` | Claim a username |

## Getting started

### Prerequisites

- Node.js (a version compatible with Vite 8 — Node 20+ recommended)
- npm

### Install

```bash
npm install
```

### Configure environment

Copy the example env file and fill in the values:

```bash
cp .env.example .env
```

| Variable | Description |
| --- | --- |
| `VITE_API_URL` | Base URL of the Breviare backend API |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID for sign-in |

### Run the dev server

```bash
npm run dev
```

The app runs on [http://localhost:3000](http://localhost:3000). API requests to
`/api`, `/health`, and short-code paths are proxied to the backend (see
`vite.config.ts`).

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |
| `npm run typecheck` | Type-check without emitting |

## Project structure

```
src/
├── components/        UI components (ShortenForm, SignIn, Navbar, …)
│   └── ui/            shadcn/ui primitives (button, card, input)
├── hooks/             Auth context and Google Identity Services hooks
├── lib/               API client (auth.ts) and utilities
├── types/             Google Identity type declarations
├── App.tsx            Root component and routing
└── main.tsx           App entry point
```

## Deployment

The app is configured for Vercel. `vercel.json` handles API/health/short-code
rewrites to the backend and falls back to `index.html` for SPA routing.

## Adding UI components

shadcn/ui components live in `src/components/ui`. Add more with:

```bash
npx shadcn@latest add button
```

Import them via the `@` alias:

```tsx
import { Button } from "@/components/ui/button"
```
