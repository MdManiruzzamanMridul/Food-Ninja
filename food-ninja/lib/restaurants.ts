import "server-only";
import { Pool } from "pg";

export type RestaurantCard = {
  id: string;
  name: string;
  cuisine: string;
  area: string;
  rating: string;
  mapsUrl: string | null;
};

const globalForDatabase = globalThis as typeof globalThis & {
  restaurantPool?: Pool;
};

function getConnectionString(): string | undefined {
  if (!process.env.DATABASE_URL) return undefined;
  return process.env.DATABASE_URL.replace(/sslmode=(?:require|prefer|verify-ca)/g, "sslmode=verify-full");
}

const pool =
  globalForDatabase.restaurantPool ??
  new Pool({
    connectionString: getConnectionString(),
    max: 5,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDatabase.restaurantPool = pool;
}

export async function getRestaurantCards(limit = 12): Promise<RestaurantCard[]> {
  if (!process.env.DATABASE_URL) {
    return [];
  }

  try {
    const { rows } = await pool.query<{
      id: string;
      name: string;
      cuisine: string | null;
      venue_type: string | null;
      area: string | null;
      rating: string | null;
      maps_url: string | null;
    }>(
      `SELECT id, name, cuisine, venue_type, area, rating, maps_url
       FROM dhaka_restaurants
       WHERE source_name = 'dhaka-restaurant-directory'
       ORDER BY rating DESC NULLS LAST, name ASC
       LIMIT $1`,
      [limit],
    );

    return rows.map((restaurant) => ({
      id: restaurant.id,
      name: restaurant.name,
      cuisine: restaurant.cuisine?.replaceAll(";", " • ") ?? restaurant.venue_type ?? "Local food",
      area: restaurant.area ?? "Dhaka",
      rating: restaurant.rating ?? "New",
      mapsUrl: restaurant.maps_url,
    }));
  } catch (error) {
    console.error("Unable to load restaurants from Neon", error);
    return [];
  }
}
