from datetime import datetime, timezone
from backend.extensions import db


class Story(db.Model):
    __tablename__ = "stories"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    genre = db.Column(db.String(50))
    status = db.Column(db.String(20), default="active")
    cover_image = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    characters = db.relationship("Character", backref="story", lazy="dynamic", cascade="all, delete-orphan")
    locations = db.relationship("Location", backref="story", lazy="dynamic", cascade="all, delete-orphan")
    events = db.relationship("Event", backref="story", lazy="dynamic", cascade="all, delete-orphan")
    organizations = db.relationship("Organization", backref="story", lazy="dynamic", cascade="all, delete-orphan")
    lore_entries = db.relationship("LoreEntry", backref="story", lazy="dynamic", cascade="all, delete-orphan")
    relationships = db.relationship("CharacterRelationship", backref="story", lazy="dynamic", cascade="all, delete-orphan")

    def to_dict(self, include_counts=False):
        data = {
            "id": self.id,
            "user_id": self.user_id,
            "title": self.title,
            "description": self.description,
            "genre": self.genre,
            "status": self.status,
            "cover_image": self.cover_image,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
        if include_counts:
            data["character_count"] = self.characters.count()
            data["location_count"] = self.locations.count()
            data["event_count"] = self.events.count()
            data["organization_count"] = self.organizations.count()
            data["lore_count"] = self.lore_entries.count()
        return data
