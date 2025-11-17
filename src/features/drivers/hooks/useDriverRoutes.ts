import { useQuery } from '@tanstack/react-query';
import { fetchDriverRoutes } from '@/services/fleet/driver.service';

export function useDriverRoutes(driverId?: number) {
  return useQuery({
    queryKey: ['fleet', 'drivers', driverId, 'routes'],
    queryFn: () => (driverId ? fetchDriverRoutes(driverId) : Promise.resolve([])),
    enabled: Boolean(driverId),
    staleTime: 1000 * 30,
  });
}
