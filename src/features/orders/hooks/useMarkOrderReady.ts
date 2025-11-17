import { useMutation, useQueryClient } from '@tanstack/react-query';
import { markOrderReady } from '@/services/delivery/orders.service';

export function useMarkOrderReady() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (orderId: number) => markOrderReady(orderId),
    onSuccess() {
      qc.invalidateQueries({ queryKey: ['delivery', 'orders'] });
    },
  });
}
