This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

## Neon database setup

1. Run `npx neonctl@latest init` from this folder in your own terminal and complete the Neon sign-in and project-selection prompts.
2. Copy `.env.example` to `.env.local`.
3. Paste the unmasked Neon connection string into `DATABASE_URL` in `.env.local`.

`.env.local` is intentionally ignored by Git, so the database password stays private.

### Import 100 Dhaka restaurants

The project includes a repeatable importer for the public [Dhaka Restaurant Directory](https://github.com/abusalehmnasim/dhaka-restaurant-directory), which is compiled from OpenStreetMap data. After cloning that repository, run:

```bash
npm run db:import-dhaka -- path/to/dhaka_restaurants.csv
```

The importer creates the `dhaka_restaurants` table and upserts 100 usable records. The schema is stored in `db/schema.sql`.

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
