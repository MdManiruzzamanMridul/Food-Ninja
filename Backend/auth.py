import os
import jwt
import uuid
from datetime import datetime, timedelta, timezone
from flask import request
from werkzeug.security import generate_password_hash, check_password_hash
from db import get_connection, load_query


def get_jwt_secret():
    return os.getenv("JWT_SECRET", "food-ninja-default-secret-key-2026")


def hash_password(password):
    return generate_password_hash(password)


def verify_password(password, hashed_password):
    return check_password_hash(hashed_password, password)


def create_token(username, user_type):
    jti = str(uuid.uuid4())
    payload = {
        "username": username,
        "user_type": user_type,
        "jti": jti,
        "exp": datetime.now(timezone.utc) + timedelta(hours=2)
    }

    return jwt.encode(
        payload,
        get_jwt_secret(),
        algorithm="HS256"
    )


def is_token_revoked(jti):
    if not jti:
        return False

    try:
        query = load_query("token.sql", "check_revoked_token")
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(query, (jti,))
                return cur.fetchone() is not None

    except Exception:
        return False


def verify_token(token):
    try:
        payload = jwt.decode(
            token,
            get_jwt_secret(),
            algorithms=["HS256"]
        )

        jti = payload.get("jti")
        if jti and is_token_revoked(jti):
            return None
        
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


def get_user_info():
    auth_header = request.headers.get("Authorization")

    if not auth_header:
        return None
    
    parts = auth_header.split(" ")
    if len(parts) != 2 or parts[0] != "Bearer":
        return None

    token = parts[1]
    payload = verify_token(token)

    if payload is None:
        return None

    if not payload.get("username") or not payload.get("user_type"):
        return None
    
    return payload


def revoke_token(token):
    try:
        payload = jwt.decode(
            token,
            get_jwt_secret(),
            algorithms=["HS256"],
            options={"verify_exp": False}
        )

        jti = payload.get("jti")
        exp = payload.get("exp")

        if not jti or not exp:
            return False

        expires_at = datetime.fromtimestamp(exp, timezone.utc)

        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    CREATE TABLE IF NOT EXISTS revoked_tokens (
                        jti VARCHAR(255) PRIMARY KEY,
                        expires_at TIMESTAMPTZ NOT NULL
                    )
                """)
                query = load_query("token.sql", "remove_expired_tokens")
                cur.execute(query)

                query = load_query("token.sql", "add_revoked_token")
                cur.execute(query, (jti, expires_at))
                conn.commit()
        return True

    except Exception:
        return False