# optimization : (replace with getDistancetime and getDistancetimeHelper and remove the global vars) in utils.py
# makes 2 reqs instead of 2n reqs

# -- done --


# unoptimized version:
def getDistanceTimeHelper(restaurent, user, vehicle):
    data = {
        "origin": {
            "location": {
                "latLng": restaurent
            }
        },
        "destination": {
            "location": {
                "latLng": user
            }
        },
        "travelMode": vehicle
    }

    response = requests.post(map_url, headers=map_headers, json=data)
    response.raise_for_status()

    route = response.json()["routes"][0]

    distance = route["distanceMeters"]
    duration_minutes = round(int(route["duration"].rstrip("s")) / 60)

    return {"distance":distance, "time":duration_minutes}

def getDistanceTime(restaurants, user):
    for restaurant in restaurants:
        location = {
            "latitude": restaurant["latitude"],
            "longitude": restaurant["longitude"]
        }
        result = getDistanceTimeHelper(
            location,
            user,
            "TWO_WHEELER"
        )

        bicycle = getDistanceTimeHelper(
            location,
            user,
            "BICYCLE"
        )

        restaurant["distance"] = result["distance"]
        restaurant["min_delivery_time"] = min(
            result["time"], bicycle["time"]
        )
        restaurant["max_delivery_time"] = max(
            result["time"], bicycle["time"]
        )

    return restaurants
