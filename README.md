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

## HTTPS local development

This project now uses a self-signed certificate for local HTTPS. Generate the certificate once:

```bash
mkdir -p certs
openssl req -x509 -nodes -newkey rsa:2048 \
  -keyout certs/localhost-key.pem \
  -out certs/localhost-cert.pem \
  -days 365 \
  -subj "/CN=localhost" \
  -addext "subjectAltName=DNS:localhost,IP:127.0.0.1,IP:::1"
```

Then run:

```bash
npm install
npm run dev
```

Open: `https://localhost:5173`

## Server

The optional Node server keeps GWDG credentials out of the client bundle. Start it with `npm run server` after building, or use `npm start` to build and serve the app at `https://localhost:8787`.

Set `GWDG_API_KEY` and `GWDG_ARCANA_ID` in the server environment to enable `POST /api/assistant`. `GET /health` is available for deployment checks. During `npm run dev`, Vite proxies these routes to the server.

See docs/mobile-release.md for mobile packaging.

## Data sovereignty

Farm data belongs to the farm. Online AI/retrieval adapters are opt-in and must not put API keys into the client bundle.
