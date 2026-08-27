import os
from pathlib import Path
from dotenv import load_dotenv
from psycopg_pool import ConnectionPool
import psycopg
from psycopg.rows import dict_row

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Create the connection pool when the application starts
pool = ConnectionPool(
    conninfo=DATABASE_URL,
    min_size=1,
    max_size=10,
    kwargs={"row_factory": dict_row}
)

def get_connection():
    return pool.connection()

def load_query(filename, query_name):
    # Resolve directory relative to db.py
    base_dir = Path(__file__).resolve().parent
    queries_path = base_dir / "Queries" / filename
    if not queries_path.exists():
        queries_path = base_dir / "queries" / filename

    with open(queries_path, "r", encoding="utf-8") as file:
        content = file.read()

    queries = content.split("--name:")

    for query in queries:
        lines = query.strip().split("\n")

        if not lines:
            continue

        name = lines[0].strip()

        if name == query_name:
            return "\n".join(lines[1:]).strip()

    raise ValueError(f"Query '{query_name}' not found in {filename}")