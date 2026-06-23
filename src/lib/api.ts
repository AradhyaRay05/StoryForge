import type { User, Story, Character, CharacterRelationship, Location, Event, Organization, LoreEntry, SearchResult } from './types'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('sf_access_token')
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })

  if (res.status === 401) {
    const refreshed = await tryRefresh()
    if (refreshed) {
      headers['Authorization'] = `Bearer ${localStorage.getItem('sf_access_token')}`
      const retryRes = await fetch(`${API_BASE}${path}`, { ...options, headers })
      if (!retryRes.ok) {
        const err = await retryRes.json().catch(() => ({ error: 'Request failed' }))
        throw new Error(err.error || `HTTP ${retryRes.status}`)
      }
      return retryRes.json()
    }
    localStorage.removeItem('sf_access_token')
    localStorage.removeItem('sf_refresh_token')
    localStorage.removeItem('sf_user')
    window.location.href = '/login'
    throw new Error('Authentication required')
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(err.error || `HTTP ${res.status}`)
  }

  return res.json()
}

async function tryRefresh(): Promise<boolean> {
  const refreshToken = localStorage.getItem('sf_refresh_token')
  if (!refreshToken) return false

  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${refreshToken}`,
      },
    })
    if (!res.ok) return false
    const data = await res.json()
    localStorage.setItem('sf_access_token', data.access_token)
    return true
  } catch {
    return false
  }
}

export const api = {
  auth: {
    getGoogleUrl: () => request<{ url: string }>('/auth/google'),
    getGithubUrl: () => request<{ url: string }>('/auth/github'),
    googleCallback: (code: string) =>
      request<{ access_token: string; refresh_token: string; user: User }>('/auth/google/callback', {
        method: 'POST',
        body: JSON.stringify({ code }),
      }),
    githubCallback: (code: string) =>
      request<{ access_token: string; refresh_token: string; user: User }>('/auth/github/callback', {
        method: 'POST',
        body: JSON.stringify({ code }),
      }),
    getMe: () => request<{ user: User }>('/auth/me'),
    logout: () => request<{ message: string }>('/auth/logout', { method: 'POST' }),
  },

  stories: {
    list: () => request<{ stories: Story[] }>('/stories'),
    get: (id: number) => request<{ story: Story }>(`/stories/${id}`),
    create: (data: Partial<Story>) =>
      request<{ story: Story }>('/stories', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: Partial<Story>) =>
      request<{ story: Story }>(`/stories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: number) =>
      request<{ message: string }>(`/stories/${id}`, { method: 'DELETE' }),
  },

  characters: {
    list: (storyId: number) =>
      request<{ characters: Character[] }>(`/stories/${storyId}/characters`),
    create: (storyId: number, data: Partial<Character>) =>
      request<{ character: Character }>(`/stories/${storyId}/characters`, { method: 'POST', body: JSON.stringify(data) }),
    update: (storyId: number, id: number, data: Partial<Character>) =>
      request<{ character: Character }>(`/stories/${storyId}/characters/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (storyId: number, id: number) =>
      request<{ message: string }>(`/stories/${storyId}/characters/${id}`, { method: 'DELETE' }),
  },

  locations: {
    list: (storyId: number) =>
      request<{ locations: Location[] }>(`/stories/${storyId}/locations`),
    create: (storyId: number, data: Partial<Location>) =>
      request<{ location: Location }>(`/stories/${storyId}/locations`, { method: 'POST', body: JSON.stringify(data) }),
    update: (storyId: number, id: number, data: Partial<Location>) =>
      request<{ location: Location }>(`/stories/${storyId}/locations/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (storyId: number, id: number) =>
      request<{ message: string }>(`/stories/${storyId}/locations/${id}`, { method: 'DELETE' }),
  },

  events: {
    list: (storyId: number) =>
      request<{ events: Event[] }>(`/stories/${storyId}/events`),
    create: (storyId: number, data: Partial<Event>) =>
      request<{ event: Event }>(`/stories/${storyId}/events`, { method: 'POST', body: JSON.stringify(data) }),
    update: (storyId: number, id: number, data: Partial<Event>) =>
      request<{ event: Event }>(`/stories/${storyId}/events/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (storyId: number, id: number) =>
      request<{ message: string }>(`/stories/${storyId}/events/${id}`, { method: 'DELETE' }),
  },

  organizations: {
    list: (storyId: number) =>
      request<{ organizations: Organization[] }>(`/stories/${storyId}/organizations`),
    create: (storyId: number, data: Partial<Organization>) =>
      request<{ organization: Organization }>(`/stories/${storyId}/organizations`, { method: 'POST', body: JSON.stringify(data) }),
    update: (storyId: number, id: number, data: Partial<Organization>) =>
      request<{ organization: Organization }>(`/stories/${storyId}/organizations/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (storyId: number, id: number) =>
      request<{ message: string }>(`/stories/${storyId}/organizations/${id}`, { method: 'DELETE' }),
  },

  lore: {
    list: (storyId: number) =>
      request<{ lore_entries: LoreEntry[] }>(`/stories/${storyId}/lore`),
    create: (storyId: number, data: Partial<LoreEntry>) =>
      request<{ lore_entry: LoreEntry }>(`/stories/${storyId}/lore`, { method: 'POST', body: JSON.stringify(data) }),
    update: (storyId: number, id: number, data: Partial<LoreEntry>) =>
      request<{ lore_entry: LoreEntry }>(`/stories/${storyId}/lore/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (storyId: number, id: number) =>
      request<{ message: string }>(`/stories/${storyId}/lore/${id}`, { method: 'DELETE' }),
  },

  relationships: {
    list: (storyId: number) =>
      request<{ relationships: CharacterRelationship[] }>(`/stories/${storyId}/relationships`),
    create: (storyId: number, data: { character_a: number; character_b: number; relationship_type: string; description?: string; strength?: number }) =>
      request<{ relationship: CharacterRelationship }>(`/stories/${storyId}/relationships`, { method: 'POST', body: JSON.stringify(data) }),
    delete: (storyId: number, id: number) =>
      request<{ message: string }>(`/stories/${storyId}/relationships/${id}`, { method: 'DELETE' }),
  },

  search: {
    query: (q: string, storyId?: number) => {
      const params = new URLSearchParams({ q })
      if (storyId) params.set('story_id', String(storyId))
      return request<{ results: SearchResult[] }>(`/search?${params}`)
    },
  },
}
