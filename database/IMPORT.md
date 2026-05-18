# Database import (full site content)

Import in this order in MySQL Workbench or CLI:

1. `modepro_cms_setup.sql` — creates schema
2. `modepro_seed_data.sql` — inserts all content from `client/src/mocks` (images paths, text, 83 products, 31 nav items, 7 CMS pages)

If the database already exists, also run:

3. `migrations/003_version_history.sql` — adds version history table for CMS audit trail

Regenerate seed after mock changes:

```bash
cd server
node scripts/generate-seed-sql.js
```

Default admin: `admin@modepro.com` / `Modepro@123`

Static images live under `client/public/images/`; paths in the DB reference `/images/...`.

## Re-seed (content looks wrong)

If CMS or public pages show stale or incorrect text/images after manual edits:

1. **Back up** anything you need from the admin (or export activity logs first).
2. Re-run **`modepro_seed_data.sql`** against the same database (truncates/replaces seeded rows — see script header for `TRUNCATE` / `DELETE` behavior).
3. If `version_history` is missing on an older DB, run **`migrations/003_version_history.sql`** once.
4. Restart the API server (`cd server && npm run dev`).

To refresh seed SQL from mocks after changing `client/src/mocks`:

```bash
cd server
node scripts/generate-seed-sql.js
```

Then import the regenerated `database/modepro_seed_data.sql`.
