import { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '@/features/auth/pages/LoginPage';
import RegisterPage from '@/features/auth/pages/RegisterPage';
import VehicleList from '@/features/vehicles/pages/VehicleList';
import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from '@/app/layouts/DashboardLayout';
import DriverPage from '@/features/dashboard/pages/DriverPage';
import OrdersPage from '@/features/orders/pages/OrdersPage';
import MaintenancePage from '@/features/dashboard/pages/MaintenancePage';
import VehiclesPage from '@/features/dashboard/pages/VehiclesPage';
import RoutesPage from '@/features/dashboard/pages/RoutesPage';

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
