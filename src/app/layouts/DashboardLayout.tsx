import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthProvider';

export default function DashboardLayout() {
  const { session, logout } = useAuth();
  const email = session?.user?.email ?? '';
  const roles = Array.isArray(session?.user?.roles) ? session!.user!.roles : [];
  const role = roles[0] ?? '';
  const isManager = roles.includes('ROLE_MANAGER');

  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-64 bg-white border-r">
        <div className="p-4 font-bold text-lg">CoBox Dashboard</div>
        <nav className="px-2 py-4">
          <NavLink to="driver" className={({isActive}) => `block px-3 py-2 rounded mb-1 ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>
            Driver
          </NavLink>
          <NavLink to="orders" className={({isActive}) => `block px-3 py-2 rounded mb-1 ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>
            Orders
          </NavLink>
          <NavLink to="maintenance" className={({isActive}) => `block px-3 py-2 rounded mb-1 ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>
            Maintenance Orders
          </NavLink>
          <NavLink to="vehicles" className={({isActive}) => `block px-3 py-2 rounded mb-1 ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>
            Vehicles
          </NavLink>
          {isManager && (
            <NavLink to="routes" className={({isActive}) => `block px-3 py-2 rounded mb-1 ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>
              Routes
            </NavLink>
          )}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b flex items-center justify-between px-4">
          <div className="text-lg font-semibold">Dashboard</div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">{email} <span className="text-xs text-gray-400">({role})</span></div>
            <button onClick={logout} className="text-sm text-red-600 hover:underline">Logout</button>
          </div>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
