# KlarblattFarm mobile & web release

KlarblattFarm now has one shared TypeScript/React codebase for Web/PWA and future iOS/Android builds.

## Targets

- Web/PWA: Vite production build.
- Android: Capacitor Android project generated from the same web bundle.
- iOS: Capacitor iOS project generated from the same web bundle.

Capacitor provides the native runtime and access to native device APIs while keeping application logic shared. Official docs: https://capacitorjs.com/docs

## Development

1. Install Node.js 20.19+.
2. npm install
3. npm run dev
4. npm run build

Mobile scaffolding after dependencies are installed:

- npm run cap:sync
- npx cap add android
- npx cap add ios

Store signing, certificates, provisioning and submission are release-environment steps and are not committed to the repository.

## Architecture

The web and mobile targets share domain, storage and assistant layers. Device-specific features should be isolated behind adapters/plugins.

The GWDG option remains an online adapter. Credentials must stay in a trusted backend or local environment and never be bundled into the browser app.

## Current 0.2 scope

- TypeScript + React + Vite
- IndexedDB observations and tasks
- photo attachment input
- short microphone recording where supported
- JSON export
- local assistant adapter
- Capacitor configuration

Not yet included: signed App Store/Play Store builds, real GWDG requests, background sync, GPS persistence, weather/sensor adapters.
