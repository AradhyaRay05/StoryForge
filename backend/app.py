from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from backend.config import Config
from backend.extensions import db
from backend.routes import (
    auth_bp,
    stories_bp,
    characters_bp,
    locations_bp,
    events_bp,
    organizations_bp,
    lore_bp,
    relationships_bp,
    search_bp,
)


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app, origins=[app.config["FRONTEND_URL"]], supports_credentials=True)
    db.init_app(app)
    JWTManager(app)

    app.register_blueprint(auth_bp)
    app.register_blueprint(stories_bp)
    app.register_blueprint(characters_bp)
    app.register_blueprint(locations_bp)
    app.register_blueprint(events_bp)
    app.register_blueprint(organizations_bp)
    app.register_blueprint(lore_bp)
    app.register_blueprint(relationships_bp)
    app.register_blueprint(search_bp)

    @app.route("/health")
    def health():
        return {"status": "ok"}

    with app.app_context():
        db.create_all()

    return app
