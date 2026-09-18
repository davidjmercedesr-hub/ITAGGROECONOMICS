# Android build

KlarblattFarm is packaged for Android with Capacitor.

## GitHub build

The `Android Build` workflow runs on Ubuntu, builds the web app, generates/syncs the Capacitor Android project, verifies the Gradle project, and builds an unsigned debug APK. It also uploads the Android project archive.

The debug APK is suitable for testing on Android devices after installation with the appropriate device-side confirmation. A production/release APK or Play Store package should use Android signing owned by the project owner.

## Local build

1. Clone the repository.
2. Run `npm install`.
3. Run `npm run build`.
4. If needed, run `npx cap add android`.
5. Run `npx cap sync android`.
6. Open `android/` in Android Studio, or run the Gradle build from that directory.

The application id is `de.klarblatt.farm`.

## Signing

The GitHub workflow intentionally creates an unsigned debug build. Do not put signing passwords or keystores into the repository. A release build should use GitHub Actions secrets or local signing configuration.

## Offline-first

The Android app keeps the existing local/offline architecture. The optional GWDG integration remains outside the Android client; API keys must not be bundled into the app.
