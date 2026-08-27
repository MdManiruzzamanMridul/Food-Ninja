from flask import Blueprint, request, jsonify
from db import get_connection, load_query
import auth


login_bp = Blueprint("login", __name__)

@login_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json() or {}

    with get_connection() as conn:     
        with conn.cursor() as cur: 

            user_type = data.get("user_type")

            if user_type == "admin":
                username = data.get("username")
                email = data.get("email")
                phone = data.get("phone")
                password = data.get("password")

                if not email or not password or not phone or not username:
                    return jsonify({
                        "success": False,
                        "message": "insufficient login info"
                    }), 400

                # admin already registered
                query = load_query("login.sql", "admin_check")
                
                cur.execute(query, (username, email, phone))
                if cur.fetchone():
                    return jsonify({
                        "success": False,
                        "message": "already exists"
                    }), 409

                # register admin
                query = load_query("login.sql", "admin_register") 
                hashed_password = auth.hash_password(password)

                cur.execute(query, (username, email, phone, hashed_password))
                conn.commit()
                return jsonify({
                    "success": True,
                    "message": "Admin registered successfully"
                }), 201

            if user_type == "user":
                username = data.get("username")
                name = data.get("name")
                email = data.get("email")
                phone = data.get("phone")
                password = data.get("password")

                if not email or not password or not phone or not name or not username:
                    return jsonify({
                        "success": False,
                        "message": "insufficient login info"
                    }), 400

                # user already registered
                query = load_query("login.sql", "user_check")
                
                cur.execute(query, (email, phone))
                if cur.fetchone():
                    return jsonify({
                        "success": False,
                        "message": "already exists"
                    }), 409

                # register user
                query = load_query("login.sql", "user_register") 
                hashed_password = auth.hash_password(password)

                cur.execute(query, (username, name, email, phone, hashed_password))
                conn.commit()
                return jsonify({
                    "success": True,
                    "message": "User registered successfully"
                }), 201

            return jsonify({
                "success": False,
                "message": "Invalid user type"
            }), 400


@login_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}

    with get_connection() as conn:     
        with conn.cursor() as cur: 

            user_type = data.get("user_type")

            if user_type == "admin":
                username = data.get("username")
                email = data.get("email")
                phone = data.get("phone")
                password = data.get("password")

                if not email or not password or not username or not phone:
                    return jsonify({
                        "success": False,
                        "message": "insufficient login info"
                    }), 400

                # admin not registered
                query = load_query("login.sql", "admin_check")
                
                cur.execute(query, (username, email, phone))
                row = cur.fetchone()
                if not row:
                    return jsonify({
                        "success": False,
                        "message": "does not exist"
                    }), 401

                stored_username = row["username"]
                stored_pass = row["password_hash"]
                if auth.verify_password(password, stored_pass):
                    token = auth.create_token(stored_username, user_type)
                    return jsonify({
                        "success": True,
                        "token": token,
                        "username": stored_username,
                        "user_type": user_type
                    }), 200
                else:
                    return jsonify({
                        "success": False,
                        "message": "password mismatch"
                    }), 401

            if user_type == "user":
                email = data.get("email")
                phone = data.get("phone")
                password = data.get("password")

                if not email or not password or not phone:
                    return jsonify({
                        "success": False,
                        "message": "insufficient login info"
                    }), 400

                # user not registered
                query = load_query("login.sql", "user_check")
                
                cur.execute(query, (email, phone))
                row = cur.fetchone()
                if not row:
                    return jsonify({
                        "success": False,
                        "message": "does not exist"
                    }), 401

                stored_username = row["username"]
                stored_pass = row["password_hash"]
                if auth.verify_password(password, stored_pass):
                    token = auth.create_token(stored_username, user_type)
                    return jsonify({
                        "success": True,
                        "token": token,
                        "username": stored_username,
                        "user_type": user_type
                    }), 200
                else:
                    return jsonify({
                        "success": False,
                        "message": "password mismatch"
                    }), 401

            return jsonify({
                "success": False,
                "message": "Invalid user type"
            }), 400