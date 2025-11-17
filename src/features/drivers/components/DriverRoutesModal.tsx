import React, { useState } from 'react';
import { useDriverRoutes } from '@/features/drivers/hooks/useDriverRoutes';
import { useRouteById } from '@/features/routes/hooks/useRouteById';
import { useVehicleById } from '@/features/vehicles/hooks/useVehicleById';
import { fetchOrdersByIds } from '@/services/delivery/orders.service';
import { useQuery } from '@tanstack/react-query';

export default function DriverRoutesModal({ driverId, onClose }: { driverId: number; onClose: () => void }) {
  const { data: routes, isLoading, isError } = useDriverRoutes(driverId);
  const [selectedRouteId, setSelectedRouteId] = useState<number | null>(null);

  const { data: route, isLoading: routeLoading, isError: routeError } = useRouteById(selectedRouteId ?? undefined);
  const vehicleId = route?.vehicleId ?? undefined;
  const { data: vehicle, isLoading: vehicleLoading } = useVehicleById(vehicleId);

  const ordersIds = route?.ordersIds?.map((o: { orderId: number }) => o.orderId) ?? [];
  const finishedIds = route?.finishedOrderIds?.map((o: { orderId: number }) => o.orderId) ?? [];

  const { data: orders } = useQuery({
    queryKey: ['delivery', 'orders', 'byIds', ordersIds],
    queryFn: () => (ordersIds.length ? fetchOrdersByIds(ordersIds) : Promise.resolve([])),
    enabled: ordersIds.length > 0,
  });

  const { data: finishedOrders } = useQuery({
    queryKey: ['delivery', 'orders', 'byIds', 'finished', finishedIds],
    queryFn: () => (finishedIds.length ? fetchOrdersByIds(finishedIds) : Promise.resolve([])),
    enabled: finishedIds.length > 0,
  });

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-11/12 max-w-5xl p-4 rounded shadow-lg grid grid-cols-12 gap-4">
        <div className="col-span-12 flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Routes for driver {driverId}</h3>
          <button type="button" onClick={onClose} className="px-2 py-1 bg-gray-200 rounded">Close</button>
        </div>

        <div className="col-span-5 border-r pr-2 overflow-auto max-h-[70vh]">
          {isLoading && <div>Loading routes...</div>}
          {isError && <div>Error loading routes</div>}

          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2"> </th>
              </tr>
            </thead>
            <tbody>
              {routes?.map((r) => (
                <tr key={r.id} className={`border-t ${selectedRouteId === r.id ? 'bg-slate-100' : ''}`}>
                  <td className="px-4 py-2">{r.id}</td>
                  <td className="px-4 py-2">{r.title}</td>
                  <td className="px-4 py-2">{r.routeStatus}</td>
                  <td className="px-4 py-2">
                    <button type="button" onClick={() => setSelectedRouteId(r.id)} className="px-2 py-1 bg-blue-500 text-white rounded">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="col-span-7 pl-4 overflow-auto max-h-[70vh]">
          {selectedRouteId == null && <div className="text-sm text-gray-500">Seleccione una ruta a la izquierda para ver detalles.</div>}

          {routeLoading && <div>Loading route...</div>}
          {routeError && <div>Error loading route</div>}

          {route && (
            <div>
              <p><strong>Title:</strong> {route.title}</p>
              <p><strong>Status:</strong> {route.routeStatus}</p>

              <div className="mt-4">
                <h4 className="font-semibold">Vehicle</h4>
                {vehicleLoading && <div>Loading vehicle...</div>}
                {vehicle && (
                  <div className="border p-2 rounded">
                    <p><strong>ID:</strong> {vehicle.id}</p>
                    <p><strong>Plate:</strong> {vehicle.plateNumber ?? 'N/A'}</p>
                    <p><strong>Capacity Kg:</strong> {vehicle.capacityKg ?? 'N/A'}</p>
                  </div>
                )}
              </div>

              <div className="mt-4">
                <h4 className="font-semibold">Assigned Orders</h4>
                {orders?.length ? (
                  <ul className="list-disc ml-6">
                    {orders.map((o) => (
                      <li key={o.id} className="mb-2">
                        <div className="border p-2 rounded">
                          <p><strong>ID:</strong> {o.id}</p>
                          <p><strong>Client:</strong> {o.clientId}</p>
                          <p><strong>Address:</strong> {o.addressLine}, {o.city}</p>
                          <p><strong>Status:</strong> {o.orderStatus}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : <div>No assigned orders</div>}
              </div>

              <div className="mt-4">
                <h4 className="font-semibold">Finished Orders</h4>
                {finishedOrders?.length ? (
                  <ul className="list-disc ml-6">
                    {finishedOrders.map((o) => (
                      <li key={o.id} className="mb-2">
                        <div className="border p-2 rounded">
                          <p><strong>ID:</strong> {o.id}</p>
                          <p><strong>Client:</strong> {o.clientId}</p>
                          <p><strong>Address:</strong> {o.addressLine}, {o.city}</p>
                          <p><strong>Status:</strong> {o.orderStatus}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : <div>No finished orders</div>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
