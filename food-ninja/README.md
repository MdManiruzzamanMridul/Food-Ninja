# Food Ninja Web App

Full-stack Next.js 16 food delivery web application with PostgreSQL / Neon database integration and Tailwind CSS v4 styling.

---

## 📦 Current Dependencies

### Production (`package.json`)
- **`next` (`16.3.0`)**: Next.js App Router framework
- **`react` (`19.2.8`)**: React 19 UI library
- **`react-dom` (`19.2.8`)**: React 19 DOM renderer
- **`pg` (`^8.23.0`)**: Node.js PostgreSQL client
- **`csv-parse` (`^7.0.2`)**: CSV parser for data ingestion scripts

### Development (`package.json`)
- **`typescript` (`^5`)**: TypeScript language support
- **`tailwindcss` (`^4`)**: Tailwind CSS v4
- **`@tailwindcss/postcss` (`^4`)**: PostCSS plugin for Tailwind CSS v4
- **`eslint` (`^9`)**: ESLint linter
- **`eslint-config-next` (`16.3.0`)**: Next.js ESLint configuration
- **`@types/node` (`^20`)**, **`@types/react` (`^19`)**, **`@types/react-dom` (`^19`)**, **`@types/pg` (`^8.21.0`)**: TypeScript type definitions

---

## 🛠️ Getting Started

### 1. Database Setup (Neon Serverless Postgres)

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Paste your unmasked Neon / PostgreSQL connection string into `DATABASE_URL` in `.env.local`:
   ```env
   DATABASE_URL="postgresql://user:password@ep-sample-123456.us-east-2.aws.neon.tech/food_ninja?sslmode=require"
   ```

*(Note: `.env.local` is gitignored so credentials remain secure).*

### 2. Import Restaurant Data (Optional)

The project includes an importer for the [Dhaka Restaurant Directory](https://github.com/abusalehmnasim/dhaka-restaurant-directory) CSV:

```bash
# Import records into Neon database
npm run db:import-dhaka -- path/to/dhaka_restaurants.csv

# Verify records
npm run db:verify-dhaka
```

### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## 📜 Available NPM Scripts

| Script | Command | Description |
| :--- | :--- | :--- |
| `npm run dev` | `next dev` | Starts local Next.js development server |
| `npm run build` | `next build` | Builds application for production deployment |
| `npm run start` | `next start` | Starts built production application server |
| `npm run lint` | `eslint` | Runs ESLint across the project |
| `npm run db:import-dhaka` | `node --env-file=.env.local scripts/import-dhaka-restaurants.mjs` | Imports CSV data into `dhaka_restaurants` table |
| `npm run db:verify-dhaka` | `node --env-file=.env.local scripts/verify-dhaka-restaurants.mjs` | Verifies restaurant record count in database |

