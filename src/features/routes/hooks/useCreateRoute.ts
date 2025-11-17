import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createRoute } from '@/services/fleet/route.service';
import type { CreateRouteDTO } from '@/core/dtos/route.dto';
import { toast } from 'react-toastify';

export function useCreateRoute() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateRouteDTO) => createRoute(payload),
    onSuccess() {
      qc.invalidateQueries({ queryKey: ['fleet', 'routes'] });
      toast.success('Route created');
    },
    onError() {
      toast.error('Failed to create route');
    },
  });
}
