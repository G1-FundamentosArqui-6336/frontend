import { useState, useMemo } from 'react';
import { useDrivers } from '@/features/drivers/hooks/useDrivers';
import { useAssignDriver } from '../hooks/useRouteActions';
import type { DriverDTO } from '@/core/dtos/driver.dto';

export default function AssignDriverModal({ routeId, onClose }: { routeId: number; onClose: (assigned?: boolean) => void }) {
  const { data: drivers, isLoading, isError } = useDrivers();
  const assignDriver = useAssignDriver();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<DriverDTO | null>(null);

  const filtered = useMemo(() => {
    if (!drivers) return [] as DriverDTO[];
    const q = query.trim().toLowerCase();
    if (!q) return drivers;
    return drivers.filter((d) => String(d.id) === q || d.licenceNumber.toLowerCase().includes(q));
  }, [drivers, query]);

  function handleConfirm() {
    if (!selected) return;
    assignDriver.mutate({ routeId, payload: { driverId: selected.id } }, {
      onSuccess() {
        onClose(true);
      },
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div role="dialog" aria-modal="true" className="bg-white rounded shadow-lg w-full max-w-3xl p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Assign Driver to Route {routeId}</h3>
          <button onClick={() => onClose(false)} aria-label="Close" className="text-gray-600 hover:text-gray-900">✕</button>
        </div>

        <div className="mb-3">
          <input placeholder="Search by id or licence" value={query} onChange={(e) => setQuery(e.target.value)} className="w-full p-2 border rounded" />
        </div>

        <div className="flex gap-4">
          <div className="w-1/2 max-h-64 overflow-auto border rounded p-2">
            {isLoading && <div>Loading drivers...</div>}
            {isError && <div>Error loading drivers</div>}
            {!isLoading && !isError && (
              <ul>
                {filtered.map((d) => (
                  <li key={d.id} className={`p-2 rounded cursor-pointer ${selected?.id === d.id ? 'bg-sky-100' : 'hover:bg-gray-50'}`} onClick={() => setSelected(d)}>
                    <div className="text-sm font-medium">#{d.id} — {d.licenceNumber}</div>
                    <div className="text-xs text-gray-600 truncate">Status: {d.driverStatus}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="w-1/2 border rounded p-2">
            <h4 className="font-semibold mb-2">Driver details</h4>
            {!selected && <div className="text-sm text-gray-600">Select a driver to preview.</div>}
            {selected && (
              <div className="text-sm">
                <div><strong>ID:</strong> {selected.id}</div>
                <div><strong>Licence:</strong> {selected.licenceNumber}</div>
                <div><strong>Status:</strong> {selected.driverStatus}</div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button type="button" onClick={() => onClose(false)} className="px-3 py-1 border rounded">Cancel</button>
          <button type="button" onClick={handleConfirm} disabled={!selected || assignDriver.status === 'pending'} className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50">{assignDriver.status === 'pending' ? 'Assigning...' : 'Confirm Assign'}</button>
        </div>
      </div>
    </div>
  );
}
