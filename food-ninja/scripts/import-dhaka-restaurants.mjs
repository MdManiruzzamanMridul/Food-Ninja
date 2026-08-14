import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { parse } from "csv-parse/sync";
import pg from "pg";

const sourceFile = process.argv[2];

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing. Add it to .env.local before importing.");
}

if (!sourceFile) {
  throw new Error("Usage: npm run db:import-dhaka -- <path-to-dhaka_restaurants.csv>");
}

const rawCsv = await readFile(resolve(sourceFile), "utf8");
const rows = parse(rawCsv, {
  bom: true,
  columns: false,
  relax_column_count: true,
  skip_empty_lines: true,
  trim: true,
});

const blankToNull = (value) => {
  const cleaned = value?.trim();
  return cleaned && cleaned.toLowerCase() !== "n/a" ? cleaned : null;
};

const toNumber = (value) => {
  const parsed = Number(blankToNull(value));
  return Number.isFinite(parsed) ? parsed : null;
};

const restaurants = rows
  .map((row) => ({
    name: blankToNull(row[0]),
    venueType: blankToNull(row[1]),
    cuisine: blankToNull(row[2]),
    area: blankToNull(row[3]),
    address: blankToNull(row[4]),
    phone: blankToNull(row[5]),
    website: blankToNull(row[6]),
    openingHours: blankToNull(row[7]),
    rating: toNumber(row[8]),
    latitude: toNumber(row[9]),
    longitude: toNumber(row[10]),
    mapsUrl: blankToNull(row[11]),
  }))
  .filter((restaurant) => restaurant.name && restaurant.latitude !== null && restaurant.longitude !== null)
  .slice(0, 100);

if (restaurants.length !== 100) {
  throw new Error(`Expected 100 usable records, found ${restaurants.length}.`);
}

const schema = await readFile(new URL("../db/schema.sql", import.meta.url), "utf8");
const { Client } = pg;
const connectionString = process.env.DATABASE_URL.replace(/sslmode=(?:require|prefer|verify-ca)/g, "sslmode=verify-full");
const client = new Client({ connectionString });

try {
  await client.connect();
  await client.query(schema);
  await client.query("BEGIN");

  for (const restaurant of restaurants) {
    const sourceKey = createHash("sha256")
      .update([restaurant.name, restaurant.venueType, restaurant.latitude, restaurant.longitude].join("|"))
      .digest("hex");

    await client.query(
      `INSERT INTO dhaka_restaurants (
        source_key, name, venue_type, cuisine, area, address, phone, website,
        opening_hours, rating, latitude, longitude, maps_url
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
      )
      ON CONFLICT (source_key) DO UPDATE SET
        name = EXCLUDED.name,
        venue_type = EXCLUDED.venue_type,
        cuisine = EXCLUDED.cuisine,
        area = EXCLUDED.area,
        address = EXCLUDED.address,
        phone = EXCLUDED.phone,
        website = EXCLUDED.website,
        opening_hours = EXCLUDED.opening_hours,
        rating = EXCLUDED.rating,
        latitude = EXCLUDED.latitude,
        longitude = EXCLUDED.longitude,
        maps_url = EXCLUDED.maps_url,
        imported_at = NOW()`,
      [
        sourceKey,
        restaurant.name,
        restaurant.venueType,
        restaurant.cuisine,
        restaurant.area,
        restaurant.address,
        restaurant.phone,
        restaurant.website,
        restaurant.openingHours,
        restaurant.rating,
        restaurant.latitude,
        restaurant.longitude,
        restaurant.mapsUrl,
      ],
    );
  }

  await client.query("COMMIT");
  const { rows: countRows } = await client.query(
    "SELECT COUNT(*)::int AS count FROM dhaka_restaurants WHERE source_name = 'dhaka-restaurant-directory'",
  );
  console.log(`Imported 100 restaurants. Directory records in Neon: ${countRows[0].count}.`);
} catch (error) {
  await client.query("ROLLBACK");
  throw error;
} finally {
  await client.end();
}
