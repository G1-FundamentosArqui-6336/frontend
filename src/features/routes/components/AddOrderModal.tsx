import { useState, useMemo } from 'react';
import { useOrders } from '@/features/orders/hooks/useOrders';
import { useAddOrderToRoute } from '../hooks/useRouteActions';
import type { OrderDTO } from '@/core/dtos/order.dto';

export default function AddOrderModal({
  routeId,
  onClose,
}: {
  routeId: number;
  onClose: (added?: boolean) => void;
}) {
  const { data: orders, isLoading, isError } = useOrders();
  const addOrder = useAddOrderToRoute();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<OrderDTO | null>(null);

  const filtered = useMemo(() => {
    if (!orders) return [] as OrderDTO[];
    const q = query.trim().toLowerCase();
    if (!q) return orders;
    return orders.filter((o) => {
      if (String(o.id) === q) return true;
      if (o.notes && o.notes.toLowerCase().includes(q)) return true;
      return false;
    });
  }, [orders, query]);

  async function handleConfirm() {
    if (!selected) return;
    addOrder.mutate({ routeId, payload: { orderId: selected.id } }, {
      onSuccess() {
        onClose(true);
      },
      onError() {
        // keep modal open to allow retry
      },
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div role="dialog" aria-modal="true" className="bg-white rounded shadow-lg w-full max-w-3xl p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Add Order to Route {routeId}</h3>
          <button onClick={() => onClose(false)} aria-label="Close" className="text-gray-600 hover:text-gray-900">✕</button>
        </div>

        <div className="mb-3">
          <input placeholder="Search by id or notes" value={query} onChange={(e) => setQuery(e.target.value)} className="w-full p-2 border rounded" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="max-h-64 overflow-auto border rounded p-2">
            {isLoading && <div>Loading orders...</div>}
            {isError && <div>Error loading orders</div>}
            {!isLoading && !isError && (
              <ul>
                {filtered.map((o) => (
                  <li key={o.id} className={`p-2 rounded cursor-pointer ${selected?.id === o.id ? 'bg-sky-100' : 'hover:bg-gray-50'}`} onClick={() => setSelected(o)}>
                    <div className="text-sm font-medium">#{o.id} — {o.clientId}</div>
                    <div className="text-xs text-gray-600 truncate">{o.addressLine} {o.city}</div>
                    <div className="text-xs text-gray-500">{o.notes ?? ''}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="border rounded p-2">
            <h4 className="font-semibold mb-2">Order details</h4>
            {!selected && <div className="text-sm text-gray-600">Select an order to preview its details.</div>}
            {selected && (
              <div className="text-sm">
                <div><strong>ID:</strong> {selected.id}</div>
                <div><strong>Client:</strong> {selected.clientId}</div>
                <div><strong>Address:</strong> {selected.addressLine}, {selected.city}</div>
                <div><strong>Postal:</strong> {selected.postalCode}</div>
                <div><strong>Weight:</strong> {selected.weightKg} kg</div>
                <div><strong>Status:</strong> {selected.orderStatus}</div>
                <div className="mt-2"><strong>Notes:</strong><div className="text-gray-700">{selected.notes ?? '-'}</div></div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button type="button" onClick={() => onClose(false)} className="px-3 py-1 border rounded">Cancel</button>
          <button type="button" onClick={handleConfirm} disabled={!selected || addOrder.status === 'pending'} className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50">{addOrder.status === 'pending' ? 'Adding...' : 'Confirm Add'}</button>
        </div>
      </div>
    </div>
  );
}
