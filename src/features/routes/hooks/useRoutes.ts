import { useQuery } from '@tanstack/react-query';
import { fetchRoutes } from '@/services/fleet/route.service';

export function useRoutes() {
  return useQuery({
    queryKey: ['fleet', 'routes'],
    queryFn: fetchRoutes,
    staleTime: 1000 * 30,
  });
}
