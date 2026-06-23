import { motion } from 'motion/react'
import { ScrollReveal } from './ScrollReveal'

export function CTASection() {
  return (
    <section id="cta" className="py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 lg:px-10 text-center relative z-10">
        <ScrollReveal>
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 dark:bg-zinc-800/60 backdrop-blur-md border border-white/40 dark:border-zinc-700/40 text-xs font-medium text-violet-600 dark:text-violet-400 mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
            Ready to begin?
          </motion.div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <h2 className="font-display text-4xl lg:text-6xl font-bold tracking-tight text-zinc-900 dark:text-white mb-6 leading-tight">
            Start Building Better<br />Stories Today
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Bring your characters, locations, events, and timelines together in one organized universe.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <button className="bg-black dark:bg-white text-white dark:text-black rounded-full px-10 py-4 text-base font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/20 hover:scale-[1.02]">
            Create Your First Story
          </button>
        </ScrollReveal>
      </div>
    </section>
  )
}
