export interface User {
  id: number
  name: string
  email: string
  avatar_url: string | null
  provider: string
  google_id: string | null
  github_id: string | null
  github_username: string | null
  created_at: string
  updated_at: string
}

export interface Story {
  id: number
  user_id: number
  title: string
  description: string | null
  genre: string | null
  status: string
  cover_image: string | null
  created_at: string
  updated_at: string
  character_count?: number
  location_count?: number
  event_count?: number
  organization_count?: number
  lore_count?: number
}

export interface Character {
  id: number
  story_id: number
  name: string
  nickname: string | null
  age: string | null
  gender: string | null
  role: string | null
  occupation: string | null
  description: string | null
  backstory: string | null
  personality: string | null
  goals: string | null
  image_url: string | null
  created_at: string
  updated_at: string
}

export interface CharacterRelationship {
  id: number
  story_id: number
  character_a: number
  character_b: number
  relationship_type: string
  description: string | null
  strength: number
  character_a_name: string | null
  character_b_name: string | null
}

export interface Location {
  id: number
  story_id: number
  name: string
  type: string | null
  description: string | null
  region: string | null
  population: string | null
  created_at: string
}

export interface Event {
  id: number
  story_id: number
  title: string
  description: string | null
  event_date: string | null
  location_id: number | null
  location_name: string | null
  importance: string
  created_at: string
}

export interface Organization {
  id: number
  story_id: number
  name: string
  type: string | null
  description: string | null
  leader: string | null
  created_at: string
}

export interface LoreEntry {
  id: number
  story_id: number
  title: string
  content: string | null
  category: string | null
  created_at: string
}

export interface SearchResult {
  type: 'character' | 'location' | 'event' | 'lore' | 'organization'
  id: number
  story_id: number
  title: string
  subtitle: string | null
  description: string | null
}
