import os

from dotenv import load_dotenv
from psycopg_pool import ConnectionPool

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Create the connection pool when the application starts
pool = ConnectionPool(
    conninfo=DATABASE_URL,
    min_size=1,
    max_size=10
)


def get_connection():
    return pool.connection()