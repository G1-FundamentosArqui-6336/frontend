import { useQuery } from '@tanstack/react-query';
import { fetchOrders } from '@/services/delivery/orders.service';

export function useOrders() {
  return useQuery({
    queryKey: ['delivery', 'orders'],
    queryFn: fetchOrders,
    staleTime: 1000 * 30,
  });
}
