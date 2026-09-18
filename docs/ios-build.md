# iOS build

KlarblattFarm is packaged for iOS with Capacitor.

## What the GitHub build does

The `iOS Build` workflow runs on a macOS runner, builds the web application, runs `npx cap sync ios`, verifies the generated Xcode project, and uploads an unsigned iOS project archive as a workflow artifact.

This is intentionally unsigned. Installing on a physical iPhone or distributing through TestFlight/App Store requires Apple code signing with an Apple Developer account.

## Local Xcode build

On a Mac with Xcode installed:

1. Clone the repository.
2. Run `npm install`.
3. Run `npm run build`.
4. Run `npx cap sync ios`.
5. Open `ios/App/App.xcodeproj` in Xcode.
6. Select the App target and configure your Apple Development team/signing.
7. Select an iPhone simulator or connected iPhone and Build/Run.

The bundle identifier is `de.klarblatt.farm`.

## Important

The browser/PWA build remains available separately. The iOS workflow does not put GWDG API keys into the app.
