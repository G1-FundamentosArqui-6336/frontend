import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createVehicle } from '@/services/fleet/vehicle.service';
import type { CreateVehicleDTO, VehicleDTO } from '@/core/dtos/vehicle.dto';
import { toast } from 'react-toastify';

export function useCreateVehicle() {
  const qc = useQueryClient();
  const mutationFn = (payload: CreateVehicleDTO) => createVehicle(payload) as Promise<VehicleDTO>;
  return useMutation<VehicleDTO, Error, CreateVehicleDTO>({
    mutationFn,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['fleet', 'vehicles'] });
      toast.success('Vehicle created');
    },
    onError: () => {
      toast.error('Failed to create vehicle');
    },
  });
}
