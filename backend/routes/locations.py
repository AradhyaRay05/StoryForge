from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.extensions import db
from backend.models.location import Location
from backend.models.story import Story

locations_bp = Blueprint("locations", __name__, url_prefix="/stories/<int:story_id>/locations")


def _verify_story(story_id, user_id):
    return Story.query.filter_by(id=story_id, user_id=int(user_id)).first()


@locations_bp.route("", methods=["GET"])
@jwt_required()
def list_locations(story_id):
    user_id = get_jwt_identity()
    if not _verify_story(story_id, user_id):
        return jsonify({"error": "Story not found"}), 404
    locs = Location.query.filter_by(story_id=story_id).order_by(Location.name).all()
    return jsonify({"locations": [l.to_dict() for l in locs]})


@locations_bp.route("", methods=["POST"])
@jwt_required()
def create_location(story_id):
    user_id = get_jwt_identity()
    if not _verify_story(story_id, user_id):
        return jsonify({"error": "Story not found"}), 404

    data = request.get_json()
    name = data.get("name", "").strip()
    if not name:
        return jsonify({"error": "Location name is required"}), 400

    loc = Location(
        story_id=story_id,
        name=name,
        type=data.get("type"),
        description=data.get("description"),
        region=data.get("region"),
        population=data.get("population"),
    )
    db.session.add(loc)
    db.session.commit()
    return jsonify({"location": loc.to_dict()}), 201


@locations_bp.route("/<int:loc_id>", methods=["PUT"])
@jwt_required()
def update_location(story_id, loc_id):
    user_id = get_jwt_identity()
    if not _verify_story(story_id, user_id):
        return jsonify({"error": "Story not found"}), 404

    loc = Location.query.filter_by(id=loc_id, story_id=story_id).first()
    if not loc:
        return jsonify({"error": "Location not found"}), 404

    data = request.get_json()
    for field in ["name", "type", "description", "region", "population"]:
        if field in data:
            setattr(loc, field, data[field])

    db.session.commit()
    return jsonify({"location": loc.to_dict()})


@locations_bp.route("/<int:loc_id>", methods=["DELETE"])
@jwt_required()
def delete_location(story_id, loc_id):
    user_id = get_jwt_identity()
    if not _verify_story(story_id, user_id):
        return jsonify({"error": "Story not found"}), 404

    loc = Location.query.filter_by(id=loc_id, story_id=story_id).first()
    if not loc:
        return jsonify({"error": "Location not found"}), 404

    db.session.delete(loc)
    db.session.commit()
    return jsonify({"message": "Location deleted"})
