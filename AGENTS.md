# ReEngage Pro Landing Page — Project Context

## What is this?
This is the **marketing landing page** for [reengage.pro](https://reengage.pro) — a SaaS tool that re-engages dormant email subscribers safely. This is NOT the main application (that lives at `app.reengage.pro` in a separate repo).

## Tech Stack
- **Vite + React + TypeScript** (NOT Next.js)
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Express** (`server.js`) serves the built `dist/` folder in production
- **Socket.io** powers the live chat admin dashboard (`/admin`)

## Key Architecture
- `components/` — All React components (Hero, Navbar, Footer, FAQ, etc.)
- `public/` — Static assets (logos, ESP logos, sequence images)
- `App.tsx` — Root component, handles page routing (home/about/terms/privacy)
- `server.js` — Express production server (serves on port 8080)
- `index.html` — Vite entry point
- `dist/` — Vite build output (do NOT edit directly)

## Important: Images & Assets
- **Images used in components must be imported** using Vite's module import syntax:
  ```tsx
  import logoUrl from '../public/reengage-logo.png';
  // then use: <img src={logoUrl} />
  ```
- Do NOT use raw string paths like `src="/image.png"` — they may not resolve correctly through the Express server.
- Do NOT hotlink to `app.reengage.pro` for assets — that's a separate service with its own image optimization.

## Deployment
- **Hosted on Railway** — project name: `reengagepro-lander`, service: `reengageprolander`, environment: `production`
- **GitHub repo**: `pjexec/reengageprolander1` (main branch)
- **Deploy via CLI**: `railway up --detach` from this directory
- **Auto-deploy from GitHub is NOT reliably configured** — always deploy via CLI after pushing

## Local Development
```bash
npm install
npm run dev     # Starts Vite dev server on port 3000
npm run build   # Builds to dist/
npm start       # Runs Express production server on port 8080
```

## Related Projects (separate repos)
- **ReEngage Pro App** (`app.reengage.pro`) — The main SaaS application
- **Cold Traffic Tool** — Standalone marketing tool
- This workspace (`reengage_lander2`) also contains other experimental lander files that are NOT part of this deployed site
