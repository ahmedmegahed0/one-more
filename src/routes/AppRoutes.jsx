import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CustomerLayout } from '../components/layout/CustomerLayout';
import { AdminLayout } from '../components/layout/AdminLayout';
import { Home } from '../pages/public/Home';
import { AdminLogin } from '../pages/auth/AdminLogin';
import { StaffLogin } from '../pages/auth/StaffLogin';
import { ProtectedRoute } from './ProtectedRoute';
import { StaffManagement } from '../pages/admin/StaffManagement';
import { CategoriesManagement } from '../pages/admin/CategoriesManagement';
import { CouponsManagement } from '../pages/admin/CouponsManagement';
import { DeliveriesManagement } from '../pages/admin/DeliveriesManagement';
import { DeliveryAreasManagement } from '../pages/admin/DeliveryAreasManagement';
import { OrdersManagement } from '../pages/admin/Orders';
import { CustomerHistory } from '../pages/shared/CustomerHistory';
import { ProductsManagement } from '../pages/admin/ProductsManagement';
import { SettingsManagement } from '../pages/admin/SettingsManagement';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Customer Routes */}
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<Home />} />
        {/* Placeholders for future phases */}
        <Route path="/menu" element={<div className="p-20 text-center font-bold text-2xl">Menu Page Under Construction</div>} />
        <Route path="/cart" element={<div className="p-20 text-center font-bold text-2xl">Cart Page Under Construction</div>} />
      </Route>

      {/* Auth Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/staff/login" element={<StaffLogin />} />

      {/* Protected Admin Routes */}
      <Route element={<ProtectedRoute role="Admin" />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Navigate to="/admin/orders" replace />} />
          <Route path="/admin/orders" element={<OrdersManagement />} />
          <Route path="/admin/staff" element={<StaffManagement />} />
          <Route path="/admin/categories" element={<CategoriesManagement />} />
          <Route path="/admin/products" element={<ProductsManagement />} />
          <Route path="/admin/coupons" element={<CouponsManagement />} />
          <Route path="/admin/deliveries" element={<DeliveriesManagement />} />
          <Route path="/admin/delivery-areas" element={<DeliveryAreasManagement />} />
          <Route path="/admin/customer-history" element={<CustomerHistory />} />
          <Route path="/admin/settings" element={<SettingsManagement />} />
        </Route>
      </Route>

      {/* Protected Staff Routes */}
      <Route element={<ProtectedRoute role="Staff" />}>
        <Route path="/staff" element={<Navigate to="/staff/orders" replace />} />
        <Route path="/staff/orders" element={<div className="p-20 text-center font-bold text-2xl">Staff Terminal Under Construction</div>} />
      </Route>
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
