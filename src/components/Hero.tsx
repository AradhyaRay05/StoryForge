import { motion } from 'motion/react'

function FloatingCard({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={`absolute backdrop-blur-xl bg-white/80 dark:bg-zinc-800/80 border border-white/50 dark:border-zinc-700/50 rounded-2xl shadow-xl shadow-black/[0.04] dark:shadow-black/20 ${className}`}
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      {children}
    </motion.div>
  )
}

function CharacterNetworkCard() {
  return (
    <FloatingCard className="p-5 w-64 top-8 right-8" delay={0}>
      <p className="text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-3">Character Network</p>
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-violet-500" />
          <span className="text-zinc-800 dark:text-zinc-200 font-medium">King Arthur</span>
        </div>
        <div className="ml-3 border-l-2 border-zinc-200 dark:border-zinc-700 pl-3 space-y-2">
          <div>
            <span className="text-xs text-zinc-400 dark:text-zinc-500">Friend</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-zinc-700 dark:text-zinc-300">Merlin</span>
            </div>
          </div>
          <div>
            <span className="text-xs text-zinc-400 dark:text-zinc-500">Enemy</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-rose-500" />
              <span className="text-zinc-700 dark:text-zinc-300">Morgana</span>
            </div>
          </div>
        </div>
      </div>
    </FloatingCard>
  )
}

function TimelineCard() {
  const events = [
    { year: 'Year 1', label: 'Kingdom Founded', color: 'bg-violet-500' },
    { year: 'Year 8', label: 'War Begins', color: 'bg-amber-500' },
    { year: 'Year 10', label: 'Artifact Discovered', color: 'bg-emerald-500' },
  ]
  return (
    <FloatingCard className="p-5 w-56 bottom-32 right-4" delay={1.5}>
      <p className="text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-3">Timeline</p>
      <div className="space-y-3">
        {events.map((e, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div className={`w-2.5 h-2.5 rounded-full ${e.color}`} />
              {i < events.length - 1 && <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-700" />}
            </div>
            <div>
              <p className="text-xs text-zinc-400 dark:text-zinc-500">{e.year}</p>
              <p className="text-sm text-zinc-800 dark:text-zinc-200 font-medium">{e.label}</p>
            </div>
          </div>
        ))}
      </div>
    </FloatingCard>
  )
}

function LocationsCard() {
  const locations = ['The Lost Kingdom', 'Ancient Forest', 'Moon Citadel']
  return (
    <FloatingCard className="p-5 w-52 top-44 right-72" delay={0.8}>
      <p className="text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-3">Locations</p>
      <div className="space-y-2">
        {locations.map((loc, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-500" />
            <span className="text-zinc-700 dark:text-zinc-300">{loc}</span>
          </div>
        ))}
      </div>
    </FloatingCard>
  )
}

function EventsCard() {
  const events = ['Battle of Eldoria', "King's Death", 'Rise of the Empire']
  return (
    <FloatingCard className="p-5 w-52 bottom-8 right-80" delay={2}>
      <p className="text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-3">Events</p>
      <div className="space-y-2">
        {events.map((ev, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span className="text-zinc-700 dark:text-zinc-300">{ev}</span>
          </div>
        ))}
      </div>
    </FloatingCard>
  )
}

export function Hero() {
  return (
    <section className="relative min-h-screen pt-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-20 pt-16 lg:pt-24 pb-20">
        <div className="flex-1 max-w-xl z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 dark:bg-zinc-800/60 backdrop-blur-md border border-white/40 dark:border-zinc-700/40 text-xs font-medium text-violet-600 dark:text-violet-400 mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
            AI-Powered Story Universe Management
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] text-zinc-900 dark:text-white mb-6"
          >
            Build Entire
            <br />
            <span className="bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">Story Worlds</span>
            <br />
            Without Losing Track
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-xl mb-10"
          >
            Manage characters, timelines, locations, relationships, events, lore, and worldbuilding from one intelligent workspace.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap items-center gap-4 mb-8"
          >
            <button className="bg-black dark:bg-white text-white dark:text-black rounded-full px-8 py-3.5 text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/20">
              Start Building Free
            </button>
            <button className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors px-6 py-3.5 rounded-full border border-zinc-200 dark:border-zinc-800 hover:border-violet-300 dark:hover:border-violet-700">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M6.5 4.5v7l6-3.5-6-3.5z" />
              </svg>
              Watch Demo
            </button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-xs text-zinc-400 dark:text-zinc-500"
          >
            Trusted by writers, novelists, game designers, and worldbuilders.
          </motion.p>
        </div>

        <div className="flex-1 relative min-h-[500px] lg:min-h-[600px] hidden lg:block">
          <CharacterNetworkCard />
          <TimelineCard />
          <LocationsCard />
          <EventsCard />

          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5 rounded-3xl" />
        </div>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 rounded-full blur-3xl pointer-events-none" />
    </section>
  )
}
