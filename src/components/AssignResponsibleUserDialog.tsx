import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiError, assignResponsibleUser, publishIncidentEvent, searchUsers } from '@/services/incidentApi';
import type { IncidentDetailDTO } from '@/core/dtos/incident.dto';
import type { UserDTO } from '@/core/dtos/user.dto';
import { toast } from 'react-toastify';
import { useAuth } from '@/app/providers/AuthProvider';

type Props = {
  incident: IncidentDetailDTO;
  onClose: () => void;
};

export default function AssignResponsibleUserDialog({ incident, onClose }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserDTO | null>(null);
  const [reason, setReason] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const qc = useQueryClient();
  const { session } = useAuth();

  useEffect(() => {
    setSearchTerm('');
    setSelectedUser(null);
    setReason('');
    setFormError(null);
  }, [incident.id]);

  const userSearch = useQuery({
    queryKey: ['users', 'search', searchTerm],
    queryFn: () => searchUsers(searchTerm.trim()),
    enabled: searchTerm.trim().length >= 2,
    staleTime: 1000 * 60,
  });

  const isIdle = userSearch.fetchStatus === 'idle';
  const isSearching = userSearch.fetchStatus === 'fetching';
  const availableUsers = useMemo(() => userSearch.data ?? [], [userSearch.data]);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!selectedUser) throw new Error('No user selected');
      return assignResponsibleUser(incident.id, { newResponsibleUserId: selectedUser.id });
    },
    async onSuccess(updatedIncident) {
      qc.invalidateQueries({ queryKey: ['incidents'] });
      qc.invalidateQueries({ queryKey: ['incidents', incident.id] });
      toast.success('Responsible updated');

      await publishIncidentEvent({
        incidentId: updatedIncident.id,
        oldResponsibleUserId: incident.responsibleUserId,
        newResponsibleUserId: selectedUser!.id,
        changedBy: session?.user?.id ? String(session.user.id) : undefined,
        reason,
      });

      onClose();
    },
    onError(error: unknown) {
      let message = 'Could not assign responsible';
      if (error instanceof ApiError) {
        if (error.status === 403) message = 'You do not have permission to reassign this incident.';
        else if (error.status === 409) message = 'Incident changed meanwhile. Please refresh and try again.';
        else if (error.status === 422) message = 'Provided data is invalid. Check the selected user.';
        else if (error.message) message = error.message;
      }
      toast.error(message);
      setFormError(message);
    },
  });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!selectedUser) {
      setFormError('Select a user from the list.');
      return;
    }
    if (selectedUser.id === incident.responsibleUserId) {
      setFormError('The incident is already assigned to this user.');
      return;
    }
    if (!reason.trim()) {
      setFormError('Please provide a reason for the reassignment.');
      return;
    }
    setFormError(null);
    const confirmed = window.confirm(`Change responsible to ${selectedUser.email}?`);
    if (!confirmed) return;
    mutation.mutate();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded shadow-xl w-full max-w-3xl">
        <header className="flex items-center justify-between p-4 border-b">
          <div>
            <p className="text-xs text-gray-500">Incident #{incident.id}</p>
            <h3 className="text-lg font-semibold">Assign Responsible User</h3>
          </div>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900 text-sm">Close</button>
        </header>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-800">Search user</label>
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Type at least 2 characters to search"
              className="w-full border rounded px-3 py-2 text-sm"
            />
            <div className="text-xs text-gray-500">
              Users are resolved from the user context via <code>/api/users?query=</code>.
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded p-3 max-h-64 overflow-auto">
              {isSearching && <div className="text-sm">Searching users...</div>}
              {userSearch.isError && <div className="text-sm text-red-600">Error searching users.</div>}
              {isIdle && <div className="text-sm text-gray-600">Start typing to search users.</div>}
              {availableUsers.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => setSelectedUser(user)}
                  className={`w-full text-left p-2 rounded mb-2 border ${
                    selectedUser?.id === user.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-sm font-semibold">{user.email}</div>
                  <div className="text-xs text-gray-600">ID: {user.id}</div>
                </button>
              ))}
              {!availableUsers.length && searchTerm.trim().length >= 2 && !userSearch.isLoading && (
                <div className="text-sm text-gray-600">No users found for that query.</div>
              )}
            </div>

            <div className="border rounded p-3 space-y-2">
              <div className="text-sm">
                <div className="text-xs text-gray-500 uppercase tracking-wide">Current responsible</div>
                <div className="font-semibold">{incident.responsibleUserId ?? 'Unassigned'}</div>
              </div>
              <div className="text-sm">
                <div className="text-xs text-gray-500 uppercase tracking-wide">Selected user</div>
                {selectedUser ? (
                  <>
                    <div className="font-semibold">{selectedUser.email}</div>
                    <div className="text-xs text-gray-600">ID: {selectedUser.id}</div>
                  </>
                ) : (
                  <div className="text-gray-600">Select a user from the search results.</div>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-800" htmlFor="reason">
                  Reason for change (required)
                </label>
                <textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  className="w-full border rounded px-3 py-2 text-sm"
                  placeholder="Capture why you are reassigning this incident"
                />
              </div>
            </div>
          </div>

          {formError && <div className="text-sm text-red-600">{formError}</div>}

          <div className="flex justify-end gap-2 border-t pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            >
              {mutation.isPending ? 'Assigning...' : 'Confirm change'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
