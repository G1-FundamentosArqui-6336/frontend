import { useQuery } from '@tanstack/react-query';
import { getVehicleById } from '@/services/fleet/vehicle.service';

export function useVehicleById(vehicleId?: number) {
  return useQuery({
    queryKey: ['fleet', 'vehicles', vehicleId],
    queryFn: () => (vehicleId ? getVehicleById(vehicleId) : Promise.resolve(null)),
    enabled: Boolean(vehicleId),
    staleTime: 1000 * 30,
  });
}
