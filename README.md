# Hudson Heights Roleplay Forums

A GitHub Pages-ready frontend starter for Hudson Heights Roleplay.

## Included

- Responsive dark/red forum homepage
- Server Information and Announcements
- Faction Information, Applications, Official Factions, and Media
- NYPD, EMS, and Business sections
- Player Support
- Latest posts sidebar
- Server status mockup
- Login / Register UI mockups
- Create Thread UI mockup
- Mobile layout

## Put it on GitHub Pages

1. Create a new GitHub repository, for example `hudson-heights-forums`.
2. Upload `index.html`, `styles.css`, and `app.js` to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Choose the `main` branch and `/ (root)`.
6. Save. GitHub will give you a `github.io` website address.

## Customize links

Open `app.js` and replace the Discord alert with your Discord invite.
Replace the FiveM connect button behavior with your `https://cfx.re/join/...` link.

## Important

GitHub Pages is static hosting. The login/register/thread forms in this starter are UI demos only.

For real accounts and forum data, connect a backend such as Supabase:

- `profiles`
- `forums`
- `threads`
- `posts`
- `factions`
- `faction_members`
- `applications`
- `roles`

You can also add Discord OAuth later.

## Branding

This starter is an original Hudson Heights design inspired by the structure common to roleplay community forums. It does not copy The Towns Roleplay code, branding, or assets.
