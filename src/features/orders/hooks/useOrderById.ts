import { useQuery } from '@tanstack/react-query';
import { getOrderById } from '@/services/delivery/orders.service';

export function useOrderById(orderId?: number) {
  return useQuery({
    queryKey: ['delivery', 'orders', orderId],
    queryFn: () => (orderId ? getOrderById(orderId) : Promise.resolve(null)),
    enabled: Boolean(orderId),
    staleTime: 1000 * 30,
  });
}
