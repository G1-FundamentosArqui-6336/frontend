import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createVehicle } from '@/services/fleet/vehicle.service';
import type { CreateVehicleDTO, VehicleDTO } from '@/core/dtos/vehicle.dto';

export function useCreateVehicle() {
  const qc = useQueryClient();
  const mutationFn = (payload: CreateVehicleDTO) => createVehicle(payload) as Promise<VehicleDTO>;
  return useMutation<VehicleDTO, Error, CreateVehicleDTO>({
    mutationFn,
    onSuccess: () => qc.invalidateQueries(['fleet', 'vehicles']),
  });
}
