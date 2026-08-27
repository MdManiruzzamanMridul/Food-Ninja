from db import get_connection, load_query
import psycopg
import re


EMAIL_PATTERN = r"^[^@\s]+@[^@\s]+\.[^@\s]+$"
NAME_PATTERN = r"^[A-Za-z']+$"
USERNAME_PATTERN = r"^[A-Za-z][A-Za-z0-9_]*$"


def is_valid_email(email):
    return re.fullmatch(EMAIL_PATTERN, email) is not None


def normalize_bd_phone(phone):
    if not isinstance(phone, str):
        return None

    phone = phone.strip()

    if phone.startswith("01"):
        normalized = phone

    elif phone.startswith("+8801"):
        normalized = "0" + phone[4:]

    elif phone.startswith("8801"):
        normalized = "0" + phone[3:]

    else:
        return None

    if not re.fullmatch(r"01[3-9]\d{8}", normalized):
        return None

    return normalized


def is_valid_name(name):
    if not isinstance(name, str):
        return False

    return re.fullmatch(NAME_PATTERN, name) is not None


def normalize_username(username):
    if not isinstance(username, str):
        return None

    username = username.strip().lower()

    if not re.fullmatch(USERNAME_PATTERN, username):
        return None

    return username


def updateLocation(user_type, username, latitude, longitude):
    with get_connection() as conn:
        with conn.cursor() as cur:
            try:
                if user_type == "user":
                    query = load_query("update_info.sql", "update_user_location")
                elif user_type == "rider":
                    query = load_query("update_info.sql", "update_rider_location")
                else:
                    return "invalid_user_type"

                cur.execute(query, (latitude, longitude, username))
                return "success"

            except psycopg.Error:
                return "database_error"


def updateEmail(user_type, username, email):
    with get_connection() as conn:
        with conn.cursor() as cur:
            try:
                if user_type == "user":
                    query = load_query("update_info.sql", "update_user_email")
                elif user_type == "rider":
                    query = load_query("update_info.sql", "update_rider_email")
                elif user_type == "admin":
                    query = load_query("update_info.sql", "update_admin_email")
                else:
                    return "invalid_user_type"

                cur.execute(query, (email, username))
                return "success"

            except psycopg.errors.UniqueViolation:
                return "email_exists"

            except psycopg.Error:
                return "database_error"


def updatePhone(user_type, username, phone):
    with get_connection() as conn:
        with conn.cursor() as cur:
            try:
                if user_type == "user":
                    query = load_query("update_info.sql", "update_user_phone")
                elif user_type == "rider":
                    query = load_query("update_info.sql", "update_rider_phone")
                elif user_type == "admin":
                    query = load_query("update_info.sql", "update_admin_phone")
                else:
                    return "invalid_user_type"

                cur.execute(query, (phone, username))
                return "success"

            except psycopg.errors.UniqueViolation:
                return "phone_exists"

            except psycopg.Error:
                return "database_error"



    


    
    