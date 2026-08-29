from db import get_connection, load_query
import psycopg
import re
import requests
import os
import json

MAP_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")
map_url = "https://routes.googleapis.com/distanceMatrix/v2:computeRouteMatrix"
map_headers = {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": MAP_API_KEY,
    "X-Goog-FieldMask": "originIndex,destinationIndex,duration,distanceMeters"
}

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


def updateLocation(user_type, username, longitude, latitude,):
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


def getNearbyRestaurents(username, food_cat):
    with get_connection() as conn:     
        with conn.cursor() as cur: 

            query = load_query("get_info.sql", "get_user_location")
                        
            cur.execute(query, (username,))
            user = cur.fetchone()

            # check user existence
            if user is None:
                return "user not found"

            # check if location is set
            if user.get("latitude") is None:
                return "location not set"
            
            user_location = {"latitude": user["latitude"], "longitude": user["longitude"]}

            query = load_query("nearby_restaurents.sql", "get_nearby_restaurents")
            
            cur.execute(query, (user_location.get("longitude"), user_location.get("latitude"), 5000, food_cat, food_cat))
            rows = cur.fetchall()

            filtered_restaurents = filterRestaurents(rows, user_location)
            return filtered_restaurents

def getDistanceTime(restaurants, user):
    origins = []

    for restaurant in restaurants:
        origins.append({
            "waypoint": {
                "location": {
                    "latLng": {
                        "latitude": restaurant["latitude"],
                        "longitude": restaurant["longitude"]
                    }
                }
            }
        })

    destination = [{
        "waypoint": {
            "location": {
                "latLng": user
            }
        }
    }]

    data = {
        "origins": origins,
        "destinations": destination,
        "travelMode": "TWO_WHEELER"
    }

    response = requests.post(
        map_url,
        headers=map_headers,
        json=data
    )
    response.raise_for_status()

    bike_routes = response.text.strip().splitlines()
    bike_routes = [json.loads(route) for route in bike_routes]

    data["travelMode"] = "BICYCLE"

    response = requests.post(
        map_url,
        headers=map_headers,
        json=data
    )
    response.raise_for_status()

    bicycle_routes = response.text.strip().splitlines()
    bicycle_routes = [json.loads(route) for route in bicycle_routes]

    for route in bike_routes:
        i = route["originIndex"]

        bike_time = round(
            int(route["duration"].rstrip("s")) / 60
        )

        bicycle_route = bicycle_routes[i]

        bicycle_time = round(
            int(bicycle_route["duration"].rstrip("s")) / 60
        )

        restaurants[i]["distance"] = route["distanceMeters"]

        restaurants[i]["min_delivery_time"] = min(
            bike_time,
            bicycle_time
        )

        restaurants[i]["max_delivery_time"] = max(
            bike_time,
            bicycle_time
        )

    return restaurants

def filterRestaurents(Restaurents, user):
    restaurents = getDistanceTime(Restaurents, user)
    restaurents = [
        r for r in restaurents
        if r["distance"] <= 5000 and r["max_delivery_time"] <= 120
    ]
    return restaurents

def is_valid_food_cat(food_cat):
    with get_connection() as conn:     
        with conn.cursor() as cur: 

            query = load_query("check_exist.sql", "check_food_cat")
                        
            cur.execute(query, (food_cat,))
            result = cur.fetchone()

            if result:
                return True
    return False