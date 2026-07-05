# Firebase Hosting + Functions + Firestore

**Best for:** managed apps already using Google/Firebase services. **Estimated complexity:** Medium.

Firebase Hosting serves the static dashboard and rewrites `/api/*` to one Express Function. Tests use memory; deployed functions use Firestore. The emulator path requires Node 22 and Java.

## Local setup and tests

```bash
pnpm install
cp apps/firebase-hosting-functions/.firebaserc.example apps/firebase-hosting-functions/.firebaserc
pnpm --filter firebase-hosting-functions test
pnpm dev:firebase
```

Open `http://localhost:5000`. The full emulator requires a real project ID for configuration but does not consume paid cloud resources. For a pure credential-free API test, run the Vitest suite.

## Environment

`USE_FIRESTORE=false` selects memory when importing the app outside Firebase. The exported cloud function explicitly uses Firestore. Mock API keys and `CRON_SECRET` are optional. Firebase runtime project variables are detected without exposing values.

## Deploy

1. In Firebase Console, choose **Add project**, then enable **Firestore Database** and select a region.
2. Install/login with `pnpm --filter firebase-hosting-functions exec firebase login`.
3. Copy `.firebaserc.example` to `.firebaserc` and replace the sample project ID.
4. Review `firestore.rules`. They require authenticated per-user documents; the demo server uses Admin SDK and bypasses rules, so add Firebase Auth and `userId` ownership before private use.
5. Store secrets with Firebase Secret Manager and bind them in function configuration when replacing mock integrations.
6. From this app directory run `pnpm exec firebase deploy --only hosting,functions,firestore:rules`.
7. View logs under **Functions → Logs**. Scheduled Functions require the Blaze plan; create an `onSchedule` wrapper around the refresh service rather than publicly exposing credentials.

## Tradeoffs

Pros: integrated hosting, functions, Firestore, auth, emulators, and logs. Cons: document-model lock-in, Admin SDK bypasses security rules, deploy setup is heavier, and production Functions/scheduling may require billing.
