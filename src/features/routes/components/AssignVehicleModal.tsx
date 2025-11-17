import { useState, useMemo } from 'react';
import { useVehicles } from '@/features/vehicles/hooks/useVehicles';
import { useAssignVehicle } from '../hooks/useRouteActions';
import type { VehicleDTO } from '@/core/dtos/vehicle.dto';

export default function AssignVehicleModal({ routeId, onClose }: { routeId: number; onClose: (assigned?: boolean) => void }) {
  const { data: vehicles, isLoading, isError } = useVehicles();
  const assignVehicle = useAssignVehicle();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<VehicleDTO | null>(null);

  const filtered = useMemo(() => {
    if (!vehicles) return [] as VehicleDTO[];
    const q = query.trim().toLowerCase();
    if (!q) return vehicles;
    return vehicles.filter((v) => String(v.id) === q || v.plateNumber?.toLowerCase().includes(q) || v.vehicleStatus?.toLowerCase().includes(q));
  }, [vehicles, query]);

  function handleConfirm() {
    if (!selected) return;
    assignVehicle.mutate({ routeId, payload: { vehicleId: selected.id } }, {
      onSuccess() {
        onClose(true);
      },
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div role="dialog" aria-modal="true" className="bg-white rounded shadow-lg w-full max-w-3xl p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Assign Vehicle to Route {routeId}</h3>
          <button onClick={() => onClose(false)} aria-label="Close" className="text-gray-600 hover:text-gray-900">✕</button>
        </div>

        <div className="mb-3">
          <input placeholder="Search by id, plate or model" value={query} onChange={(e) => setQuery(e.target.value)} className="w-full p-2 border rounded" />
        </div>

        <div className="flex gap-4">
          <div className="w-1/2 max-h-64 overflow-auto border rounded p-2">
            {isLoading && <div>Loading vehicles...</div>}
            {isError && <div>Error loading vehicles</div>}
            {!isLoading && !isError && (
              <ul>
                {filtered.map((v) => (
                  <li key={v.id} className={`p-2 rounded cursor-pointer ${selected?.id === v.id ? 'bg-sky-100' : 'hover:bg-gray-50'}`} onClick={() => setSelected(v)}>
                    <div className="text-sm font-medium">#{v.id} — {v.plateNumber ?? v.vehicleStatus}</div>
                    <div className="text-xs text-gray-600 truncate">{v.vehicleStatus ?? ''}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="w-1/2 border rounded p-2">
            <h4 className="font-semibold mb-2">Vehicle details</h4>
            {!selected && <div className="text-sm text-gray-600">Select a vehicle to preview.</div>}
            {selected && (
              <div className="text-sm">
                <div><strong>ID:</strong> {selected.id}</div>
                <div><strong>Plate:</strong> {selected.plateNumber ?? '-'}</div>
                <div><strong>Status:</strong> {selected.vehicleStatus ?? '-'}</div>
                <div><strong>Capacity (kg):</strong> {selected.capacityKg ?? '-'}</div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button type="button" onClick={() => onClose(false)} className="px-3 py-1 border rounded">Cancel</button>
          <button type="button" onClick={handleConfirm} disabled={!selected || assignVehicle.status === 'pending'} className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50">{assignVehicle.status === 'pending' ? 'Assigning...' : 'Confirm Assign'}</button>
        </div>
      </div>
    </div>
  );
}
