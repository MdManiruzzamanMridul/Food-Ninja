import pg from "pg";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing. Add it to .env.local before verifying.");
}

const { Client } = pg;
const connectionString = process.env.DATABASE_URL.replace(/sslmode=(?:require|prefer|verify-ca)/g, "sslmode=verify-full");
const client = new Client({ connectionString });

try {
  await client.connect();
  const { rows } = await client.query(
    "SELECT COUNT(*)::int AS count FROM dhaka_restaurants WHERE source_name = 'dhaka-restaurant-directory'",
  );
  console.log(`Dhaka restaurant records in Neon: ${rows[0].count}`);
} finally {
  await client.end();
}
