# CMS Migrations

This directory is for reviewed CMS migration payloads and related notes.

- `applied/` contains one-off Firestore patch payloads that have already been applied.
- New production migrations must be run through `scripts/apply-firestore-cms-patch.mjs` in dry-run mode first.
- Do not store CMS backup exports or service-account credentials in this repository.
- Do not run migrations from local machines without explicit production-write confirmation.

