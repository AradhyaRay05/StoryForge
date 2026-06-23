from backend.routes.auth import auth_bp
from backend.routes.stories import stories_bp
from backend.routes.characters import characters_bp
from backend.routes.locations import locations_bp
from backend.routes.events import events_bp
from backend.routes.organizations import organizations_bp
from backend.routes.lore import lore_bp
from backend.routes.relationships import relationships_bp
from backend.routes.search import search_bp

__all__ = [
    "auth_bp",
    "stories_bp",
    "characters_bp",
    "locations_bp",
    "events_bp",
    "organizations_bp",
    "lore_bp",
    "relationships_bp",
    "search_bp",
]
