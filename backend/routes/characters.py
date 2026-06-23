from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.extensions import db
from backend.models.character import Character
from backend.models.story import Story

characters_bp = Blueprint("characters", __name__, url_prefix="/stories/<int:story_id>/characters")


def _verify_story(story_id, user_id):
    story = Story.query.filter_by(id=story_id, user_id=int(user_id)).first()
    if not story:
        return None
    return story


@characters_bp.route("", methods=["GET"])
@jwt_required()
def list_characters(story_id):
    user_id = get_jwt_identity()
    if not _verify_story(story_id, user_id):
        return jsonify({"error": "Story not found"}), 404
    chars = Character.query.filter_by(story_id=story_id).order_by(Character.name).all()
    return jsonify({"characters": [c.to_dict() for c in chars]})


@characters_bp.route("", methods=["POST"])
@jwt_required()
def create_character(story_id):
    user_id = get_jwt_identity()
    if not _verify_story(story_id, user_id):
        return jsonify({"error": "Story not found"}), 404

    data = request.get_json()
    name = data.get("name", "").strip()
    if not name:
        return jsonify({"error": "Character name is required"}), 400

    existing = Character.query.filter_by(story_id=story_id, name=name).first()
    if existing:
        return jsonify({"error": "A character with this name already exists in this story"}), 409

    char = Character(
        story_id=story_id,
        name=name,
        nickname=data.get("nickname"),
        age=data.get("age"),
        gender=data.get("gender"),
        role=data.get("role"),
        occupation=data.get("occupation"),
        description=data.get("description"),
        backstory=data.get("backstory"),
        personality=data.get("personality"),
        goals=data.get("goals"),
        image_url=data.get("image_url"),
    )
    db.session.add(char)
    db.session.commit()
    return jsonify({"character": char.to_dict()}), 201


@characters_bp.route("/<int:char_id>", methods=["PUT"])
@jwt_required()
def update_character(story_id, char_id):
    user_id = get_jwt_identity()
    if not _verify_story(story_id, user_id):
        return jsonify({"error": "Story not found"}), 404

    char = Character.query.filter_by(id=char_id, story_id=story_id).first()
    if not char:
        return jsonify({"error": "Character not found"}), 404

    data = request.get_json()
    for field in ["name", "nickname", "age", "gender", "role", "occupation", "description", "backstory", "personality", "goals", "image_url"]:
        if field in data:
            setattr(char, field, data[field])

    db.session.commit()
    return jsonify({"character": char.to_dict()})


@characters_bp.route("/<int:char_id>", methods=["DELETE"])
@jwt_required()
def delete_character(story_id, char_id):
    user_id = get_jwt_identity()
    if not _verify_story(story_id, user_id):
        return jsonify({"error": "Story not found"}), 404

    char = Character.query.filter_by(id=char_id, story_id=story_id).first()
    if not char:
        return jsonify({"error": "Character not found"}), 404

    db.session.delete(char)
    db.session.commit()
    return jsonify({"message": "Character deleted"})
