from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.extensions import db
from backend.models.character_relationship import CharacterRelationship
from backend.models.character import Character
from backend.models.story import Story

relationships_bp = Blueprint("relationships", __name__, url_prefix="/stories/<int:story_id>/relationships")

VALID_TYPES = ["Parent", "Child", "Friend", "Enemy", "Rival", "Mentor", "Student", "Lover", "Spouse", "Ally"]


def _verify_story(story_id, user_id):
    return Story.query.filter_by(id=story_id, user_id=int(user_id)).first()


@relationships_bp.route("", methods=["GET"])
@jwt_required()
def list_relationships(story_id):
    user_id = get_jwt_identity()
    if not _verify_story(story_id, user_id):
        return jsonify({"error": "Story not found"}), 404
    rels = CharacterRelationship.query.filter_by(story_id=story_id).all()
    return jsonify({"relationships": [r.to_dict() for r in rels]})


@relationships_bp.route("", methods=["POST"])
@jwt_required()
def create_relationship(story_id):
    user_id = get_jwt_identity()
    if not _verify_story(story_id, user_id):
        return jsonify({"error": "Story not found"}), 404

    data = request.get_json()
    char_a = data.get("character_a")
    char_b = data.get("character_b")
    rel_type = data.get("relationship_type")

    if not char_a or not char_b or not rel_type:
        return jsonify({"error": "character_a, character_b, and relationship_type are required"}), 400

    if rel_type not in VALID_TYPES:
        return jsonify({"error": f"Invalid relationship type. Must be one of: {', '.join(VALID_TYPES)}"}), 400

    if char_a == char_b:
        return jsonify({"error": "A character cannot have a relationship with itself"}), 400

    for cid in [char_a, char_b]:
        c = Character.query.filter_by(id=cid, story_id=story_id).first()
        if not c:
            return jsonify({"error": f"Character {cid} not found in this story"}), 404

    rel = CharacterRelationship(
        story_id=story_id,
        character_a=char_a,
        character_b=char_b,
        relationship_type=rel_type,
        description=data.get("description"),
        strength=data.get("strength", 5),
    )
    db.session.add(rel)
    db.session.commit()
    return jsonify({"relationship": rel.to_dict()}), 201


@relationships_bp.route("/<int:rel_id>", methods=["DELETE"])
@jwt_required()
def delete_relationship(story_id, rel_id):
    user_id = get_jwt_identity()
    if not _verify_story(story_id, user_id):
        return jsonify({"error": "Story not found"}), 404

    rel = CharacterRelationship.query.filter_by(id=rel_id, story_id=story_id).first()
    if not rel:
        return jsonify({"error": "Relationship not found"}), 404

    db.session.delete(rel)
    db.session.commit()
    return jsonify({"message": "Relationship deleted"})
