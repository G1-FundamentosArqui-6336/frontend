import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getIncident } from '@/services/incidentApi';
import AssignResponsibleUserDialog from './AssignResponsibleUserDialog';

type IncidentDetailProps = {
  incidentId?: string;
};

export default function IncidentDetail({ incidentId }: IncidentDetailProps) {
  const [showDialog, setShowDialog] = useState(false);
  const { data, isLoading, isError } = useQuery({
    queryKey: ['incidents', incidentId],
    queryFn: () => getIncident(incidentId!),
    enabled: Boolean(incidentId),
    staleTime: 1000 * 15,
  });

  if (!incidentId) {
    return <div className="p-6 bg-white rounded border text-gray-600">Select an incident to view details.</div>;
  }

  if (isLoading) {
    return <div className="p-6 bg-white rounded border">Loading incident...</div>;
  }

  if (isError || !data) {
    return <div className="p-6 bg-white rounded border text-red-600">Error loading incident.</div>;
  }

  return (
    <div className="bg-white rounded border shadow-sm p-6 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs text-gray-500">Incident #{data.id}</div>
          <h3 className="text-xl font-semibold text-gray-900">{data.title}</h3>
          <div className="text-sm text-gray-700 mt-1">Status: {data.status}</div>
          <div className="text-sm text-gray-700">Responsible: {data.responsibleUserId ?? 'Unassigned'}</div>
        </div>
        <button
          type="button"
          onClick={() => setShowDialog(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Assign / Change Responsible
        </button>
      </div>

      {data.description && (
        <div>
          <h4 className="text-sm font-semibold text-gray-800 mb-1">Description</h4>
          <p className="text-sm text-gray-700 whitespace-pre-line">{data.description}</p>
        </div>
      )}

      {data.metadata && (
        <div>
          <h4 className="text-sm font-semibold text-gray-800 mb-1">Metadata</h4>
          <pre className="text-xs bg-gray-50 p-3 rounded border overflow-auto">{JSON.stringify(data.metadata, null, 2)}</pre>
        </div>
      )}

      {showDialog && (
        <AssignResponsibleUserDialog
          incident={data}
          onClose={() => setShowDialog(false)}
        />
      )}
    </div>
  );
}
