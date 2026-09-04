import os
import sys
from pathlib import Path
from dotenv import load_dotenv
from psycopg_pool import ConnectionPool
from psycopg.rows import dict_row

# Locate and load .env from Backend directory or project root
base_dir = Path(__file__).resolve().parent
env_paths = [
    base_dir / ".env",
    base_dir.parent / ".env",
    base_dir.parent / ".env.local",
]

for env_path in env_paths:
    if env_path.exists():
        load_dotenv(dotenv_path=env_path)
        break
else:
    load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    print(
        "\n" + "=" * 70 + "\n"
        "❌ [CRITICAL DATABASE CONFIGURATION ERROR]\n"
        "DATABASE_URL is not set or .env file is missing!\n\n"
        "Please create a .env file in the Backend directory (Backend/.env) with:\n"
        "  DATABASE_URL=postgresql://<username>:<password>@localhost:5432/<database_name>\n"
        "  JWT_SECRET=your_jwt_secret_key\n\n"
        "Example for local PostgreSQL (default user 'postgres'):\n"
        "  DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/food_ninja\n"
        + "=" * 70 + "\n",
        file=sys.stderr,
    )

# Create the connection pool when the application starts
pool = ConnectionPool(
    conninfo=DATABASE_URL or "postgresql://localhost",
    min_size=1,
    max_size=10,
    open=True if DATABASE_URL else False,
    kwargs={"row_factory": dict_row}
)

def get_connection():
    if not DATABASE_URL:
        raise ValueError(
            "DATABASE_URL is missing. Please create a Backend/.env file with your PostgreSQL connection string."
        )
    return pool.connection()

def load_query(filename, query_name):
    # Resolve directory relative to db.py
    queries_path = base_dir / "queries" / filename
    if not queries_path.exists():
        queries_path = base_dir / "Queries" / filename

    if not queries_path.exists():
        raise FileNotFoundError(f"SQL file '{filename}' not found in {base_dir / 'Queries'}")

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