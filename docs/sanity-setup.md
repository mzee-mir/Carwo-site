# Connecting Carwo to Sanity

The site reads products, lookbook, news, branches and settings from Sanity when
`NEXT_PUBLIC_SANITY_PROJECT_ID` is set. Without it (or with `CARWO_FIXTURES=1`) it uses the built-in
content in `lib/sanity/fixtures.ts`.

## One-time setup

1. **Create the project** at https://www.sanity.io/manage → *Create new project* → name it `Carwo`,
   dataset `production`, visibility **Public** (published content is readable; editing still needs a login).
2. **Allow the website to open the Studio**: project → *API* → *CORS origins* → *Add CORS origin*, tick
   **Allow credentials**, for each of:
   - `http://localhost:3000`
   - your Vercel address, e.g. `https://carwo-site.vercel.app` (and your own domain later)
3. **Local settings**: create `.env.local` (never committed) from `.env.example` and set
   `NEXT_PUBLIC_SANITY_PROJECT_ID` to the project ID shown on the project page.
4. **Log in once** (opens your browser): `npx sanity login`
5. **Copy the current site into Sanity**: `npm run seed`
   (uploads every photo and creates all products, categories, lookbook stories, news posts, the Bosaso
   branch and site settings; it refuses to run on a dataset that already has content unless you add
   `-- --replace`).
6. Open http://localhost:3000/studio and log in — the content should all be there.

## Vercel

In the Vercel project → *Settings → Environment Variables* add:

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | the project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `SANITY_REVALIDATE_SECRET` | a long random string you make up |

Then **Redeploy**.

## Instant updates (optional)

Pages refresh from Sanity at most every 60 seconds on their own. To update instantly on publish, add a
webhook in Sanity → *API* → *Webhooks*:

- URL: `https://YOUR-SITE/api/revalidate`
- Dataset: `production`, trigger on Create, Update and Delete
- Secret: the same value as `SANITY_REVALIDATE_SECRET`
- HTTP method `POST`, API version `v2025-02-19`, leave projection empty
