import { useQuery } from '@tanstack/react-query';
import { fetchVehicles } from '@/services/fleet/vehicle.service';

export function useVehicles() {
  return useQuery({
    queryKey: ['fleet', 'vehicles'],
    queryFn: fetchVehicles,
    staleTime: 1000 * 60,
  });
}
