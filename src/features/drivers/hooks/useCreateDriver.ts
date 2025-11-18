import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createDriver } from '@/services/fleet/driver.service';
import type { CreateDriverDTO } from '@/core/dtos/driver.dto';
import { toast } from 'react-toastify';

export function useCreateDriver() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateDriverDTO) => createDriver(payload),
    onSuccess() {
      qc.invalidateQueries({ queryKey: ['fleet', 'drivers'] });
      toast.success('Driver created');
    },
    onError() {
      toast.error('Failed to create driver');
    },
  });
}
