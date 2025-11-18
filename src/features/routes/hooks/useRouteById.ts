import { useQuery } from '@tanstack/react-query';
import { getRouteById } from '@/services/fleet/route.service';

export function useRouteById(routeId?: number) {
  return useQuery({
    queryKey: ['fleet', 'routes', routeId],
    queryFn: () => (routeId ? getRouteById(routeId) : Promise.resolve(null)),
    enabled: Boolean(routeId),
    staleTime: 1000 * 30,
  });
}
