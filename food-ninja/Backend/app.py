from flask import Flask, request, jsonify
from db import get_connection

app = Flask(__name__)


def load_query(filename, query_name):

    with open(f"queries/{filename}", "r") as file:
        content = file.read()

    queries = content.split("--name:")

    for query in queries:
        lines = query.strip().split("\n")

        if not lines:
            continue

        name = lines[0].strip()

        if name == query_name:
            return "\n".join(lines[1:]).strip()

    raise ValueError(f"Query '{query_name}' not found")


@app.route("/login", methods=["POST"])
def login():

    # Get JSON sent by the frontend
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    # Basic validation
    if not email or not password:
        return jsonify({
            "success": False,
            "message": "Email and password are required"
        }), 400

    # Load SQL from file
    query = load_query("login.sql")

    # Get a connection from the pool
    with get_connection() as conn:

        with conn.cursor() as cur:

            # Execute SQL
            cur.execute(query, (email,))

            # Get first matching user
            user = cur.fetchone()

    # User doesn't exist
    if user is None:
        return jsonify({
            "success": False,
            "message": "Invalid email or password"
        }), 401

    # For now: dummy response
    return jsonify({
        "success": True,
        "message": "Login successful",
        "user_id": user[0]
    }), 200


@app.route("/", methods=["GET"])
def home():
    return "Flask backend is running!"


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)