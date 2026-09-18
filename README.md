# KlarblattFarm

Offline-first FarmVisite for fast field observations.

## Product loop

Observe → Context → Assist → Act

## Targets

The same codebase is intended for Web/PWA, Android and iOS. The current app uses React + TypeScript + Vite and is prepared for Capacitor.

## Local-first

Observations and tasks are stored in IndexedDB. Photos and short audio recordings can be attached in supported browsers. The assistant currently uses a local deterministic adapter.

## Build

npm install
npm run dev
npm run build

## Server

The optional Node server keeps GWDG credentials out of the client bundle. Start it with `npm run server` after building, or use `npm start` to build and serve the app at `http://localhost:8787`.

Set `GWDG_API_KEY` and `GWDG_ARCANA_ID` in the server environment to enable `POST /api/assistant`. `GET /health` is available for deployment checks. During `npm run dev`, Vite proxies these routes to the server.

See docs/mobile-release.md for mobile packaging.

## Data sovereignty

Farm data belongs to the farm. Online AI/retrieval adapters are opt-in and must not put API keys into the client bundle.
