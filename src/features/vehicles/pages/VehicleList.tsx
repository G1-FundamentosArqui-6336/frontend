import type { FormEvent } from 'react';
import { useState } from 'react';
import { useVehicles } from '../hooks/useVehicles';
import { useCreateVehicle } from '../hooks/useCreateVehicle';
import type { VehicleDTO } from '@/core/dtos/vehicle.dto';

export default function VehicleList() {
  const { data, isLoading, isError } = useVehicles();
  const create = useCreateVehicle();

  const [plate, setPlate] = useState('');
  const [capacity, setCapacity] = useState<number | ''>('');

  if (isLoading) return <div>Cargando vehículos…</div>;
  if (isError) return <div>Error al cargar vehículos</div>;

  function handleCreate(e: FormEvent) {
    e.preventDefault();
    if (!plate || capacity === '') return;
    create.mutate({ plateNumber: plate, capacityKg: Number(capacity) });
    setPlate('');
    setCapacity('');
  }

  return (
    <div>
      <h1 className="text-black text-2xl font-semibold mb-4">Vehículos</h1>

      <form onSubmit={handleCreate} className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
        <div>
          <label className="block text-sm">Matrícula</label>
          <input className="mt-1 block w-full rounded-md border-gray-300 p-2" value={plate} onChange={(e) => setPlate(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm">Capacidad (kg)</label>
          <input className="mt-1 block w-full rounded-md border-gray-300 p-2" type="number" value={capacity} onChange={(e) => setCapacity(e.target.value === '' ? '' : Number(e.target.value))} />
        </div>
        <div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md">Crear</button>
        </div>
      </form>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full divide-y divide-gray-200 table-fixed">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">ID</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Matrícula</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Capacidad (kg)</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Estado</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {(data ?? []).map((v: VehicleDTO) => (
              <tr key={v.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-700">{v.id}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{v.plateNumber}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{v.capacityKg}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{v.vehicleStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
