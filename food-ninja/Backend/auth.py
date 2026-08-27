import os
import jwt
from datetime import datetime, timedelta, timezone
from werkzeug.security import generate_password_hash, check_password_hash


def get_jwt_secret():
    return os.getenv("JWT_SECRET", "food-ninja-default-secret-key-2026")


def hash_password(password):
    return generate_password_hash(password)


def verify_password(password, hashed_password):
    return check_password_hash(hashed_password, password)


def create_token(username, user_type):
    payload = {
        "username": username,
        "user_type": user_type,
        "exp": datetime.now(timezone.utc) + timedelta(hours=2)
    }

    return jwt.encode(
        payload,
        get_jwt_secret(),
        algorithm="HS256"
    )


def verify_token(token):
    try:
        payload = jwt.decode(
            token,
            get_jwt_secret(),
            algorithms=["HS256"]
        )
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None