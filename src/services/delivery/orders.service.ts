import { client } from '@/services/http/client';
import { orderSchema, createOrderSchema, completeOrderSchema, type OrderDTO, type CreateOrderDTO, type CompleteOrderDTO } from '@/core/dtos/order.dto';

export async function fetchOrders(): Promise<OrderDTO[]> {
  const res = await client.get('api/v1/orders');
  const json = await res.json();
  return orderSchema.array().parse(json);
}

export async function createOrder(payload: CreateOrderDTO): Promise<OrderDTO> {
  const body = createOrderSchema.parse(payload);
  const res = await client.post('api/v1/orders', { json: body });
  const json = await res.json();
  return orderSchema.parse(json);
}

export async function markOrderReady(orderId: number): Promise<OrderDTO> {
  const res = await client.patch(`api/v1/orders/${orderId}/ready-for-dispatch`);
  const json = await res.json();
  return orderSchema.parse(json);
}

export async function completeOrder(orderId: number, payload: CompleteOrderDTO): Promise<OrderDTO> {
  const body = completeOrderSchema.parse(payload);
  const res = await client.patch(`api/v1/orders/${orderId}/completed`, { json: body });
  const json = await res.json();
  return orderSchema.parse(json);
}

export async function getOrderById(id: number): Promise<OrderDTO> {
  const res = await client.get(`api/v1/orders/${id}`);
  const json = await res.json();
  return orderSchema.parse(json);
}

export async function fetchOrdersByIds(ids: number[]): Promise<OrderDTO[]> {
  const results = await Promise.all(ids.map((id) => getOrderById(id)));
  return results;
}

