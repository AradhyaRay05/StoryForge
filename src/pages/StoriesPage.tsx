import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { Plus, BookOpen, X, Trash2 } from 'lucide-react'
import { api } from '../lib/api'
import type { Story } from '../lib/types'

const genres = ['Fantasy', 'Sci-Fi', 'Mystery', 'Horror', 'Adventure', 'Historical', 'Custom']

export function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newGenre, setNewGenre] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [creating, setCreating] = useState(false)
  const navigate = useNavigate()

  useEffect(() => { loadStories() }, [])

  async function loadStories() {
    try {
      const { stories } = await api.stories.list()
      setStories(stories)
    } catch (err) {
      console.error('Failed to load stories:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate() {
    if (!newTitle.trim() || newTitle.trim().length < 3) return
    setCreating(true)
    try {
      const { story } = await api.stories.create({
        title: newTitle.trim(),
        genre: newGenre || undefined,
        description: newDescription || undefined,
      })
      setStories(prev => [story, ...prev])
      setShowCreate(false)
      setNewTitle('')
      setNewGenre('')
      setNewDescription('')
      navigate(`/app/stories/${story.id}`)
    } catch (err) {
      console.error('Failed to create story:', err)
    } finally {
      setCreating(false)
    }
  }

  async function handleDelete(id: number, e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!confirm('Delete this story and all its contents?')) return
    try {
      await api.stories.delete(id)
      setStories(prev => prev.filter(s => s.id !== id))
    } catch (err) {
      console.error('Failed to delete story:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-zinc-900 dark:text-white mb-1">Stories</h1>
          <p className="text-zinc-600 dark:text-zinc-400">{stories.length} {stories.length === 1 ? 'story' : 'stories'}</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black rounded-full px-5 py-2.5 text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
        >
          <Plus size={16} />
          New Story
        </button>
      </div>

      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-lg font-semibold text-zinc-900 dark:text-white">Create New Story</h3>
                <button onClick={() => setShowCreate(false)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Title *</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="e.g. The Lost Kingdom"
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Genre</label>
                  <div className="flex flex-wrap gap-2">
                    {genres.map(g => (
                      <button
                        key={g}
                        onClick={() => setNewGenre(newGenre === g ? '' : g)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          newGenre === g
                            ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 border border-violet-300 dark:border-violet-700'
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-transparent hover:border-zinc-300 dark:hover:border-zinc-600'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Description</label>
                  <textarea
                    value={newDescription}
                    onChange={e => setNewDescription(e.target.value)}
                    rows={3}
                    placeholder="What's your story about?"
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500/40 resize-none"
                  />
                </div>
                <button
                  onClick={handleCreate}
                  disabled={!newTitle.trim() || newTitle.trim().length < 3 || creating}
                  className="bg-black dark:bg-white text-white dark:text-black rounded-xl px-6 py-2.5 text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {creating ? 'Creating...' : 'Create Story'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {stories.length === 0 && !showCreate ? (
        <div className="text-center py-20">
          <BookOpen size={48} className="text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
          <h3 className="font-display text-xl font-semibold text-zinc-900 dark:text-white mb-2">No stories yet</h3>
          <p className="text-zinc-500 dark:text-zinc-400 mb-6">Create your first story to start building your universe.</p>
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black rounded-full px-6 py-3 text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
          >
            <Plus size={16} />
            Create Your First Story
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {stories.map((story, i) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <Link
                to={`/app/stories/${story.id}`}
                className="block bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6 hover:border-violet-200 dark:hover:border-violet-800 hover:shadow-lg hover:shadow-violet-500/[0.04] transition-all duration-300 group h-full"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                    <BookOpen size={20} className="text-white" />
                  </div>
                  <button
                    onClick={e => handleDelete(story.id, e)}
                    className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-rose-500 transition-all p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <h3 className="font-display text-lg font-semibold text-zinc-900 dark:text-white mb-1">{story.title}</h3>
                {story.description && (
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-3">{story.description}</p>
                )}
                <div className="flex items-center gap-3 text-xs text-zinc-400 dark:text-zinc-500">
                  {story.genre && (
                    <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-md">{story.genre}</span>
                  )}
                  <span>{story.character_count || 0} chars</span>
                  <span>{story.location_count || 0} locs</span>
                  <span>{story.event_count || 0} events</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
