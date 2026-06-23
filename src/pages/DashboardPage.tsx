import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { BookOpen, Users, MapPin, Calendar, Building2, ScrollText, Plus } from 'lucide-react'
import { api } from '../lib/api'
import { useAuthStore } from '../lib/authStore'
import type { Story } from '../lib/types'

interface DashboardStats {
  stories: number
  characters: number
  locations: number
  events: number
  organizations: number
}

export function DashboardPage() {
  const { user } = useAuthStore()
  const [stats, setStats] = useState<DashboardStats>({ stories: 0, characters: 0, locations: 0, events: 0, organizations: 0 })
  const [recentStories, setRecentStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboard()
  }, [])

  async function loadDashboard() {
    try {
      const { stories } = await api.stories.list()
      const totalChars = stories.reduce((sum, s) => sum + (s.character_count || 0), 0)
      const totalLocs = stories.reduce((sum, s) => sum + (s.location_count || 0), 0)
      const totalEvts = stories.reduce((sum, s) => sum + (s.event_count || 0), 0)
      const totalOrgs = stories.reduce((sum, s) => sum + (s.organization_count || 0), 0)

      setStats({ stories: stories.length, characters: totalChars, locations: totalLocs, events: totalEvts, organizations: totalOrgs })
      setRecentStories(stories.slice(0, 5))
    } catch (err) {
      console.error('Failed to load dashboard:', err)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    { label: 'Stories', value: stats.stories, icon: BookOpen, gradient: 'from-violet-500 to-purple-600' },
    { label: 'Characters', value: stats.characters, icon: Users, gradient: 'from-blue-500 to-cyan-500' },
    { label: 'Locations', value: stats.locations, icon: MapPin, gradient: 'from-emerald-500 to-teal-500' },
    { label: 'Events', value: stats.events, icon: Calendar, gradient: 'from-amber-500 to-orange-500' },
    { label: 'Organizations', value: stats.organizations, icon: Building2, gradient: 'from-rose-500 to-pink-500' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="font-display text-3xl font-bold text-zinc-900 dark:text-white mb-1">
          Welcome back, {user?.name?.split(' ')[0] || 'Writer'}
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">Here's an overview of your story universes.</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-5"
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-3`}>
              <card.icon size={18} className="text-white" />
            </div>
            <p className="font-display text-2xl font-bold text-zinc-900 dark:text-white">{card.value}</p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{card.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg font-semibold text-zinc-900 dark:text-white">Recent Stories</h2>
            <Link
              to="/app/stories"
              className="text-sm text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
            >
              View all
            </Link>
          </div>
          {recentStories.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen size={40} className="text-zinc-300 dark:text-zinc-700 mx-auto mb-3" />
              <p className="text-zinc-500 dark:text-zinc-400 mb-4">No stories yet</p>
              <Link
                to="/app/stories"
                className="inline-flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black rounded-full px-5 py-2.5 text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
              >
                <Plus size={16} />
                Create your first story
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentStories.map(story => (
                <Link
                  key={story.id}
                  to={`/app/stories/${story.id}`}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center flex-shrink-0">
                    <BookOpen size={18} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">{story.title}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {story.genre || 'No genre'} &middot; {story.character_count || 0} characters
                    </p>
                  </div>
                  <span className="text-xs text-zinc-400 dark:text-zinc-500">
                    {new Date(story.updated_at).toLocaleDateString()}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6"
        >
          <h2 className="font-display text-lg font-semibold text-zinc-900 dark:text-white mb-5">Quick Actions</h2>
          <div className="space-y-3">
            {[
              { to: '/app/stories', label: 'New Story', icon: BookOpen },
              { to: '/app/stories', label: 'Manage Characters', icon: Users },
              { to: '/app/stories', label: 'Build Timeline', icon: Calendar },
              { to: '/app/stories', label: 'Create Locations', icon: MapPin },
              { to: '/app/stories', label: 'Add Lore', icon: ScrollText },
            ].map((action, i) => (
              <Link
                key={i}
                to={action.to}
                className="flex items-center gap-3 p-3 rounded-xl text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                <action.icon size={16} className="text-violet-500" />
                {action.label}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
