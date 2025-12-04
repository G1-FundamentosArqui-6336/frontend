import { useQuery } from '@tanstack/react-query';
import type { IncidentSummaryDTO } from '@/core/dtos/incident.dto';
import { listIncidents } from '@/services/incidentApi';

type IncidentListProps = {
  selectedId?: string;
  onSelect?: (incidentId: string) => void;
};

function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();
  const color =
    normalized === 'open' || normalized === 'new'
      ? 'bg-green-100 text-green-800'
      : normalized === 'closed'
        ? 'bg-gray-100 text-gray-800'
        : 'bg-yellow-100 text-yellow-800';
  return <span className={`px-2 py-1 rounded text-xs font-semibold ${color}`}>{status}</span>;
}

export default function IncidentList({ selectedId, onSelect }: IncidentListProps) {
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['incidents'],
    queryFn: listIncidents,
    staleTime: 1000 * 30,
  });

  if (isLoading) {
    return <div className="p-4 bg-white rounded border">Loading incidents...</div>;
  }

  if (isError) {
    return (
      <div className="p-4 bg-white rounded border">
        <div className="text-red-600 text-sm mb-2">Failed to load incidents.</div>
        <button
          type="button"
          onClick={() => refetch()}
          className="px-3 py-2 bg-blue-600 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded border shadow-sm">
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h3 className="text-lg font-semibold">Incidents</h3>
          <p className="text-xs text-gray-500">Click an incident to view details</p>
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          className="text-sm px-3 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
          disabled={isFetching}
        >
          {isFetching ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <ul className="divide-y">
        {data?.map((incident: IncidentSummaryDTO) => {
          const isActive = selectedId === incident.id;
          return (
            <li key={incident.id}>
              <button
                type="button"
                onClick={() => onSelect?.(incident.id)}
                className={`w-full text-left p-4 flex items-center justify-between gap-3 transition-colors ${
                  isActive ? 'bg-blue-50' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-900">{incident.title}</div>
                  <div className="text-xs text-gray-600">ID: {incident.id}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-xs text-gray-500">
                    Responsible: {incident.responsibleUserId ?? 'Unassigned'}
                  </div>
                  <StatusBadge status={incident.status} />
                </div>
              </button>
            </li>
          );
        })}
        {!data?.length && (
          <li className="p-4 text-sm text-gray-600">No incidents found.</li>
        )}
      </ul>
    </div>
  );
}
