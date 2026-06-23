import { useCallback, useMemo, useState } from 'react'
import ReactFlow, { Background, Controls, MiniMap, addEdge, useNodesState, useEdgesState, type Connection, type Node, type Edge } from 'reactflow'
import 'reactflow/dist/style.css'
import { motion } from 'motion/react'
import { Plus, X } from 'lucide-react'
import type { Character, CharacterRelationship } from '../lib/types'
import { api } from '../lib/api'

const relationshipTypes = ['Parent', 'Child', 'Friend', 'Enemy', 'Rival', 'Mentor', 'Student', 'Lover', 'Spouse', 'Ally']

const typeColors: Record<string, string> = {
  Parent: '#8b5cf6',
  Child: '#a78bfa',
  Friend: '#10b981',
  Enemy: '#f43f5e',
  Rival: '#f59e0b',
  Mentor: '#3b82f6',
  Student: '#06b6d4',
  Lover: '#ec4899',
  Spouse: '#f472b6',
  Ally: '#22c55e',
}

interface Props {
  characters: Character[]
  relationships: CharacterRelationship[]
  storyId: number
  onRefresh: () => void
}

export function RelationshipGraph({ characters, relationships, storyId, onRefresh }: Props) {
  const [showAddRel, setShowAddRel] = useState(false)
  const [relForm, setRelForm] = useState({ character_a: '', character_b: '', relationship_type: 'Friend', description: '' })

  const initialNodes: Node[] = useMemo(() => {
    const angleStep = (2 * Math.PI) / Math.max(characters.length, 1)
    const radius = Math.max(150, characters.length * 30)
    return characters.map((char, i) => ({
      id: String(char.id),
      position: {
        x: 400 + radius * Math.cos(angleStep * i - Math.PI / 2),
        y: 300 + radius * Math.sin(angleStep * i - Math.PI / 2),
      },
      data: { label: char.name, role: char.role },
      style: {
        background: 'white',
        border: '2px solid #8b5cf6',
        borderRadius: '12px',
        padding: '10px 16px',
        fontSize: '13px',
        fontWeight: 500,
        minWidth: 100,
        textAlign: 'center' as const,
        boxShadow: '0 4px 12px rgba(139, 92, 246, 0.1)',
      },
    }))
  }, [characters])

  const initialEdges: Edge[] = useMemo(() =>
    relationships.map(rel => ({
      id: String(rel.id),
      source: String(rel.character_a),
      target: String(rel.character_b),
      label: rel.relationship_type,
      labelStyle: { fontSize: 11, fontWeight: 500 },
      labelBgStyle: { fill: 'white', fillOpacity: 0.9 },
      labelBgPadding: [4, 2] as [number, number],
      labelBgBorderRadius: 4,
      style: { stroke: typeColors[rel.relationship_type] || '#8b5cf6', strokeWidth: 2 },
      animated: rel.relationship_type === 'Lover' || rel.relationship_type === 'Spouse',
    })),
    [relationships]
  )

  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = useCallback((params: Connection) => {
    setEdges(eds => addEdge({ ...params, style: { stroke: '#8b5cf6', strokeWidth: 2 } }, eds))
  }, [setEdges])

  async function handleAddRelationship() {
    if (!relForm.character_a || !relForm.character_b || relForm.character_a === relForm.character_b) return
    try {
      await api.relationships.create(storyId, {
        character_a: Number(relForm.character_a),
        character_b: Number(relForm.character_b),
        relationship_type: relForm.relationship_type,
        description: relForm.description || undefined,
      })
      setShowAddRel(false)
      setRelForm({ character_a: '', character_b: '', relationship_type: 'Friend', description: '' })
      onRefresh()
    } catch (err) {
      console.error('Failed to create relationship:', err)
    }
  }

  const selectStyle = "bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40"

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowAddRel(true)}
          className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black rounded-full px-4 py-2 text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
        >
          <Plus size={14} />
          Add Relationship
        </button>
      </div>

      {showAddRel && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-4 overflow-hidden">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-semibold text-zinc-900 dark:text-white">New Relationship</h3>
              <button onClick={() => setShowAddRel(false)} className="text-zinc-400 hover:text-zinc-600"><X size={20} /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">Character A</label>
                <select value={relForm.character_a} onChange={e => setRelForm(f => ({ ...f, character_a: e.target.value }))} className={selectStyle + " w-full"}>
                  <option value="">Select character</option>
                  {characters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">Relationship</label>
                <select value={relForm.relationship_type} onChange={e => setRelForm(f => ({ ...f, relationship_type: e.target.value }))} className={selectStyle + " w-full"}>
                  {relationshipTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">Character B</label>
                <select value={relForm.character_b} onChange={e => setRelForm(f => ({ ...f, character_b: e.target.value }))} className={selectStyle + " w-full"}>
                  <option value="">Select character</option>
                  {characters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <button
              onClick={handleAddRelationship}
              disabled={!relForm.character_a || !relForm.character_b || relForm.character_a === relForm.character_b}
              className="bg-black dark:bg-white text-white dark:text-black rounded-xl px-5 py-2 text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50"
            >
              Create Relationship
            </button>
          </div>
        </motion.div>
      )}

      {characters.length === 0 ? (
        <div className="text-center py-16 text-zinc-500">Add characters to see the relationship graph.</div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden" style={{ height: 600 }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
          >
            <Background />
            <Controls />
            <MiniMap nodeColor="#8b5cf6" maskColor="rgba(0,0,0,0.08)" />
          </ReactFlow>
        </div>
      )}
    </div>
  )
}
