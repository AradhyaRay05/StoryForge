import { useEffect, useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'motion/react'
import {
  ArrowLeft, Users, MapPin, Calendar, Building2, ScrollText, Network, GitBranch, Plus, Edit2, Trash2, X
} from 'lucide-react'
import { api } from '../lib/api'
import type { Story, Character, Location, Event, Organization, LoreEntry, CharacterRelationship } from '../lib/types'
import { RelationshipGraph } from '../components/RelationshipGraph'
import { TimelineView } from '../components/TimelineView'
import { EventFlowView } from '../components/EventFlowView'

const tabs = [
  { id: 'characters', label: 'Characters', icon: Users },
  { id: 'locations', label: 'Locations', icon: MapPin },
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'organizations', label: 'Organizations', icon: Building2 },
  { id: 'lore', label: 'Lore', icon: ScrollText },
  { id: 'relationships', label: 'Relationships', icon: Network },
  { id: 'timeline', label: 'Timeline', icon: Calendar },
  { id: 'flow', label: 'Event Flow', icon: GitBranch },
]

const locationTypes = ['Kingdom', 'City', 'Village', 'Forest', 'Castle', 'Island', 'Planet', 'Dungeon']

export function StoryDetailPage() {
  const { storyId } = useParams()
  const sid = Number(storyId)
  const [story, setStory] = useState<Story | null>(null)
  const [activeTab, setActiveTab] = useState('characters')
  const [loading, setLoading] = useState(true)

  const [characters, setCharacters] = useState<Character[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loreEntries, setLoreEntries] = useState<LoreEntry[]>([])
  const [relationships, setRelationships] = useState<CharacterRelationship[]>([])

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const loadAll = useCallback(async () => {
    try {
      const [storyRes, chars, locs, evts, orgs, lore, rels] = await Promise.all([
        api.stories.get(sid),
        api.characters.list(sid),
        api.locations.list(sid),
        api.events.list(sid),
        api.organizations.list(sid),
        api.lore.list(sid),
        api.relationships.list(sid),
      ])
      setStory(storyRes.story)
      setCharacters(chars.characters)
      setLocations(locs.locations)
      setEvents(evts.events)
      setOrganizations(orgs.organizations)
      setLoreEntries(lore.lore_entries)
      setRelationships(rels.relationships)
    } catch (err) {
      console.error('Failed to load story:', err)
    } finally {
      setLoading(false)
    }
  }, [sid])

  useEffect(() => { loadAll() }, [loadAll])

  async function handleDeleteItem(type: string, id: number) {
    if (!confirm('Delete this item?')) return
    try {
      if (type === 'characters') await api.characters.delete(sid, id)
      else if (type === 'locations') await api.locations.delete(sid, id)
      else if (type === 'events') await api.events.delete(sid, id)
      else if (type === 'organizations') await api.organizations.delete(sid, id)
      else if (type === 'lore') await api.lore.delete(sid, id)
      else if (type === 'relationships') await api.relationships.delete(sid, id)
      loadAll()
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!story) {
    return (
      <div className="text-center py-20">
        <p className="text-zinc-500">Story not found</p>
        <Link to="/app/stories" className="text-violet-600 dark:text-violet-400 text-sm mt-2 inline-block">Back to stories</Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <Link to="/app/stories" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors mb-6">
        <ArrowLeft size={16} />
        Back to Stories
      </Link>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-3xl font-bold text-zinc-900 dark:text-white mb-1">{story.title}</h1>
        {story.description && <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl">{story.description}</p>}
        <div className="flex items-center gap-3 mt-3 text-xs text-zinc-400">
          {story.genre && <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-md">{story.genre}</span>}
          <span>{characters.length} characters</span>
          <span>{locations.length} locations</span>
          <span>{events.length} events</span>
        </div>
      </motion.div>

      <div className="flex gap-1 overflow-x-auto pb-2 mb-6 border-b border-zinc-100 dark:border-zinc-800">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setShowForm(false); setEditingId(null) }}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-violet-500 text-violet-600 dark:text-violet-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'relationships' ? (
        <RelationshipGraph
          characters={characters}
          relationships={relationships}
          storyId={sid}
          onRefresh={loadAll}
        />
      ) : activeTab === 'timeline' ? (
        <TimelineView events={events} />
      ) : activeTab === 'flow' ? (
        <EventFlowView events={events} />
      ) : (
        <TabContent
          tab={activeTab}
          characters={characters}
          locations={locations}
          events={events}
          organizations={organizations}
          loreEntries={loreEntries}
          storyId={sid}
          showForm={showForm}
          setShowForm={setShowForm}
          editingId={editingId}
          setEditingId={setEditingId}
          onRefresh={loadAll}
          onDelete={handleDeleteItem}
        />
      )}
    </div>
  )
}

function TabContent({ tab, characters, locations, events, organizations, loreEntries, storyId, showForm, setShowForm, editingId, setEditingId, onRefresh, onDelete }: {
  tab: string
  characters: Character[]
  locations: Location[]
  events: Event[]
  organizations: Organization[]
  loreEntries: LoreEntry[]
  storyId: number
  showForm: boolean
  setShowForm: (v: boolean) => void
  editingId: number | null
  setEditingId: (v: number | null) => void
  onRefresh: () => void
  onDelete: (type: string, id: number) => void
}) {
  const items = tab === 'characters' ? characters
    : tab === 'locations' ? locations
    : tab === 'events' ? events
    : tab === 'organizations' ? organizations
    : loreEntries

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => { setShowForm(true); setEditingId(null) }}
          className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black rounded-full px-4 py-2 text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
        >
          <Plus size={14} />
          Add {tab === 'lore' ? 'Lore Entry' : tab.charAt(0).toUpperCase() + tab.slice(1, -1)}
        </button>
      </div>

      {showForm && (
        <ItemForm
          tab={tab}
          storyId={storyId}
          editingId={editingId}
          items={items}
          locations={locations}
          onCancel={() => { setShowForm(false); setEditingId(null) }}
          onSaved={() => { setShowForm(false); setEditingId(null); onRefresh() }}
        />
      )}

      {items.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-zinc-500 dark:text-zinc-400 mb-4">No {tab} yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item: any, i: number) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800 p-5 group"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-zinc-900 dark:text-white">{item.name || item.title}</h4>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => { setEditingId(item.id); setShowForm(true) }}
                    className="p-1 text-zinc-400 hover:text-violet-500"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => onDelete(tab, item.id)}
                    className="p-1 text-zinc-400 hover:text-rose-500"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              {item.role && <p className="text-xs text-violet-500 dark:text-violet-400 mb-1">{item.role}</p>}
              {item.type && <p className="text-xs text-violet-500 dark:text-violet-400 mb-1">{item.type}</p>}
              {item.category && <p className="text-xs text-violet-500 dark:text-violet-400 mb-1">{item.category}</p>}
              {item.event_date && <p className="text-xs text-amber-500 mb-1">{item.event_date}</p>}
              {item.description && <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-3">{item.description}</p>}
              {item.content && <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-3">{item.content}</p>}
              {item.leader && <p className="text-xs text-zinc-400 mt-1">Leader: {item.leader}</p>}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

function ItemForm({ tab, storyId, editingId, items, locations, onCancel, onSaved }: {
  tab: string
  storyId: number
  editingId: number | null
  items: any[]
  locations: Location[]
  onCancel: () => void
  onSaved: () => void
}) {
  const existing = editingId ? items.find((i: any) => i.id === editingId) : null
  const [form, setForm] = useState<any>(existing || {})
  const [saving, setSaving] = useState(false)

  function updateField(key: string, value: any) {
    setForm((prev: any) => ({ ...prev, [key]: value }))
  }

  async function handleSave() {
    setSaving(true)
    try {
      if (tab === 'characters') {
        if (editingId) await api.characters.update(storyId, editingId, form)
        else await api.characters.create(storyId, form)
      } else if (tab === 'locations') {
        if (editingId) await api.locations.update(storyId, editingId, form)
        else await api.locations.create(storyId, form)
      } else if (tab === 'events') {
        if (editingId) await api.events.update(storyId, editingId, form)
        else await api.events.create(storyId, form)
      } else if (tab === 'organizations') {
        if (editingId) await api.organizations.update(storyId, editingId, form)
        else await api.organizations.create(storyId, form)
      } else if (tab === 'lore') {
        if (editingId) await api.lore.update(storyId, editingId, form)
        else await api.lore.create(storyId, form)
      }
      onSaved()
    } catch (err) {
      console.error('Save failed:', err)
    } finally {
      setSaving(false)
    }
  }

  const fieldStyle = "w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500/40"

  return (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-6 overflow-hidden">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg font-semibold text-zinc-900 dark:text-white">
            {editingId ? 'Edit' : 'Add'} {tab === 'lore' ? 'Lore Entry' : tab.charAt(0).toUpperCase() + tab.slice(1, -1)}
          </h3>
          <button onClick={onCancel} className="text-zinc-400 hover:text-zinc-600"><X size={20} /></button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {tab === 'characters' && (
            <>
              <Field label="Name *" value={form.name || ''} onChange={v => updateField('name', v)} placeholder="Character name" />
              <Field label="Nickname" value={form.nickname || ''} onChange={v => updateField('nickname', v)} placeholder="Nickname" />
              <Field label="Age" value={form.age || ''} onChange={v => updateField('age', v)} placeholder="Age" />
              <Field label="Gender" value={form.gender || ''} onChange={v => updateField('gender', v)} placeholder="Gender" />
              <Field label="Role" value={form.role || ''} onChange={v => updateField('role', v)} placeholder="e.g. Protagonist" />
              <Field label="Occupation" value={form.occupation || ''} onChange={v => updateField('occupation', v)} placeholder="Occupation" />
              <div className="md:col-span-2"><Field label="Description" value={form.description || ''} onChange={v => updateField('description', v)} placeholder="Brief description" textarea /></div>
              <div className="md:col-span-2"><Field label="Backstory" value={form.backstory || ''} onChange={v => updateField('backstory', v)} placeholder="Character backstory" textarea /></div>
              <div className="md:col-span-2"><Field label="Personality" value={form.personality || ''} onChange={v => updateField('personality', v)} placeholder="Personality traits" textarea /></div>
              <div className="md:col-span-2"><Field label="Goals" value={form.goals || ''} onChange={v => updateField('goals', v)} placeholder="Character goals" textarea /></div>
            </>
          )}
          {tab === 'locations' && (
            <>
              <Field label="Name *" value={form.name || ''} onChange={v => updateField('name', v)} placeholder="Location name" />
              <div>
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">Type</label>
                <select value={form.type || ''} onChange={e => updateField('type', e.target.value)} className={fieldStyle}>
                  <option value="">Select type</option>
                  {locationTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <Field label="Region" value={form.region || ''} onChange={v => updateField('region', v)} placeholder="Region" />
              <Field label="Population" value={form.population || ''} onChange={v => updateField('population', v)} placeholder="Population" />
              <div className="md:col-span-2"><Field label="Description" value={form.description || ''} onChange={v => updateField('description', v)} placeholder="Location description" textarea /></div>
            </>
          )}
          {tab === 'events' && (
            <>
              <Field label="Title *" value={form.title || ''} onChange={v => updateField('title', v)} placeholder="Event title" />
              <Field label="Date" value={form.event_date || ''} onChange={v => updateField('event_date', v)} placeholder="e.g. Year 12" />
              <div>
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">Location</label>
                <select value={form.location_id || ''} onChange={e => updateField('location_id', e.target.value ? Number(e.target.value) : null)} className={fieldStyle}>
                  <option value="">No location</option>
                  {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">Importance</label>
                <select value={form.importance || 'medium'} onChange={e => updateField('importance', e.target.value)} className={fieldStyle}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div className="md:col-span-2"><Field label="Description" value={form.description || ''} onChange={v => updateField('description', v)} placeholder="Event description" textarea /></div>
            </>
          )}
          {tab === 'organizations' && (
            <>
              <Field label="Name *" value={form.name || ''} onChange={v => updateField('name', v)} placeholder="Organization name" />
              <Field label="Type" value={form.type || ''} onChange={v => updateField('type', v)} placeholder="e.g. Guild, Order" />
              <Field label="Leader" value={form.leader || ''} onChange={v => updateField('leader', v)} placeholder="Leader name" />
              <div className="md:col-span-2"><Field label="Description" value={form.description || ''} onChange={v => updateField('description', v)} placeholder="Organization description" textarea /></div>
            </>
          )}
          {tab === 'lore' && (
            <>
              <Field label="Title *" value={form.title || ''} onChange={v => updateField('title', v)} placeholder="Lore title" />
              <Field label="Category" value={form.category || ''} onChange={v => updateField('category', v)} placeholder="e.g. Magic System" />
              <div className="md:col-span-2"><Field label="Content" value={form.content || ''} onChange={v => updateField('content', v)} placeholder="Lore content" textarea /></div>
            </>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-black dark:bg-white text-white dark:text-black rounded-xl px-5 py-2 text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
          </button>
          <button onClick={onCancel} className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 px-4 py-2">Cancel</button>
        </div>
      </div>
    </motion.div>
  )
}

function Field({ label, value, onChange, placeholder, textarea = false }: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string; textarea?: boolean
}) {
  const cls = "w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
  return (
    <div>
      <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">{label}</label>
      {textarea ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} className={`${cls} resize-none`} />
      ) : (
        <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={cls} />
      )}
    </div>
  )
}
