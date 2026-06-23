import { motion } from 'motion/react'
import type { Event } from '../lib/types'

interface Props {
  events: Event[]
}

export function EventFlowView({ events }: Props) {
  if (events.length === 0) {
    return <div className="text-center py-16 text-zinc-500">No events to display in the flow view.</div>
  }

  const sorted = [...events].sort((a, b) => (a.event_date || '').localeCompare(b.event_date || ''))

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-8">
      <div className="flex flex-wrap items-center justify-center gap-3">
        {sorted.map((event, i) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="flex items-center gap-3"
          >
            <div className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-5 py-4 min-w-[140px] max-w-[200px]">
              {event.event_date && (
                <p className="text-xs font-mono text-violet-500 dark:text-violet-400 mb-1">{event.event_date}</p>
              )}
              <p className="text-sm font-medium text-zinc-900 dark:text-white leading-tight">{event.title}</p>
              {event.description && (
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">{event.description}</p>
              )}
            </div>
            {i < sorted.length - 1 && (
              <svg width="32" height="16" viewBox="0 0 32 16" className="text-zinc-300 dark:text-zinc-600 flex-shrink-0">
                <path d="M0 8h24m0 0l-5-5m5 5l-5 5" stroke="currentColor" strokeWidth="1.5" fill="none" />
              </svg>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
