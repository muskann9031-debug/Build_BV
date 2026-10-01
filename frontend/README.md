# CampusEats frontend

React/Vite frontend for Build BV, with student, canteen, and admin routes.

```bash
npm install
npm run dev
```

Checks:

```bash
npm run test
npm run lint
npm run build
```

Students sign up with a name and `@banasthali.in` email, then log in using only the registered email. Canteen members enter their email, select a canteen, and enter its access code. Each current test code is exactly its canteen name, including Bella Bite. Admin demo credentials are `admin@campuseats.com` / `admin123`.

Single-canteen carts, staff/item availability, estimated pickup, acceptance, preparation, readiness alerts, and staff order-ID verification are implemented with browser storage. Payment is skipped for testing and the three-character ID is generated at submission. Sessions are per-tab; data updates synchronize tabs on the same browser/origin. Menu items are sample data.

Frontend authentication and name-based codes are for testing. Database-managed codes, verified email sessions, cross-device storage, and payment after acceptance require a backend.

See the [project README](../README.md) and [architecture](../architecture.md) for the directory, rules, storage design, and future payment sequence.
