'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'

import { QuestDetail } from '@/components/roadmap/quest-detail'
import { QuestTree } from '@/components/roadmap/quest-tree'
import { RoadmapHeader } from '@/components/roadmap/roadmap-header'
import { PageHeader } from '@/components/shared/page-header'
import { EmptyState } from '@/components/shared/empty-state'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { Skeleton } from '@/components/ui/skeleton'

import { useRoadmap } from './use-roadmap'

export function RoadmapView() {
  const { cols, nodes, stats, complete, uncomplete, isComplete, isPending, isError, retry } = useRoadmap()

  const [selectedId, setSelectedId] = useState<string | null>(
    () => nodes.find((n) => n.status === 'available')?.id ?? nodes[0]?.id ?? null,
  )
  const [announcement, setAnnouncement] = useState('')
  const [celebrateId, setCelebrateId] = useState<string | null>(null)
  const [pulseEdges, setPulseEdges] = useState<string[]>([])

  const effectiveSelectedId =
    selectedId ?? nodes.find((node) => node.status === 'available')?.id ?? nodes[0]?.id ?? null
  const selected = nodes.find((node) => node.id === effectiveSelectedId) ?? null

  const requiresLabels = useMemo(
    () =>
      selected ? selected.requires.map((r) => nodes.find((n) => n.id === r)?.title ?? r) : [],
    [selected, nodes],
  )

  const handleComplete = async (id: string) => {
    const node = nodes.find((n) => n.id === id)
    if (!node) return

    // Quests that flip from locked to available now that this one is done.
    const unlocked = nodes.filter(
      (n) =>
        n.status === 'locked' &&
        n.requires.includes(id) &&
        n.requires.every((r) => r === id || isComplete(r)),
    )

    try {
      await complete(id)
    } catch {
      toast.error('Could not save roadmap progress')
      return
    }

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
          void uncomplete(id)
            .then(() => setCelebrateId((current) => (current === id ? null : current)))
            .catch(() => toast.error('Could not undo roadmap progress'))
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

      {isPending ? (
        <Skeleton className="h-[32rem] rounded-xl" />
      ) : isError ? (
        <EmptyState
          icon="warning"
          title="Couldn’t load your roadmap"
          description="Your progress is safe. Try loading it again."
          action={<Button onClick={retry} leftIcon={<Icon name="refresh" size="sm" />}>Try again</Button>}
        />
      ) : (
        <>
          <RoadmapHeader stats={stats} />

          <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="bg-card ring-foreground/10 overflow-x-auto rounded-xl p-4 ring-1 sm:p-6">
          <QuestTree
            cols={cols}
            nodes={nodes}
            selectedId={effectiveSelectedId}
            celebrateId={celebrateId}
            pulseEdges={pulseEdges}
            onSelect={setSelectedId}
          />
        </div>
        <div className="lg:sticky lg:top-[calc(var(--header-height)+1.5rem)] lg:self-start">
          <QuestDetail node={selected} requiresLabels={requiresLabels} onComplete={handleComplete} />
        </div>
          </div>
        </>
      )}

      <div className="sr-only" role="status" aria-live="polite">
        {announcement}
      </div>
    </div>
  )
}
