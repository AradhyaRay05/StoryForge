from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.models.character import Character
from backend.models.location import Location
from backend.models.event import Event
from backend.models.lore import LoreEntry
from backend.models.organization import Organization
from backend.models.story import Story

search_bp = Blueprint("search", __name__, url_prefix="/search")


@search_bp.route("", methods=["GET"])
@jwt_required()
def global_search():
    user_id = get_jwt_identity()
    query = request.args.get("q", "").strip()
    story_id = request.args.get("story_id")

    if not query:
        return jsonify({"error": "Search query is required"}), 400

    user_story_ids = [s.id for s in Story.query.filter_by(user_id=int(user_id)).all()]
    if not user_story_ids:
        return jsonify({"results": []})

    if story_id:
        story_id = int(story_id)
        if story_id not in user_story_ids:
            return jsonify({"error": "Story not found"}), 404
        story_ids = [story_id]
    else:
        story_ids = user_story_ids

    pattern = f"%{query}%"

    characters = Character.query.filter(
        Character.story_id.in_(story_ids),
        (Character.name.ilike(pattern)) | (Character.description.ilike(pattern))
    ).limit(20).all()

    locations = Location.query.filter(
        Location.story_id.in_(story_ids),
        (Location.name.ilike(pattern)) | (Location.description.ilike(pattern))
    ).limit(20).all()

    events = Event.query.filter(
        Event.story_id.in_(story_ids),
        (Event.title.ilike(pattern)) | (Event.description.ilike(pattern))
    ).limit(20).all()

    lore = LoreEntry.query.filter(
        LoreEntry.story_id.in_(story_ids),
        (LoreEntry.title.ilike(pattern)) | (LoreEntry.content.ilike(pattern))
    ).limit(20).all()

    orgs = Organization.query.filter(
        Organization.story_id.in_(story_ids),
        (Organization.name.ilike(pattern)) | (Organization.description.ilike(pattern))
    ).limit(20).all()

    results = []
    for c in characters:
        results.append({"type": "character", "id": c.id, "story_id": c.story_id, "title": c.name, "subtitle": c.role or c.occupation, "description": c.description})
    for l in locations:
        results.append({"type": "location", "id": l.id, "story_id": l.story_id, "title": l.name, "subtitle": l.type, "description": l.description})
    for e in events:
        results.append({"type": "event", "id": e.id, "story_id": e.story_id, "title": e.title, "subtitle": e.event_date, "description": e.description})
    for lo in lore:
        results.append({"type": "lore", "id": lo.id, "story_id": lo.story_id, "title": lo.title, "subtitle": lo.category, "description": lo.content})
    for o in orgs:
        results.append({"type": "organization", "id": o.id, "story_id": o.story_id, "title": o.name, "subtitle": o.type, "description": o.description})

    return jsonify({"results": results})
