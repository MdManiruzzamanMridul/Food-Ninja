from flask import Blueprint, request, jsonify
from db import get_connection, load_query
import utils
import auth
import psycopg


login_bp = Blueprint("login", __name__)


@login_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json() or {}

    user_type = data.get("user_type")

    if user_type not in ("user", "admin", "rider", "owner"):
        return jsonify({
            "success": False,
            "message": "Invalid user type"
        }), 400

    username = data.get("username")
    email = data.get("email")
    phone = data.get("phone")
    password = data.get("password")

    # Every admin must provide all of these
    if user_type == "admin":

        if (
            not isinstance(username, str) or
            not isinstance(email, str) or
            not isinstance(phone, str) or
            not isinstance(password, str) or
            not username.strip() or
            not email.strip() or
            not phone.strip() or
            not password
        ):
            return jsonify({
                "success": False,
                "message": "Insufficient registration information"
            }), 400

    # Every user, rider, and owner must provide name
    else:
        name = data.get("name")

        if (
            not isinstance(username, str) or
            not isinstance(name, str) or
            not isinstance(email, str) or
            not isinstance(phone, str) or
            not isinstance(password, str) or
            not username.strip() or
            not name.strip() or
            not email.strip() or
            not phone.strip() or
            not password
        ):
            return jsonify({
                "success": False,
                "message": "Insufficient registration information"
            }), 400

    # Rider additionally needs vehicle
    if user_type == "rider":
        vehicle = data.get("vehicle")

        if (
            not isinstance(vehicle, str) or
            not vehicle.strip()
        ):
            return jsonify({
                "success": False,
                "message": "Insufficient registration information"
            }), 400

        vehicle = vehicle.strip().lower()

        if vehicle not in ("bike", "bicycle"):
            return jsonify({
                "success": False,
                "message": "Invalid vehicle"
            }), 400

    # Owner additionally handles NID
    if user_type == "owner":
        nid = data.get("nid")
        if not isinstance(nid, str) or not nid.strip():
            import time
            nid = f"NID{int(time.time())}{username[:6]}"
        else:
            nid = nid.strip()

    # Normalize username
    username = utils.normalize_username(username)

    if username is None:
        return jsonify({
            "success": False,
            "message": "Invalid username"
        }), 400

    # Validate email
    email = email.strip().lower()

    if not utils.is_valid_email(email):
        return jsonify({
            "success": False,
            "message": "Invalid email"
        }), 400

    # Normalize phone to 01XXXXXXXXX
    phone = utils.normalize_bd_phone(phone)

    if phone is None:
        return jsonify({
            "success": False,
            "message": "Invalid phone number"
        }), 400

    # Validate user's/rider's/owner's name
    if user_type in ("user", "rider", "owner"):
        name = name.strip()

        if not utils.is_valid_name(name):
            return jsonify({
                "success": False,
                "message": "Invalid name"
            }), 400

    # Ensure username is globally unique across all accounts as a primary key
    if utils.is_username_taken(username):
        return jsonify({
            "success": False,
            "message": f"Username '{username}' is already taken. Please choose another."
        }), 409

    try:
        with get_connection() as conn:
            with conn.cursor() as cur:

                # Check whether username/email/phone already exists
                if user_type == "admin":
                    query = load_query("login.sql", "admin_check")
                elif user_type == "rider":
                    query = load_query("login.sql", "rider_check")
                elif user_type == "owner":
                    query = load_query("login.sql", "owner_check")
                else:
                    query = load_query("login.sql", "user_check")

                cur.execute(
                    query,
                    (username, email, phone)
                )

                if cur.fetchone():
                    return jsonify({
                        "success": False,
                        "message": "Already registered"
                    }), 409

                # Hash password
                hashed_password = auth.hash_password(password)

                # Register
                if user_type == "admin":

                    query = load_query(
                        "login.sql",
                        "admin_register"
                    )

                    cur.execute(
                        query,
                        (
                            username,
                            email,
                            phone,
                            hashed_password
                        )
                    )

                elif user_type == "rider":

                    query = load_query(
                        "login.sql",
                        "rider_register"
                    )

                    cur.execute(
                        query,
                        (
                            username,
                            name,
                            email,
                            phone,
                            hashed_password,
                            vehicle
                        )
                    )

                elif user_type == "owner":

                    query = load_query(
                        "login.sql",
                        "owner_register"
                    )

                    cur.execute(
                        query,
                        (
                            username,
                            name,
                            email,
                            phone,
                            nid,
                            hashed_password,
                            "pending"
                        )
                    )

                else:

                    query = load_query(
                        "login.sql",
                        "user_register"
                    )

                    cur.execute(
                        query,
                        (
                            username,
                            name,
                            email,
                            phone,
                            hashed_password
                        )
                    )

                conn.commit()

                return jsonify({
                    "success": True,
                    "message": (
                        "Admin registered successfully"
                        if user_type == "admin"
                        else "Rider registered successfully"
                        if user_type == "rider"
                        else "Restaurant Owner registered successfully"
                        if user_type == "owner"
                        else "User registered successfully"
                    )
                }), 201

    except psycopg.errors.UniqueViolation:
        return jsonify({
            "success": False,
            "message": "Already registered"
        }), 409

    except psycopg.Error:
        return jsonify({
            "success": False,
            "message": "Registration failed"
        }), 500


@login_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}

    user_type = data.get("user_type")
    user_info = data.get("user_info")
    password = data.get("password")

    if user_type not in ("user", "admin", "rider", "owner"):
        return jsonify({
            "success": False,
            "message": "Invalid user type"
        }), 400

    # Login requires only user_info + password
    if (
        not isinstance(user_info, str) or
        not user_info.strip() or
        not isinstance(password, str) or
        not password
    ):
        return jsonify({
            "success": False,
            "message": "Insufficient login information"
        }), 400

    user_info = user_info.strip()

    # Determine whether user_info is an email,
    # phone number, or username.

    if "@" in user_info:

        # Looks like an email, so it must be a valid email.
        if not utils.is_valid_email(user_info):
            return jsonify({
                "success": False,
                "message": "Invalid credentials"
            }), 401

        identifier = user_info.lower()

    elif (
        user_info.startswith("01") or
        user_info.startswith("+8801") or
        user_info.startswith("8801")
    ):

        # Normalize phone to 01XXXXXXXXX
        identifier = utils.normalize_bd_phone(user_info)

        if identifier is None:
            return jsonify({
                "success": False,
                "message": "Invalid credentials"
            }), 401

    else:

        # Otherwise, treat it as a username.
        identifier = utils.normalize_username(user_info)

        if identifier is None:
            return jsonify({
                "success": False,
                "message": "Invalid credentials"
            }), 401

    try:
        with get_connection() as conn:
            with conn.cursor() as cur:

                if user_type == "admin":
                    query = load_query(
                        "login.sql",
                        "admin_check"
                    )
                elif user_type == "rider":
                    query = load_query(
                        "login.sql",
                        "rider_check"
                    )
                elif user_type == "owner":
                    query = load_query(
                        "login.sql",
                        "owner_check"
                    )
                else:
                    query = load_query(
                        "login.sql",
                        "user_check"
                    )

                cur.execute(
                    query,
                    (identifier, identifier, identifier)
                )

                row = cur.fetchone()

                if not row:
                    return jsonify({
                        "success": False,
                        "message": "Invalid credentials"
                    }), 401

                stored_username = row["username"]
                stored_password = row["password_hash"]
                stored_status = row.get("status", "pending") if isinstance(row, dict) else "pending"

                if not auth.verify_password(
                    password,
                    stored_password
                ):
                    return jsonify({
                        "success": False,
                        "message": "Invalid credentials"
                    }), 401

                token = auth.create_token(
                    stored_username,
                    user_type
                )

                return jsonify({
                    "success": True,
                    "token": token,
                    "username": stored_username,
                    "user_type": user_type,
                    "status": stored_status
                }), 200

    except psycopg.Error:
        return jsonify({
            "success": False,
            "message": "Login failed"
        }), 500