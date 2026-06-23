from datetime import datetime, timezone
from backend.extensions import db


class Event(db.Model):
    __tablename__ = "events"

    id = db.Column(db.Integer, primary_key=True)
    story_id = db.Column(db.Integer, db.ForeignKey("stories.id"), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    event_date = db.Column(db.String(100))
    location_id = db.Column(db.Integer, db.ForeignKey("locations.id"))
    importance = db.Column(db.String(20), default="medium")
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    location = db.relationship("Location", backref="events")

    def to_dict(self):
        return {
            "id": self.id,
            "story_id": self.story_id,
            "title": self.title,
            "description": self.description,
            "event_date": self.event_date,
            "location_id": self.location_id,
            "location_name": self.location.name if self.location else None,
            "importance": self.importance,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
