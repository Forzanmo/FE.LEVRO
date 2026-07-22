import { useQuery } from '@tanstack/react-query'

import { dashboardService } from '@/services/api/dashboard-service'

export const dashboardKeys = {
  all: ['dashboard'] as const,
  overview: () => [...dashboardKeys.all, 'overview'] as const,
}

/** Reads the dashboard overview through the dashboard service. */
export function useDashboardOverview() {
  return useQuery({
    queryKey: dashboardKeys.overview(),
    queryFn: () => dashboardService.getOverview(),
  })
}
