import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthProvider";
import { Home, User, Truck, Package, FileText, LogOut, AlertTriangle } from "lucide-react";

type SidebarLinkProps = {
  to: string;
  label: string;
  icon: React.ElementType;
};

function SidebarLink({ to, label, icon: Icon }: SidebarLinkProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition-colors",
          isActive
            ? "bg-brand-700 text-neutral-0 shadow-sm"
            : "text-neutral-0/90 hover:bg-brand-700/60",
        ].join(" ")
      }
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </NavLink>
  );
}

export default function DashboardLayout() {
  const { session, logout } = useAuth();
  const email = session?.user?.email ?? "";
  const roles = Array.isArray(session?.user?.roles) ? session!.user!.roles : [];
  const role = roles[0] ?? "";
  const isManager = roles.includes("ROLE_MANAGER");

  return (
    <div className="min-h-screen flex bg-neutral-200">
      <aside className="w-1/5 bg-brand-500 text-neutral-0 flex flex-col justify-between">
        <div>
          <div className="h-32 flex items-center justify-center border-b border-neutral-0/10">
            <img
              src="/assets/cobox-logo.webp"
              alt="CoBox Logo"
              className="h-20 w-20 rounded-full object-cover"
            />
          </div>

          <nav className="mt-6 px-3 space-y-2">
            <SidebarLink to="/" label="Home" icon={Home} />
            <SidebarLink to="driver" label="Driver" icon={User} />
            <SidebarLink to="vehicles" label="Vehicles" icon={Truck} />
            <SidebarLink to="orders" label="Orders" icon={Package} />
            <SidebarLink to="incidents" label="Incidents" icon={AlertTriangle} />
            <SidebarLink
              to="maintenance"
              label="Maintenance Orders"
              icon={FileText}
            />
            {isManager && (
              <SidebarLink to="routes" label="Routes" icon={Truck} />
            )}
          </nav>
        </div>

        {/* Logout abajo */}
        <div className="border-t border-neutral-0/15">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold bg-brand-700 hover:bg-brand-700/90 text-neutral-0 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-neutral-0 border-b border-neutral-200 flex items-center justify-between px-4">
          <div className="text-lg font-semibold text-neutral-900">
            Dashboard
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-neutral-900">
              {email}{" "}
              {role && (
                <span className="text-xs text-neutral-300">({role})</span>
              )}
            </div>
          </div>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
