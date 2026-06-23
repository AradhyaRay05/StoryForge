from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.extensions import db
from backend.models.organization import Organization
from backend.models.story import Story

organizations_bp = Blueprint("organizations", __name__, url_prefix="/stories/<int:story_id>/organizations")


def _verify_story(story_id, user_id):
    return Story.query.filter_by(id=story_id, user_id=int(user_id)).first()


@organizations_bp.route("", methods=["GET"])
@jwt_required()
def list_organizations(story_id):
    user_id = get_jwt_identity()
    if not _verify_story(story_id, user_id):
        return jsonify({"error": "Story not found"}), 404
    orgs = Organization.query.filter_by(story_id=story_id).order_by(Organization.name).all()
    return jsonify({"organizations": [o.to_dict() for o in orgs]})


@organizations_bp.route("", methods=["POST"])
@jwt_required()
def create_organization(story_id):
    user_id = get_jwt_identity()
    if not _verify_story(story_id, user_id):
        return jsonify({"error": "Story not found"}), 404

    data = request.get_json()
    name = data.get("name", "").strip()
    if not name:
        return jsonify({"error": "Organization name is required"}), 400

    org = Organization(
        story_id=story_id,
        name=name,
        type=data.get("type"),
        description=data.get("description"),
        leader=data.get("leader"),
    )
    db.session.add(org)
    db.session.commit()
    return jsonify({"organization": org.to_dict()}), 201


@organizations_bp.route("/<int:org_id>", methods=["PUT"])
@jwt_required()
def update_organization(story_id, org_id):
    user_id = get_jwt_identity()
    if not _verify_story(story_id, user_id):
        return jsonify({"error": "Story not found"}), 404

    org = Organization.query.filter_by(id=org_id, story_id=story_id).first()
    if not org:
        return jsonify({"error": "Organization not found"}), 404

    data = request.get_json()
    for field in ["name", "type", "description", "leader"]:
        if field in data:
            setattr(org, field, data[field])

    db.session.commit()
    return jsonify({"organization": org.to_dict()})


@organizations_bp.route("/<int:org_id>", methods=["DELETE"])
@jwt_required()
def delete_organization(story_id, org_id):
    user_id = get_jwt_identity()
    if not _verify_story(story_id, user_id):
        return jsonify({"error": "Story not found"}), 404

    org = Organization.query.filter_by(id=org_id, story_id=story_id).first()
    if not org:
        return jsonify({"error": "Organization not found"}), 404

    db.session.delete(org)
    db.session.commit()
    return jsonify({"message": "Organization deleted"})
