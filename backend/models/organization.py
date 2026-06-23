from datetime import datetime, timezone
from backend.extensions import db


class Organization(db.Model):
    __tablename__ = "organizations"

    id = db.Column(db.Integer, primary_key=True)
    story_id = db.Column(db.Integer, db.ForeignKey("stories.id"), nullable=False)
    name = db.Column(db.String(200), nullable=False)
    type = db.Column(db.String(100))
    description = db.Column(db.Text)
    leader = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            "id": self.id,
            "story_id": self.story_id,
            "name": self.name,
            "type": self.type,
            "description": self.description,
            "leader": self.leader,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
