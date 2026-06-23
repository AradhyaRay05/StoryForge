import { motion } from 'motion/react'
import type { Event } from '../lib/types'

const importanceColors: Record<string, string> = {
  low: 'bg-zinc-400',
  medium: 'bg-blue-500',
  high: 'bg-amber-500',
  critical: 'bg-rose-500',
}

interface Props {
  events: Event[]
}

export function TimelineView({ events }: Props) {
  const sorted = [...events].sort((a, b) => (a.event_date || '').localeCompare(b.event_date || ''))

  if (sorted.length === 0) {
    return <div className="text-center py-16 text-zinc-500">No events to display on the timeline.</div>
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-8">
      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-px bg-zinc-200 dark:bg-zinc-700" />

        <div className="space-y-8">
          {sorted.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="flex gap-6 relative"
            >
              <div className="flex-shrink-0 w-12 flex justify-center">
                <div className={`w-3 h-3 rounded-full ${importanceColors[event.importance] || 'bg-violet-500'} ring-4 ring-white dark:ring-zinc-900 z-10`} />
              </div>

              <div className="flex-1 pb-2">
                <div className="flex items-center gap-3 mb-1">
                  {event.event_date && (
                    <span className="text-xs font-mono px-2 py-0.5 bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 rounded-md">
                      {event.event_date}
                    </span>
                  )}
                  <span className={`text-xs px-2 py-0.5 rounded-md ${
                    event.importance === 'critical' ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400' :
                    event.importance === 'high' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' :
                    event.importance === 'medium' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' :
                    'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                  }`}>
                    {event.importance}
                  </span>
                </div>
                <h4 className="font-medium text-zinc-900 dark:text-white">{event.title}</h4>
                {event.description && (
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{event.description}</p>
                )}
                {event.location_name && (
                  <p className="text-xs text-zinc-400 mt-1">Location: {event.location_name}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
