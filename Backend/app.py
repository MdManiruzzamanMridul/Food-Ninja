import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

from routes.login import login_bp
from routes.logout import logout_bp
from routes.update_location import update_location_bp
from routes.update_email import update_email_bp
from routes.update_phone import update_phone_bp
from routes.change_password import change_password_bp
from routes.nearby_restaurants import nearby_restaurants_bp
from routes.orders import orders_bp
from routes.owner import owner_bp
from routes.admin import admin_bp
from routes.rider import rider_bp


load_dotenv()

app = Flask(__name__)

# Enable CORS for frontend integration (e.g. Next.js on localhost:3000)
CORS(app, resources={r"/*": {"origins": "*"}})

# Register blueprints
app.register_blueprint(login_bp)
app.register_blueprint(logout_bp)
app.register_blueprint(update_location_bp)
app.register_blueprint(update_email_bp)
app.register_blueprint(update_phone_bp)
app.register_blueprint(change_password_bp)
app.register_blueprint(nearby_restaurants_bp)
app.register_blueprint(orders_bp)
app.register_blueprint(owner_bp)
app.register_blueprint(admin_bp)
app.register_blueprint(rider_bp)


@app.route("/", methods=["GET"])
def index():
    return jsonify({
        "status": "healthy",
        "service": "Food Ninja Backend API",
        "version": "1.0.0"
    }), 200


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy"
    }), 200


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)