'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'

import { QuestDetail } from '@/components/roadmap/quest-detail'
import { QuestTree } from '@/components/roadmap/quest-tree'
import { RoadmapHeader } from '@/components/roadmap/roadmap-header'
import { PageHeader } from '@/components/shared/page-header'

import { useRoadmap } from './use-roadmap'

export function RoadmapView() {
  const { cols, nodes, stats, complete, uncomplete, isComplete } = useRoadmap()

  const [selectedId, setSelectedId] = useState<string | null>(
    () => nodes.find((n) => n.status === 'available')?.id ?? nodes[0]?.id ?? null,
  )
  const [announcement, setAnnouncement] = useState('')
  const [celebrateId, setCelebrateId] = useState<string | null>(null)
  const [pulseEdges, setPulseEdges] = useState<string[]>([])

  const selected = nodes.find((n) => n.id === selectedId) ?? null

  const requiresLabels = useMemo(
    () =>
      selected ? selected.requires.map((r) => nodes.find((n) => n.id === r)?.title ?? r) : [],
    [selected, nodes],
  )

  const handleComplete = (id: string) => {
    const node = nodes.find((n) => n.id === id)
    if (!node) return

    // Quests that flip from locked to available now that this one is done.
    const unlocked = nodes.filter(
      (n) =>
        n.status === 'locked' &&
        n.requires.includes(id) &&
        n.requires.every((r) => r === id || isComplete(r)),
    )

    complete(id)

    // The earned moment: a one-shot gold pulse on the node + a celebratory toast.
    setCelebrateId(id)
    window.setTimeout(() => setCelebrateId((current) => (current === id ? null : current)), 1000)

    // Gold energy travels each newly-opened edge, from this quest to what it unlocks.
    if (unlocked.length) {
      const edges = unlocked.map((n) => `${id}-${n.id}`)
      setPulseEdges(edges)
      window.setTimeout(() => setPulseEdges((current) => (current === edges ? [] : current)), 1300)
    }

    toast.success(`Quest complete — +${node.xp} XP`, {
      description: unlocked.length
        ? `Unlocked: ${unlocked.map((n) => n.title).join(', ')}`
        : 'Momentum is compounding — keep going.',
      action: {
        label: 'Undo',
        onClick: () => {
          uncomplete(id)
          setCelebrateId((current) => (current === id ? null : current))
        },
      },
    })

    setAnnouncement(
      `${node.title} completed, plus ${node.xp} experience points.` +
        (unlocked.length ? ` Unlocked ${unlocked.map((n) => n.title).join(', ')}.` : ''),
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roadmap"
        description="Your quest to recruiter-ready. Complete a quest to unlock what’s next — finished quests stay on the map."
      />

      <RoadmapHeader stats={stats} />

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="bg-card ring-foreground/10 overflow-x-auto rounded-xl p-4 ring-1 sm:p-6">
          <QuestTree
            cols={cols}
            nodes={nodes}
            selectedId={selectedId}
            celebrateId={celebrateId}
            pulseEdges={pulseEdges}
            onSelect={setSelectedId}
          />
        </div>
        <div className="lg:sticky lg:top-[calc(var(--header-height)+1.5rem)] lg:self-start">
          <QuestDetail node={selected} requiresLabels={requiresLabels} onComplete={handleComplete} />
        </div>
      </div>

      <div className="sr-only" role="status" aria-live="polite">
        {announcement}
      </div>
    </div>
  )
}
