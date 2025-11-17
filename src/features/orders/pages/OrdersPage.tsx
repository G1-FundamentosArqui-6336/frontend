import { useState } from 'react';
import { useOrders } from '../hooks/useOrders';
import { useCreateOrder } from '../hooks/useCreateOrder';
import { useMarkOrderReady } from '../hooks/useMarkOrderReady';
import { useCompleteOrder } from '../hooks/useCompleteOrder';
import type { CreateOrderDTO } from '@/core/dtos/order.dto';

export default function OrdersPage() {
  const { data: orders, isLoading, isError } = useOrders();
  const createOrder = useCreateOrder();
  const markReady = useMarkOrderReady();
  const completeOrder = useCompleteOrder();

  const [form, setForm] = useState<CreateOrderDTO>({
    clientId: 0,
    addressLine: '',
    city: '',
    country: '',
    postalCode: '',
    weightKg: 0,
  });

  function handleChange<K extends keyof CreateOrderDTO>(key: K, value: CreateOrderDTO[K]) {
    setForm((s) => ({ ...s, [key]: value }));
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    createOrder.mutate(form);
    setForm({ clientId: 0, addressLine: '', city: '', country: '', postalCode: '', weightKg: 0 });
  }

  if (isLoading) return <div>Loading orders...</div>;
  if (isError) return <div>Error loading orders</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Orders</h2>

      <section className="mb-6">
        <form onSubmit={handleCreate} className="grid grid-cols-3 gap-2 items-end">
          <div>
            <label className="block text-sm">Client ID</label>
            <input type="number" value={form.clientId} onChange={(e) => handleChange('clientId', Number(e.target.value))} className="mt-1 p-2 border rounded w-full" />
          </div>
          <div>
            <label className="block text-sm">Address</label>
            <input value={form.addressLine} onChange={(e) => handleChange('addressLine', e.target.value)} className="mt-1 p-2 border rounded w-full" />
          </div>
          <div>
            <label className="block text-sm">City</label>
            <input value={form.city} onChange={(e) => handleChange('city', e.target.value)} className="mt-1 p-2 border rounded w-full" />
          </div>
          <div>
            <label className="block text-sm">Country</label>
            <input value={form.country} onChange={(e) => handleChange('country', e.target.value)} className="mt-1 p-2 border rounded w-full" />
          </div>
          <div>
            <label className="block text-sm">Postal Code</label>
            <input value={form.postalCode} onChange={(e) => handleChange('postalCode', e.target.value)} className="mt-1 p-2 border rounded w-full" />
          </div>
          <div>
            <label className="block text-sm">Weight (kg)</label>
            <input type="number" value={form.weightKg} onChange={(e) => handleChange('weightKg', Number(e.target.value))} className="mt-1 p-2 border rounded w-full" />
          </div>
          <div className="col-span-3">
            <button type="submit" className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">Create Order</button>
          </div>
        </form>
      </section>

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
                    <button type="button" onClick={() => markReady.mutate(o.id)} className="px-2 py-1 bg-yellow-500 text-white rounded">Mark Ready</button>
                    <button
                      type="button"
                      onClick={() => {
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
    </div>
  );
}
