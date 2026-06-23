from backend.extensions import db


class CharacterRelationship(db.Model):
    __tablename__ = "character_relationships"

    id = db.Column(db.Integer, primary_key=True)
    story_id = db.Column(db.Integer, db.ForeignKey("stories.id"), nullable=False)
    character_a = db.Column(db.Integer, db.ForeignKey("characters.id"), nullable=False)
    character_b = db.Column(db.Integer, db.ForeignKey("characters.id"), nullable=False)
    relationship_type = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text)
    strength = db.Column(db.Integer, default=5)

    char_a = db.relationship("Character", foreign_keys=[character_a], backref="relationships_as_a")
    char_b = db.relationship("Character", foreign_keys=[character_b], backref="relationships_as_b")

    def to_dict(self):
        return {
            "id": self.id,
            "story_id": self.story_id,
            "character_a": self.character_a,
            "character_b": self.character_b,
            "relationship_type": self.relationship_type,
            "description": self.description,
            "strength": self.strength,
            "character_a_name": self.char_a.name if self.char_a else None,
            "character_b_name": self.char_b.name if self.char_b else None,
        }
