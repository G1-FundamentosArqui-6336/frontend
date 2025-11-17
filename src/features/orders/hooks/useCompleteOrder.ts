import { useMutation, useQueryClient } from '@tanstack/react-query';
import { completeOrder } from '@/services/delivery/orders.service';
import type { CompleteOrderDTO } from '@/core/dtos/order.dto';

export function useCompleteOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, payload }: { orderId: number; payload: CompleteOrderDTO }) =>
      completeOrder(orderId, payload),
    onSuccess() {
      qc.invalidateQueries({ queryKey: ['delivery', 'orders'] });
    },
  });
}
