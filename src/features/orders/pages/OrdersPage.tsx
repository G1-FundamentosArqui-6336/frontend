import { useState } from 'react';
import { useOrders } from '../hooks/useOrders';
import { useMarkOrderReady } from '../hooks/useMarkOrderReady';
import { useCompleteOrder } from '../hooks/useCompleteOrder';
import type { OrderDTO } from '@/core/dtos/order.dto';
import OrderLocationModal from '../components/OrderLocationModal';

export default function OrdersPage() {
  const { data: orders, isLoading, isError } = useOrders();
  const markReady = useMarkOrderReady();
  const completeOrder = useCompleteOrder();
  const [selectedOrder, setSelectedOrder] = useState<OrderDTO | null>(null);

  if (isLoading) return <div>Loading orders...</div>;
  if (isError) return <div>Error loading orders</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Orders</h2>

      {/* Orders table — use 'View Information' action to open modal */}

      <section>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Client</th>
              <th className="px-4 py-2 text-left">Address</th>
              <th className="px-4 py-2 text-left">City</th>
              <th className="px-4 py-2 text-left">Weight</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((o) => (
              <tr key={o.id} className="border-t">
                <td className="px-4 py-2">{o.id}</td>
                <td className="px-4 py-2">{o.clientId}</td>
                <td className="px-4 py-2">{o.addressLine}</td>
                <td className="px-4 py-2">{o.city}</td>
                <td className="px-4 py-2">{o.weightKg}</td>
                <td className="px-4 py-2">{o.orderStatus}</td>
                <td className="px-4 py-2">
                  <div className="flex gap-2">
                    <button type="button" onClick={(e) => { e.stopPropagation(); setSelectedOrder(o); }} className="px-2 py-1 bg-blue-500 text-white rounded">View Information</button>
                    <button type="button" onClick={(e) => { e.stopPropagation(); markReady.mutate(o.id); }} className="px-2 py-1 bg-yellow-500 text-white rounded">Mark Ready</button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const routeIdRaw = window.prompt('Route ID to assign?');
                        if (!routeIdRaw) return;
                        const routeId = Number(routeIdRaw);
                        const receiverName = window.prompt('Receiver name?') || 'Receiver';
                        const payload = { routeId, photoUrl: '', receiverName, signatureData: '' };
                        completeOrder.mutate({ orderId: o.id, payload });
                      }}
                      className="px-2 py-1 bg-green-600 text-white rounded"
                    >
                      Complete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      {selectedOrder && (
        <OrderLocationModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
}
