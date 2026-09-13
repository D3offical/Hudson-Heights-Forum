# Hudson Heights Roleplay Forum V5

V5 keeps the V4 visual design and adds a Supabase-ready backend layer.

Start with `SETUP.md`.

Important: the backend will not activate until you:
1. create a Supabase project,
2. run `schema.sql`,
3. paste the project URL + anon key into `supabase-config.js`.

Never expose a Supabase `service_role` key in a GitHub Pages site.
