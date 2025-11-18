import { useState } from 'react';
import { useDrivers } from '../hooks/useDrivers';
import { useCreateDriver } from '../hooks/useCreateDriver';
import DriverRoutesModal from '../components/DriverRoutesModal';

export default function DriversPage() {
  const { data: drivers, isLoading, isError } = useDrivers();
  const createDriver = useCreateDriver();
  const [selectedDriverId, setSelectedDriverId] = useState<number | null>(null);

  const [licenceNumber, setLicenceNumber] = useState('');

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    createDriver.mutate({ licenceNumber });
    setLicenceNumber('');
  }

  if (isLoading) return <div>Loading drivers...</div>;
  if (isError) return <div>Error loading drivers</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Drivers</h2>

      <section className="mb-6">
        <form onSubmit={handleCreate} className="flex gap-2 items-end">
          <div>
            <label className="block text-sm">Licence Number</label>
            <input value={licenceNumber} onChange={(e) => setLicenceNumber(e.target.value)} className="mt-1 p-2 border rounded" />
          </div>
          <div>
            <button type="submit" className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">Create Driver</button>
          </div>
        </form>
      </section>

      <section>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Licence</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {drivers?.map((d) => (
              <tr key={d.id} className="border-t">
                <td className="px-4 py-2">{d.id}</td>
                <td className="px-4 py-2">{d.licenceNumber}</td>
                <td className="px-4 py-2">{d.driverStatus}</td>
                <td className="px-4 py-2">
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setSelectedDriverId(d.id)} className="px-2 py-1 bg-indigo-500 text-white rounded">View Routes</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {selectedDriverId && (
          <DriverRoutesModal driverId={selectedDriverId} onClose={() => setSelectedDriverId(null)} />
        )}
      </section>
    </div>
  );
}
