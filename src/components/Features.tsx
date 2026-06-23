import { Users, Calendar, Globe, GitBranch, Network, Sparkles } from 'lucide-react'
import { ScrollReveal } from './ScrollReveal'

const features = [
  {
    icon: Users,
    title: 'Character Management',
    description: 'Manage heroes, villains, allies, and their complex relationships across your entire story universe.',
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    icon: Calendar,
    title: 'Timeline Builder',
    description: 'Track events and narrative progression with an intuitive, visual timeline system.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Globe,
    title: 'World Building',
    description: 'Create locations, kingdoms, lore, and civilizations with interconnected detail.',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    icon: GitBranch,
    title: 'Event Flow Mapping',
    description: 'Visualize story cause-and-effect chains to understand narrative consequences.',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    icon: Network,
    title: 'Character Relationship Graphs',
    description: 'Automatically generate relationship networks from your character data.',
    gradient: 'from-rose-500 to-pink-500',
  },
  {
    icon: Sparkles,
    title: 'AI Story Assistant',
    description: 'Future-ready AI-powered story intelligence to help you write better narratives.',
    gradient: 'from-fuchsia-500 to-violet-500',
  },
]

export function Features() {
  return (
    <section id="features" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <ScrollReveal className="text-center mb-16">
          <p className="text-sm font-medium text-violet-600 dark:text-violet-400 uppercase tracking-wider mb-3">Features</p>
          <h2 className="font-display text-4xl lg:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white mb-4">
            Everything You Need to<br />Build Amazing Worlds
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Powerful tools designed for writers who think in universes, not just pages.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <ScrollReveal key={feature.title} delay={i * 0.1}>
              <div className="group relative bg-white dark:bg-zinc-900 rounded-2xl p-8 border border-zinc-100 dark:border-zinc-800 hover:border-violet-200 dark:hover:border-violet-800 transition-all duration-500 hover:shadow-xl hover:shadow-violet-500/[0.04] dark:hover:shadow-violet-500/[0.02] h-full">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon size={22} className="text-white" />
                </div>
                <h3 className="font-display text-lg font-semibold text-zinc-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{feature.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
