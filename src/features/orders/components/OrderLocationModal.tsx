import MapPicker from '../components/MapPicker';
import type { OrderDTO } from '@/core/dtos/order.dto';
import { useState } from 'react';

export default function OrderLocationModal({ order, onClose }: { order: OrderDTO; onClose: (closed?: boolean) => void }) {
  const [pos] = useState<{ lat: number; lng: number } | null>(
    order.referenceLatitude != null && order.referenceLongitude != null ? { lat: order.referenceLatitude, lng: order.referenceLongitude } : null
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-3xl p-4 rounded">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Order #{order.id} details</h3>
          <button onClick={() => onClose(false)} className="text-gray-600">✕</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div><strong>Client:</strong> {order.clientId}</div>
            <div><strong>Address:</strong> {order.addressLine}</div>
            <div><strong>City:</strong> {order.city}</div>
            <div><strong>Country:</strong> {order.country}</div>
            <div><strong>Postal:</strong> {order.postalCode}</div>
            <div><strong>Weight (kg):</strong> {order.weightKg}</div>
            <div className="mt-2"><strong>Notes:</strong><div className="text-gray-700">{order.notes ?? '-'}</div></div>
            <div className="mt-2"><strong>Status:</strong> {order.orderStatus}</div>
            <div className="mt-2"><strong>Reference:</strong> {pos ? `${pos.lat.toFixed(6)}, ${pos.lng.toFixed(6)}` : 'None'}</div>
          </div>

          <div className="h-72">
            <MapPicker position={pos} onChange={() => { /* read-only in this modal */ }} />
          </div>
        </div>

        <div className="mt-3 flex justify-end gap-2">
          <button onClick={() => onClose(false)} className="px-3 py-1 border rounded">Close</button>
        </div>
      </div>
    </div>
  );
}
