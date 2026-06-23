from datetime import datetime, timezone
from backend.extensions import db


class Location(db.Model):
    __tablename__ = "locations"

    id = db.Column(db.Integer, primary_key=True)
    story_id = db.Column(db.Integer, db.ForeignKey("stories.id"), nullable=False)
    name = db.Column(db.String(200), nullable=False)
    type = db.Column(db.String(50))
    description = db.Column(db.Text)
    region = db.Column(db.String(200))
    population = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            "id": self.id,
            "story_id": self.story_id,
            "name": self.name,
            "type": self.type,
            "description": self.description,
            "region": self.region,
            "population": self.population,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
