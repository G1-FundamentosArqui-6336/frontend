import { useState } from 'react';
import IncidentList from '@/components/IncidentList';
import IncidentDetail from '@/components/IncidentDetail';

export default function IncidentsPage() {
  const [selectedId, setSelectedId] = useState<string | undefined>();

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
      <IncidentList selectedId={selectedId} onSelect={setSelectedId} />
      <IncidentDetail incidentId={selectedId} />
    </div>
  );
}
