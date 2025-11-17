import { useMutation, useQueryClient } from '@tanstack/react-query';
import { markOrderReady } from '@/services/delivery/orders.service';
import { toast } from 'react-toastify';

export function useMarkOrderReady() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (orderId: number) => markOrderReady(orderId),
    onSuccess() {
      qc.invalidateQueries({ queryKey: ['delivery', 'orders'] });
      toast.success('Order marked ready');
    },
    onError() {
      toast.error('Failed to mark order ready');
    },
  });
}
