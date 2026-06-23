from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.extensions import db
from backend.models.event import Event
from backend.models.story import Story

events_bp = Blueprint("events", __name__, url_prefix="/stories/<int:story_id>/events")


def _verify_story(story_id, user_id):
    return Story.query.filter_by(id=story_id, user_id=int(user_id)).first()


@events_bp.route("", methods=["GET"])
@jwt_required()
def list_events(story_id):
    user_id = get_jwt_identity()
    if not _verify_story(story_id, user_id):
        return jsonify({"error": "Story not found"}), 404
    evts = Event.query.filter_by(story_id=story_id).order_by(Event.event_date).all()
    return jsonify({"events": [e.to_dict() for e in evts]})


@events_bp.route("", methods=["POST"])
@jwt_required()
def create_event(story_id):
    user_id = get_jwt_identity()
    if not _verify_story(story_id, user_id):
        return jsonify({"error": "Story not found"}), 404

    data = request.get_json()
    title = data.get("title", "").strip()
    if not title:
        return jsonify({"error": "Event title is required"}), 400

    evt = Event(
        story_id=story_id,
        title=title,
        description=data.get("description"),
        event_date=data.get("event_date"),
        location_id=data.get("location_id"),
        importance=data.get("importance", "medium"),
    )
    db.session.add(evt)
    db.session.commit()
    return jsonify({"event": evt.to_dict()}), 201


@events_bp.route("/<int:event_id>", methods=["PUT"])
@jwt_required()
def update_event(story_id, event_id):
    user_id = get_jwt_identity()
    if not _verify_story(story_id, user_id):
        return jsonify({"error": "Story not found"}), 404

    evt = Event.query.filter_by(id=event_id, story_id=story_id).first()
    if not evt:
        return jsonify({"error": "Event not found"}), 404

    data = request.get_json()
    for field in ["title", "description", "event_date", "location_id", "importance"]:
        if field in data:
            setattr(evt, field, data[field])

    db.session.commit()
    return jsonify({"event": evt.to_dict()})


@events_bp.route("/<int:event_id>", methods=["DELETE"])
@jwt_required()
def delete_event(story_id, event_id):
    user_id = get_jwt_identity()
    if not _verify_story(story_id, user_id):
        return jsonify({"error": "Story not found"}), 404

    evt = Event.query.filter_by(id=event_id, story_id=story_id).first()
    if not evt:
        return jsonify({"error": "Event not found"}), 404

    db.session.delete(evt)
    db.session.commit()
    return jsonify({"message": "Event deleted"})
