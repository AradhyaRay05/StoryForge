from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.extensions import db
from backend.models.story import Story

stories_bp = Blueprint("stories", __name__, url_prefix="/stories")


@stories_bp.route("", methods=["GET"])
@jwt_required()
def list_stories():
    user_id = get_jwt_identity()
    stories = Story.query.filter_by(user_id=int(user_id)).order_by(Story.updated_at.desc()).all()
    return jsonify({"stories": [s.to_dict(include_counts=True) for s in stories]})


@stories_bp.route("", methods=["POST"])
@jwt_required()
def create_story():
    user_id = get_jwt_identity()
    data = request.get_json()

    title = data.get("title", "").strip()
    if not title or len(title) < 3 or len(title) > 100:
        return jsonify({"error": "Title must be between 3 and 100 characters"}), 400

    story = Story(
        user_id=int(user_id),
        title=title,
        description=data.get("description"),
        genre=data.get("genre"),
        status=data.get("status", "active"),
        cover_image=data.get("cover_image"),
    )
    db.session.add(story)
    db.session.commit()
    return jsonify({"story": story.to_dict()}), 201


@stories_bp.route("/<int:story_id>", methods=["GET"])
@jwt_required()
def get_story(story_id):
    user_id = get_jwt_identity()
    story = Story.query.filter_by(id=story_id, user_id=int(user_id)).first()
    if not story:
        return jsonify({"error": "Story not found"}), 404
    return jsonify({"story": story.to_dict(include_counts=True)})


@stories_bp.route("/<int:story_id>", methods=["PUT"])
@jwt_required()
def update_story(story_id):
    user_id = get_jwt_identity()
    story = Story.query.filter_by(id=story_id, user_id=int(user_id)).first()
    if not story:
        return jsonify({"error": "Story not found"}), 404

    data = request.get_json()
    if "title" in data:
        title = data["title"].strip()
        if not title or len(title) < 3 or len(title) > 100:
            return jsonify({"error": "Title must be between 3 and 100 characters"}), 400
        story.title = title
    if "description" in data:
        story.description = data["description"]
    if "genre" in data:
        story.genre = data["genre"]
    if "status" in data:
        story.status = data["status"]
    if "cover_image" in data:
        story.cover_image = data["cover_image"]

    db.session.commit()
    return jsonify({"story": story.to_dict(include_counts=True)})


@stories_bp.route("/<int:story_id>", methods=["DELETE"])
@jwt_required()
def delete_story(story_id):
    user_id = get_jwt_identity()
    story = Story.query.filter_by(id=story_id, user_id=int(user_id)).first()
    if not story:
        return jsonify({"error": "Story not found"}), 404

    db.session.delete(story)
    db.session.commit()
    return jsonify({"message": "Story deleted"})
