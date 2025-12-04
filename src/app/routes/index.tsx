import { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '@/features/auth/pages/LoginPage';
import RegisterPage from '@/features/auth/pages/RegisterPage';
import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from '@/app/layouts/DashboardLayout';
import DriverPage from '@/features/drivers/pages/DriversPage';
import OrdersPage from '@/features/orders/pages/OrdersPage';
import MaintenancePage from '@/features/dashboard/pages/MaintenancePage';
import VehiclesPage from '@/features/dashboard/pages/VehiclesPage';
import RoutesPage from '@/features/routes/pages/RoutesPage';
import IncidentsPage from '@/features/incidents/pages/IncidentsPage';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<VehiclesPage />} />
            <Route path="driver" element={<DriverPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="incidents" element={<IncidentsPage />} />
            <Route path="maintenance" element={<MaintenancePage />} />
            <Route path="vehicles" element={<VehiclesPage />} />
            <Route path="routes" element={<RoutesPage />} />
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
