from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.extensions import db
from backend.models.lore import LoreEntry
from backend.models.story import Story

lore_bp = Blueprint("lore", __name__, url_prefix="/stories/<int:story_id>/lore")


def _verify_story(story_id, user_id):
    return Story.query.filter_by(id=story_id, user_id=int(user_id)).first()


@lore_bp.route("", methods=["GET"])
@jwt_required()
def list_lore(story_id):
    user_id = get_jwt_identity()
    if not _verify_story(story_id, user_id):
        return jsonify({"error": "Story not found"}), 404
    entries = LoreEntry.query.filter_by(story_id=story_id).order_by(LoreEntry.created_at.desc()).all()
    return jsonify({"lore_entries": [l.to_dict() for l in entries]})


@lore_bp.route("", methods=["POST"])
@jwt_required()
def create_lore(story_id):
    user_id = get_jwt_identity()
    if not _verify_story(story_id, user_id):
        return jsonify({"error": "Story not found"}), 404

    data = request.get_json()
    title = data.get("title", "").strip()
    if not title:
        return jsonify({"error": "Lore title is required"}), 400

    entry = LoreEntry(
        story_id=story_id,
        title=title,
        content=data.get("content"),
        category=data.get("category"),
    )
    db.session.add(entry)
    db.session.commit()
    return jsonify({"lore_entry": entry.to_dict()}), 201


@lore_bp.route("/<int:entry_id>", methods=["PUT"])
@jwt_required()
def update_lore(story_id, entry_id):
    user_id = get_jwt_identity()
    if not _verify_story(story_id, user_id):
        return jsonify({"error": "Story not found"}), 404

    entry = LoreEntry.query.filter_by(id=entry_id, story_id=story_id).first()
    if not entry:
        return jsonify({"error": "Lore entry not found"}), 404

    data = request.get_json()
    for field in ["title", "content", "category"]:
        if field in data:
            setattr(entry, field, data[field])

    db.session.commit()
    return jsonify({"lore_entry": entry.to_dict()})


@lore_bp.route("/<int:entry_id>", methods=["DELETE"])
@jwt_required()
def delete_lore(story_id, entry_id):
    user_id = get_jwt_identity()
    if not _verify_story(story_id, user_id):
        return jsonify({"error": "Story not found"}), 404

    entry = LoreEntry.query.filter_by(id=entry_id, story_id=story_id).first()
    if not entry:
        return jsonify({"error": "Lore entry not found"}), 404

    db.session.delete(entry)
    db.session.commit()
    return jsonify({"message": "Lore entry deleted"})
