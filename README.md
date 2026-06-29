# Portfolio Website

Dark portfolio dashboard inspired by the provided design, built with Next.js, Tailwind CSS, and a Groq-backed chat assistant.

## Setup

1. Install dependencies:
   - `npm install`
2. Add local environment variables in `.env.local`:
   - `GROQ_API_KEY=...`
   - `ADMIN_USERNAME=...`
   - `ADMIN_PASSWORD=...`
   - `AUTH_SECRET=...`
   - `DATABASE_URL=...`
3. Start the app:
   - `npm run dev`

## Notes

- The chat route uses the Groq OpenAI-compatible API with the exact model IDs `groq/compound` and `groq/compound-mini`.
- The chatbot renders Groq responses as markdown with GFM support.
- Admin edits are protected by a signed cookie and saved through a small API to the database.
- The editor now supports project cards, GitHub/YouTube/docs links, contact links, and editable Vercel deploy steps.
- The live editor auto-saves to a Postgres-backed store through `DATABASE_URL`, which is what you should point at your Vercel-managed database/Neon connection.
