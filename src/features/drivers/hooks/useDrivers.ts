import { useQuery } from '@tanstack/react-query';
import { fetchDrivers } from '@/services/fleet/driver.service';

export function useDrivers() {
  return useQuery({
    queryKey: ['fleet', 'drivers'],
    queryFn: fetchDrivers,
    staleTime: 1000 * 30,
  });
}
