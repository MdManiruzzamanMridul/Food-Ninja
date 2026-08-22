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


@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE,OPTIONS"
    return response


@app.route("/login", methods=["POST", "OPTIONS"])
def login():
    if request.method == "OPTIONS":
        return "", 200

    # Get JSON sent by the frontend
    data = request.get_json(silent=True) or {}

    username = data.get("username")
    email = data.get("email")
    phone = data.get("phone")
    password = data.get("password")

    # Basic validation for the 4 admin attributes
    if not username or not email or not phone or not password:
        return jsonify({
            "success": False,
            "message": "username, email, phone, and password are all required"
        }), 400

    # Load SQL from file
    query = load_query("login.sql", "insert_admin")

    # Get a connection from the pool and insert the 4 attributes
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(query, (username, email, phone, password))
            conn.commit()

    return jsonify({
        "success": True,
        "message": f"Admin '{username}' successfully saved to database!",
        "data": {
            "username": username,
            "email": email,
            "phone": phone
        }
    }), 200


@app.route("/", methods=["GET"])
def home():
    return "Flask backend is running!"


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)