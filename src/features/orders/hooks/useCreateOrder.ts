import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createOrder } from '@/services/delivery/orders.service';
import type { CreateOrderDTO } from '@/core/dtos/order.dto';
import { toast } from 'react-toastify';

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateOrderDTO) => createOrder(payload),
    onSuccess() {
      qc.invalidateQueries({ queryKey: ['delivery', 'orders'] });
      toast.success('Order created');
    },
    onError() {
      toast.error('Failed to create order');
    },
  });
}
