import requests
from flask import Blueprint, request, jsonify, redirect, current_app
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from backend.extensions import db
from backend.models.user import User

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")


@auth_bp.route("/google", methods=["GET"])
def google_login():
    cfg = current_app.config
    url = (
        "https://accounts.google.com/o/oauth2/v2/auth?"
        f"client_id={cfg['GOOGLE_CLIENT_ID']}&"
        f"redirect_uri={cfg['GOOGLE_REDIRECT_URI']}&"
        "response_type=code&"
        "scope=openid%20email%20profile&"
        "access_type=offline"
    )
    return jsonify({"url": url})


@auth_bp.route("/google/callback", methods=["POST"])
def google_callback():
    data = request.get_json()
    code = data.get("code")
    if not code:
        return jsonify({"error": "Authorization code required"}), 400

    cfg = current_app.config

    token_resp = requests.post("https://oauth2.googleapis.com/token", data={
        "code": code,
        "client_id": cfg["GOOGLE_CLIENT_ID"],
        "client_secret": cfg["GOOGLE_CLIENT_SECRET"],
        "redirect_uri": cfg["GOOGLE_REDIRECT_URI"],
        "grant_type": "authorization_code",
    })
    if token_resp.status_code != 200:
        return jsonify({"error": "Google authentication failed"}), 401

    token_data = token_resp.json()
    access_token = token_data.get("access_token")

    user_resp = requests.get("https://www.googleapis.com/oauth2/v2/userinfo", headers={
        "Authorization": f"Bearer {access_token}"
    })
    if user_resp.status_code != 200:
        return jsonify({"error": "Failed to retrieve user profile"}), 401

    google_user = user_resp.json()
    google_id = google_user.get("id")
    email = google_user.get("email")
    name = google_user.get("name", email.split("@")[0] if email else "User")
    avatar = google_user.get("picture")

    user = User.query.filter_by(google_id=google_id).first()
    if not user:
        user = User.query.filter_by(email=email).first()
        if user:
            user.google_id = google_id
            user.provider = "google"
        else:
            user = User(
                name=name,
                email=email,
                avatar_url=avatar,
                provider="google",
                google_id=google_id,
            )
            db.session.add(user)

    user.name = name
    user.avatar_url = avatar
    db.session.commit()

    access_jwt = create_access_token(identity=str(user.id))
    refresh_jwt = create_refresh_token(identity=str(user.id))

    return jsonify({
        "access_token": access_jwt,
        "refresh_token": refresh_jwt,
        "user": user.to_dict(),
    })


@auth_bp.route("/github", methods=["GET"])
def github_login():
    cfg = current_app.config
    url = (
        "https://github.com/login/oauth/authorize?"
        f"client_id={cfg['GITHUB_CLIENT_ID']}&"
        f"redirect_uri={cfg['GITHUB_REDIRECT_URI']}&"
        "scope=user:email"
    )
    return jsonify({"url": url})


@auth_bp.route("/github/callback", methods=["POST"])
def github_callback():
    data = request.get_json()
    code = data.get("code")
    if not code:
        return jsonify({"error": "Authorization code required"}), 400

    cfg = current_app.config

    token_resp = requests.post("https://github.com/login/oauth/access_token", json={
        "client_id": cfg["GITHUB_CLIENT_ID"],
        "client_secret": cfg["GITHUB_CLIENT_SECRET"],
        "code": code,
    }, headers={"Accept": "application/json"})
    if token_resp.status_code != 200:
        return jsonify({"error": "GitHub authentication failed"}), 401

    token_data = token_resp.json()
    access_token = token_data.get("access_token")
    if not access_token:
        return jsonify({"error": "GitHub authentication failed"}), 401

    user_resp = requests.get("https://api.github.com/user", headers={
        "Authorization": f"Bearer {access_token}",
        "Accept": "application/vnd.github+json",
    })
    if user_resp.status_code != 200:
        return jsonify({"error": "Failed to retrieve user profile"}), 401

    gh_user = user_resp.json()
    github_id = str(gh_user.get("id"))
    github_username = gh_user.get("login")
    name = gh_user.get("name") or github_username
    avatar = gh_user.get("avatar_url")

    email_resp = requests.get("https://api.github.com/user/emails", headers={
        "Authorization": f"Bearer {access_token}",
        "Accept": "application/vnd.github+json",
    })
    email = None
    if email_resp.status_code == 200:
        for e in email_resp.json():
            if e.get("primary") and e.get("verified"):
                email = e.get("email")
                break
    if not email:
        email = f"{github_username}@github.com"

    user = User.query.filter_by(github_id=github_id).first()
    if not user:
        user = User.query.filter_by(email=email).first()
        if user:
            user.github_id = github_id
            user.github_username = github_username
            user.provider = "github"
        else:
            user = User(
                name=name,
                email=email,
                avatar_url=avatar,
                provider="github",
                github_id=github_id,
                github_username=github_username,
            )
            db.session.add(user)

    user.name = name
    user.avatar_url = avatar
    user.github_username = github_username
    db.session.commit()

    access_jwt = create_access_token(identity=str(user.id))
    refresh_jwt = create_refresh_token(identity=str(user.id))

    return jsonify({
        "access_token": access_jwt,
        "refresh_token": refresh_jwt,
        "user": user.to_dict(),
    })


@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def get_me():
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify({"user": user.to_dict()})


@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    user_id = get_jwt_identity()
    access_jwt = create_access_token(identity=user_id)
    return jsonify({"access_token": access_jwt})


@auth_bp.route("/logout", methods=["POST"])
def logout():
    return jsonify({"message": "Logged out successfully"})
