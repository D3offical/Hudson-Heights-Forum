# Hudson Heights Forum V5 — Supabase Setup

V5 is the first version prepared for a real backend.

## 1. Create a Supabase project
Go to Supabase and create a project.

## 2. Create the database tables
Open **SQL Editor** in Supabase and run the entire contents of `schema.sql`.

This creates:
- profiles
- threads
- replies
- faction_applications
- Row Level Security policies
- a trigger that automatically creates a profile when someone registers

## 3. Add your project credentials
In Supabase, open **Project Settings → API**.

Copy:
- Project URL
- anon / publishable key

Open `supabase-config.js` and replace:

```js
window.HH_SUPABASE_URL = "PASTE_YOUR_SUPABASE_URL_HERE";
window.HH_SUPABASE_ANON_KEY = "PASTE_YOUR_SUPABASE_ANON_KEY_HERE";
```

Do **not** put the `service_role` secret key into GitHub or browser code.

## 4. Upload V5 to GitHub
Upload all V5 files to the root of your existing `Hudson-Heights-Forum` repo and commit to `main`.

GitHub Pages will redeploy automatically.

## 5. Create your first account
Open:

`auth.html#register`

Create an account.

If email confirmation is enabled in Supabase Auth, confirm the email first.

## 6. Make yourself an admin
In Supabase SQL Editor, run:

```sql
update public.profiles
set role = 'admin'
where username = 'YOUR_USERNAME';
```

Use your exact forum username.

After that, `admin.html` can review faction applications.

## What works after setup
- real registration
- real login/logout
- saved forum threads
- saved replies
- saved faction applications
- faction-management/admin application review
- Row Level Security

## What V5 does not include yet
- Discord OAuth
- profile editing/avatar uploads
- thread moderation UI
- automatic FiveM player count
- file/media uploads
- notifications
- email templates
