import { motion } from 'motion/react'
import { ScrollReveal } from './ScrollReveal'

function CharacterNetworkViz() {
  const nodes = [
    { id: 'arthur', label: 'King Arthur', x: 50, y: 30, color: '#8b5cf6' },
    { id: 'merlin', label: 'Merlin', x: 20, y: 60, color: '#10b981' },
    { id: 'morgana', label: 'Morgana', x: 80, y: 60, color: '#f43f5e' },
    { id: 'lancelot', label: 'Lancelot', x: 35, y: 85, color: '#3b82f6' },
    { id: 'guinevere', label: 'Guinevere', x: 65, y: 85, color: '#ec4899' },
  ]

  const edges = [
    { from: 'arthur', to: 'merlin', label: 'Advisor' },
    { from: 'arthur', to: 'morgana', label: 'Enemy' },
    { from: 'arthur', to: 'lancelot', label: 'Knight' },
    { from: 'arthur', to: 'guinevere', label: 'Queen' },
    { from: 'merlin', to: 'morgana', label: 'Rival' },
    { from: 'lancelot', to: 'guinevere', label: 'Secret Love' },
  ]

  return (
    <div className="relative w-full h-80">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        {edges.map((edge, i) => {
          const from = nodes.find(n => n.id === edge.from)!
          const to = nodes.find(n => n.id === edge.to)!
          return (
            <motion.line
              key={i}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="rgba(139, 92, 246, 0.3)"
              strokeWidth="0.3"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1, delay: i * 0.15 }}
              viewport={{ once: true }}
            />
          )
        })}
        {nodes.map((node, i) => (
          <motion.g
            key={node.id}
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
            viewport={{ once: true }}
          >
            <circle cx={node.x} cy={node.y} r="4" fill={node.color} opacity="0.9" />
            <circle cx={node.x} cy={node.y} r="6" fill={node.color} opacity="0.1" />
            <text x={node.x} y={node.y + 9} textAnchor="middle" fill="white" fontSize="3.2" fontFamily="Inter" fontWeight="500">
              {node.label}
            </text>
          </motion.g>
        ))}
      </svg>
    </div>
  )
}

function TimelineViz() {
  const events = [
    { year: '1000', label: 'The First Age Begins', color: '#8b5cf6' },
    { year: '1023', label: 'The Great War', color: '#f59e0b' },
    { year: '1045', label: 'Discovery of Magic', color: '#10b981' },
    { year: '1067', label: 'Fall of the Empire', color: '#f43f5e' },
    { year: '1089', label: 'The New Alliance', color: '#3b82f6' },
  ]

  return (
    <div className="relative w-full py-8 overflow-x-auto">
      <div className="flex items-center min-w-[600px] px-8">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent absolute left-0 right-0 top-1/2" />
        {events.map((event, i) => (
          <motion.div
            key={i}
            className="flex-1 flex flex-col items-center relative"
            initial={{ opacity: 0, y: i % 2 === 0 ? -20 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.15 }}
            viewport={{ once: true }}
          >
            <div className={`text-center ${i % 2 === 0 ? 'mb-6' : 'mt-6 order-2'}`}>
              <p className="text-xs font-mono" style={{ color: event.color }}>{event.year}</p>
              <p className="text-xs text-zinc-400 mt-1 max-w-[100px]">{event.label}</p>
            </div>
            <div
              className="w-3 h-3 rounded-full border-2 border-zinc-800 z-10 order-1"
              style={{ backgroundColor: event.color }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function StoryFlowViz() {
  const steps = [
    { label: 'King Receives\nProphecy', color: '#8b5cf6' },
    { label: 'Quest\nAssigned', color: '#3b82f6' },
    { label: 'Party\nAssembled', color: '#10b981' },
    { label: 'Dragon\nDefeated', color: '#f59e0b' },
    { label: 'Kingdom\nSaved', color: '#ec4899' },
  ]

  return (
    <div className="flex items-center justify-center gap-2 py-8 overflow-x-auto">
      {steps.map((step, i) => (
        <motion.div
          key={i}
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: i * 0.15 }}
          viewport={{ once: true }}
        >
          <div
            className="px-4 py-3 rounded-xl border border-zinc-800 text-center min-w-[100px]"
            style={{ borderColor: step.color + '40' }}
          >
            <p className="text-xs text-zinc-300 whitespace-pre-line leading-tight">{step.label}</p>
          </div>
          {i < steps.length - 1 && (
            <svg width="24" height="12" viewBox="0 0 24 12" className="text-zinc-600 flex-shrink-0">
              <path d="M0 6h18m0 0l-4-4m4 4l-4 4" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
          )}
        </motion.div>
      ))}
    </div>
  )
}

const visualizations = [
  { title: 'Character Network', subtitle: 'Interactive relationship mapping', component: <CharacterNetworkViz /> },
  { title: 'Timeline Visualization', subtitle: 'Chronological event progression', component: <TimelineViz /> },
  { title: 'Story Flow', subtitle: 'Cause-and-effect event chains', component: <StoryFlowViz /> },
]

export function VisualizationSection() {
  return (
    <section id="visualizations" className="py-24 lg:py-32 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <ScrollReveal className="text-center mb-16">
          <p className="text-sm font-medium text-violet-400 uppercase tracking-wider mb-3">Visualizations</p>
          <h2 className="font-display text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
            See Your Stories<br />Come to Life
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Powerful visual systems that transform your narrative data into interactive maps and graphs.
          </p>
        </ScrollReveal>

        <div className="space-y-8">
          {visualizations.map((viz, i) => (
            <ScrollReveal key={viz.title} delay={i * 0.15}>
              <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-8 lg:p-10">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-display text-lg font-semibold text-white">{viz.title}</h3>
                    <p className="text-sm text-zinc-500">{viz.subtitle}</p>
                  </div>
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-zinc-800" />
                    <div className="w-3 h-3 rounded-full bg-zinc-800" />
                    <div className="w-3 h-3 rounded-full bg-zinc-800" />
                  </div>
                </div>
                {viz.component}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
