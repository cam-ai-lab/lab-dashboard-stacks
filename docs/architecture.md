# Architecture

Every module has an intentionally equivalent edge-to-storage flow. Provider adapters vary while widget semantics remain in `@dashboard/shared`.

```mermaid
flowchart LR
    Browser[Dashboard browser] --> UI[Provider UI or server-rendered HTML]
    UI --> API[Comparable API contract]
    API --> Shared["@dashboard/shared\nvalidation, seeds, refresh, config status"]
    API --> Adapter{Storage adapter}
    Adapter --> Memory[Memory fallback]
    Adapter --> Supabase[(Supabase Postgres)]
    Adapter --> D1[(Cloudflare D1)]
    Adapter --> Firestore[(Firestore)]
    Adapter --> Postgres[(Postgres)]
    Adapter --> SQLite[(SQLite)]
    Scheduler[Provider scheduler] -. optional POST refresh .-> API
```

The add flow validates a three-field request, generates the identifier and timestamp in the backend, persists through the selected adapter, and returns the created widget. Refresh reads all widgets, applies deterministic mocked external values to known seed identifiers, updates timestamps, and writes the set back atomically where the database supports transactions or batches.

Production auth is intentionally outside the comparable core. Supabase includes per-user RLS policies, Firebase includes authenticated-user rules, and every README identifies the authentication layer required before storing private dashboard data.
