import React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { Shield, LayoutGrid, Tag, LogOut, Users, Truck, MapPin, ClipboardList, History, PackageSearch, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logoImg from '../../assets/logo.jpeg';
import { ApiStatusBadge } from '../admin/ApiStatusBadge';

export const AdminLayout = () => {
  const { logout } = useAuth();

  const navItems = [
    { name: 'Orders', path: '/admin/orders', icon: ClipboardList },
    { name: 'Staff Management', path: '/admin/staff', icon: Users },
    { name: 'Categories', path: '/admin/categories', icon: LayoutGrid },
    { name: 'Products', path: '/admin/products', icon: PackageSearch },
    { name: 'Coupons', path: '/admin/coupons', icon: Tag },
    { name: 'Deliveries', path: '/admin/deliveries', icon: Truck },
    { name: 'Delivery Areas', path: '/admin/delivery-areas', icon: MapPin },
    { name: 'Customer History', path: '/admin/customer-history', icon: History },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-brand-lightBg font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-black text-white flex flex-col shrink-0 fixed inset-y-0 left-0 z-50">
        <div className="p-6 flex items-center gap-4 border-b border-neutral-800">
          <div className="w-10 h-10 rounded-xl bg-brand-white flex items-center justify-center shadow-lg shadow-primary/20 shrink-0 overflow-hidden">
            <img src={logoImg} alt="ONE MORE Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <Link to="/" className="text-xl font-black tracking-tight block hover:text-primary transition-colors">
              ONE<span className="text-primary">MORE</span>
            </Link>
            <span className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Admin Panel</span>
          </div>
        </div>

        <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-white shadow-lg shadow-primary/20'
                      : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                    {item.name}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-neutral-800 space-y-4">
          <ApiStatusBadge />
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl font-bold text-neutral-400 hover:bg-semantic-danger/10 hover:text-semantic-danger transition-colors duration-200"
          >
            <LogOut size={20} strokeWidth={2.5} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen relative overflow-x-hidden">
        {/* Background gradient decorative element */}
        <div className="absolute top-0 left-0 w-full h-72 bg-gradient-to-b from-neutral-200/40 to-transparent -z-10"></div>
        <div className="p-2 min-h-screen">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
