import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addOrderToRoute, assignVehicle, assignDriver, markRouteInProgress } from '@/services/fleet/route.service';
import { toast } from 'react-toastify';

export function useAddOrderToRoute() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ routeId, payload }: { routeId: number; payload: { orderId: number } }) => addOrderToRoute(routeId, payload),
    onSuccess() {
      qc.invalidateQueries({ queryKey: ['fleet', 'routes'] });
      toast.success('Order added to route');
    },
    onError() {
      toast.error('Failed to add order to route');
    },
  });
}

export function useAssignVehicle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ routeId, payload }: { routeId: number; payload: { vehicleId: number } }) => assignVehicle(routeId, payload),
    onSuccess() {
      qc.invalidateQueries({ queryKey: ['fleet', 'routes'] });
      toast.success('Vehicle assigned to route');
    },
    onError() {
      toast.error('Failed to assign vehicle');
    },
  });
}

export function useAssignDriver() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ routeId, payload }: { routeId: number; payload: { driverId: number } }) => assignDriver(routeId, payload),
    onSuccess() {
      qc.invalidateQueries({ queryKey: ['fleet', 'routes'] });
      toast.success('Driver assigned to route');
    },
    onError() {
      toast.error('Failed to assign driver');
    },
  });
}

export function useMarkInProgress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (routeId: number) => markRouteInProgress(routeId),
    onSuccess() {
      qc.invalidateQueries({ queryKey: ['fleet', 'routes'] });
      toast.success('Route marked in progress');
    },
    onError() {
      toast.error('Failed to mark route in progress');
    },
  });
}
