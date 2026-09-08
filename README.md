# The Blotter

A personal logbook for staying consistent across three things I kept dropping the moment I picked up another: Data Structures & Algorithms, development, and maths. I'd solve DSA problems for a stretch and development would go completely untouched, then swing back to development and ignore the maths that actually shapes half of what I build. the thing that actually gives me a sense of accomplishment turned out to be maths, and I'd been treating it like an afterthought. So I built this to hold myself consistently.

This isn't about a resume line. It's about making myself worth more than a paycheck shaping something with intention and feeling the work, instead of juggling between things badly and calling it progress.


## Features

> Save and track daily progress from anywhere, no complex system required.
>
> Set a monthly goal around the three topics that matter to you, and work toward it.
>
> At the end of the day, before you lie down update it from browser directly.

## Setup

1. Clone the repo:
```bash
   git clone https://github.com/ifrah-ashraf/blotter.git
   cd blotter
```

2. Add environment variables — create a `.env` file:
```bash
   DATABASE_URL=<your local or free Supabase Postgres connection string>
   SESSION_SECRET=<generate with: openssl rand -base64 32>
```

3. Install dependencies:
```bash
   pnpm install
```

4. Generate the Prisma client and apply migrations (make sure `DATABASE_URL` is set first):
```bash
   pnpm prisma generate
   pnpm prisma migrate deploy
```

5. Create your user — the `/write` page is login-gated. There's no signup route by design, since this is a single-user app; the user-creation script isn't committed to this repo either, since it's a direct write path to the database and shouldn't be something anyone who clones this can run. Write a small standalone script that hashes a password with `bcryptjs` and inserts the result into the `users` table via Prisma, then run it once locally with `tsx`.

6. Run the dev server:
```bash
   pnpm run dev
```

The read page (`/`) is public — no login needed to view logged days. The write page (`/write`) requires the session created in step 5.