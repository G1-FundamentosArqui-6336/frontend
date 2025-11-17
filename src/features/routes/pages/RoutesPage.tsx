import { useState } from 'react';
import { useRoutes } from '../hooks/useRoutes';
import { useCreateRoute } from '../hooks/useCreateRoute';
import { useMarkInProgress } from '../hooks/useRouteActions';
import AddOrderModal from '../components/AddOrderModal';
import AssignVehicleModal from '../components/AssignVehicleModal';
import AssignDriverModal from '../components/AssignDriverModal';
import RouteInfoModal from '../components/RouteInfoModal';

export default function RoutesPage() {
  const { data: routes, isLoading, isError } = useRoutes();
  const createRoute = useCreateRoute();
  const markInProgress = useMarkInProgress();

  const [title, setTitle] = useState('');
  const [openAddOrderFor, setOpenAddOrderFor] = useState<number | null>(null);
  const [openAssignVehicleFor, setOpenAssignVehicleFor] = useState<number | null>(null);
  const [openAssignDriverFor, setOpenAssignDriverFor] = useState<number | null>(null);
  const [openInfoFor, setOpenInfoFor] = useState<number | null>(null);

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    createRoute.mutate({ title });
    setTitle('');
  }

  if (isLoading) return <div>Loading routes...</div>;
  if (isError) return <div>Error loading routes</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Routes</h2>

      <section className="mb-6">
        <form onSubmit={handleCreate} className="flex gap-2 items-end">
          <div>
            <label className="block text-sm">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 p-2 border rounded" />
          </div>
          <div>
            <button type="submit" className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">Create Route</button>
          </div>
        </form>
      </section>

      <section>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left">Vehicle</th>
              <th className="px-4 py-2 text-left">Driver</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {routes?.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="px-4 py-2">{r.id}</td>
                <td className="px-4 py-2">{r.title}</td>
                <td className="px-4 py-2">{r.vehicleId ?? '-'}</td>
                <td className="px-4 py-2">{r.driverId ?? '-'}</td>
                <td className="px-4 py-2">{r.routeStatus}</td>
                <td className="px-4 py-2">
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setOpenAddOrderFor(r.id)} className="px-2 py-1 bg-yellow-500 text-white rounded">Add Order</button>

                    <button type="button" onClick={() => setOpenAssignVehicleFor(r.id)} className="px-2 py-1 bg-indigo-500 text-white rounded">Assign Vehicle</button>

                    <button type="button" onClick={() => setOpenAssignDriverFor(r.id)} className="px-2 py-1 bg-teal-500 text-white rounded">Assign Driver</button>

                    <button type="button" onClick={() => setOpenInfoFor(r.id)} className="px-2 py-1 bg-blue-500 text-white rounded">View Information</button>

                    <button type="button" onClick={() => markInProgress.mutate(r.id)} className="px-2 py-1 bg-green-600 text-white rounded">Mark In Progress</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      {openAddOrderFor && (
        <AddOrderModal routeId={openAddOrderFor} onClose={() => { setOpenAddOrderFor(null); }} />
      )}
      {openAssignVehicleFor && (
        <AssignVehicleModal routeId={openAssignVehicleFor} onClose={() => setOpenAssignVehicleFor(null)} />
      )}
      {openAssignDriverFor && (
        <AssignDriverModal routeId={openAssignDriverFor} onClose={() => setOpenAssignDriverFor(null)} />
      )}
      {openInfoFor && (
        <RouteInfoModal routeId={openInfoFor} onClose={() => setOpenInfoFor(null)} />
      )}
    </div>
  );
}
