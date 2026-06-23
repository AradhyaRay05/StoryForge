from datetime import datetime, timezone
from backend.extensions import db


class Character(db.Model):
    __tablename__ = "characters"

    id = db.Column(db.Integer, primary_key=True)
    story_id = db.Column(db.Integer, db.ForeignKey("stories.id"), nullable=False)
    name = db.Column(db.String(200), nullable=False)
    nickname = db.Column(db.String(100))
    age = db.Column(db.String(50))
    gender = db.Column(db.String(50))
    role = db.Column(db.String(100))
    occupation = db.Column(db.String(100))
    description = db.Column(db.Text)
    backstory = db.Column(db.Text)
    personality = db.Column(db.Text)
    goals = db.Column(db.Text)
    image_url = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    __table_args__ = (
        db.UniqueConstraint("story_id", "name", name="uq_character_name_per_story"),
    )

    def to_dict(self):
        return {
            "id": self.id,
            "story_id": self.story_id,
            "name": self.name,
            "nickname": self.nickname,
            "age": self.age,
            "gender": self.gender,
            "role": self.role,
            "occupation": self.occupation,
            "description": self.description,
            "backstory": self.backstory,
            "personality": self.personality,
            "goals": self.goals,
            "image_url": self.image_url,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
