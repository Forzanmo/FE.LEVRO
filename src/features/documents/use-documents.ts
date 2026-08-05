import { useQuery } from '@tanstack/react-query'

import { documentsService } from '@/services/api/documents-service'

export const documentKeys = {
  all: ['documents'] as const,
  list: () => [...documentKeys.all, 'list'] as const,
  detail: (id: string) => [...documentKeys.all, 'detail', id] as const,
}

export function useDocuments() {
  return useQuery({
    queryKey: documentKeys.list(),
    queryFn: () => documentsService.list(),
  })
}

export function useDocument(id: string) {
  return useQuery({
    queryKey: documentKeys.detail(id),
    queryFn: () => documentsService.get(id),
  })
}
