import React, { useState, useEffect } from 'react';
import { ordersApi } from '../../api/orders.api';
import { adminApi } from '../../api/admin.api';
import { OrderCard } from '../../components/orders/OrderCard';
import { AssignDeliveryModal } from '../../components/orders/AssignDeliveryModal';
import { CancelOrderModal } from '../../components/orders/CancelOrderModal';
import { InvoiceModal } from '../../components/orders/InvoiceModal';
import { Loader2, Calendar, ClipboardList, ChevronLeft, ChevronRight } from 'lucide-react';

export const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters & Pagination
  const [activeTab, setActiveTab] = useState('All'); // All, Pending, Preparing, OnWay, Cancelled
  const [dateMode, setDateMode] = useState('today'); // today, history
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // Modals
  const [assignDeliveryModal, setAssignDeliveryModal] = useState({ isOpen: false, orderId: null });
  const [cancelModal, setCancelModal] = useState({ isOpen: false, orderId: null });
  const [invoiceModal, setInvoiceModal] = useState({ isOpen: false, orderId: null });
  const [isMutating, setIsMutating] = useState(false);

  const getStatusEnum = (tab) => {
    switch (tab) {
      case 'Pending': return 1;
      case 'Preparing': return 2;
      case 'OnWay': return 3;
      case 'Cancelled': return 5;
      default: return null;
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const statusParam = getStatusEnum(activeTab);
      let response;
      if (dateMode === 'today') {
        response = await ordersApi.getTodayOrders({ pageIndex, pageSize, status: statusParam });
      } else {
        response = await ordersApi.getHistoricalOrders({ date: selectedDate, pageIndex, pageSize, status: statusParam });
      }
      
      const paginationObj = response.data?.data || response.data;
      setOrders(Array.isArray(paginationObj?.data) ? paginationObj.data : Array.isArray(paginationObj) ? paginationObj : []);
      setTotalCount(paginationObj?.count || 0);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [pageIndex, activeTab, dateMode, selectedDate]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPageIndex(1);
  };

  const handleDateModeChange = (mode) => {
    setDateMode(mode);
    setPageIndex(1);
  };

  const handlePrepare = async (orderId) => {
    if (!window.confirm('Mark this order as Preparing?')) return;
    setIsMutating(true);
    try {
      await ordersApi.moveOrderToPrepare(orderId);
      fetchOrders();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to prepare order.');
    } finally {
      setIsMutating(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you absolutely sure you want to DELETE this order? This action cannot be undone and will erase the order from the database.')) return;
    setIsMutating(true);
    try {
      await adminApi.deleteOrder(orderId);
      fetchOrders();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete order.');
    } finally {
      setIsMutating(false);
    }
  };

  const tabs = ['All', 'Pending', 'Preparing', 'OnWay', 'Cancelled'];
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="p-8 max-w-5xl mx-auto animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-brand-black flex items-center gap-3 tracking-tight">
            <div className="p-2.5 bg-brand-black text-white rounded-xl shadow-md">
              <ClipboardList size={24} />
            </div>
            Orders
          </h1>
          <p className="text-neutral-500 mt-2 font-medium">Manage and track customer orders.</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-neutral-200">
          <button 
            onClick={() => handleDateModeChange('today')}
            className={`px-6 py-2 rounded-xl font-bold transition-all ${dateMode === 'today' ? 'bg-primary text-white shadow-md' : 'text-neutral-500 hover:bg-neutral-100'}`}
          >
            Today's Orders
          </button>
          <div className="w-px h-8 bg-neutral-200 mx-1"></div>
          <div className="flex items-center relative">
            <button 
              onClick={() => handleDateModeChange('history')}
              className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all ${dateMode === 'history' ? 'bg-brand-black text-white shadow-md' : 'text-neutral-500 hover:bg-neutral-100'}`}
            >
              <Calendar size={18} />
              History
            </button>
            {dateMode === 'history' && (
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="ml-3 px-3 py-2 bg-neutral-100 border-none rounded-lg text-sm font-bold text-brand-black focus:ring-2 focus:ring-brand-black"
              />
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-neutral-200/50 p-1 rounded-2xl mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`px-6 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
              activeTab === tab
                ? 'bg-white text-brand-black shadow-sm'
                : 'text-neutral-500 hover:text-brand-black hover:bg-white/50'
            }`}
          >
            {tab === 'OnWay' ? 'On Way' : tab}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-6 relative">
        {isMutating && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-2xl">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        )}
        
        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
          </div>
        ) : orders.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-2xl border border-neutral-200">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-400">
              <ClipboardList size={32} />
            </div>
            <p className="text-neutral-500 font-bold text-lg">No orders found.</p>
            <p className="text-neutral-400 text-sm mt-1">Try changing the filters or date.</p>
          </div>
        ) : (
          orders.map((order) => (
            <OrderCard 
              key={order.id} 
              order={order} 
              onPrepare={() => handlePrepare(order.id)}
              onOnWay={() => setAssignDeliveryModal({ isOpen: true, orderId: order.id })}
              onCancel={() => setCancelModal({ isOpen: true, orderId: order.id })}
              onOpenInvoice={(id) => setInvoiceModal({ isOpen: true, orderId: id })}
              disableActions={dateMode === 'history'}
              onDelete={handleDeleteOrder}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between">
          <span className="text-sm text-neutral-500 font-bold">
            Showing {(pageIndex - 1) * pageSize + 1} to {Math.min(pageIndex * pageSize, totalCount)} of {totalCount}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPageIndex(p => Math.max(1, p - 1))}
              disabled={pageIndex === 1}
              className="p-2 rounded-xl bg-white border border-neutral-200 hover:bg-neutral-100 disabled:opacity-50 text-brand-black shadow-sm"
            >
              <ChevronLeft size={20} strokeWidth={3} />
            </button>
            <span className="text-sm font-black px-4 text-brand-black">
              {pageIndex} / {totalPages}
            </span>
            <button
              onClick={() => setPageIndex(p => Math.min(totalPages, p + 1))}
              disabled={pageIndex === totalPages}
              className="p-2 rounded-xl bg-white border border-neutral-200 hover:bg-neutral-100 disabled:opacity-50 text-brand-black shadow-sm"
            >
              <ChevronRight size={20} strokeWidth={3} />
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <AssignDeliveryModal 
        isOpen={assignDeliveryModal.isOpen} 
        onClose={() => setAssignDeliveryModal({ isOpen: false, orderId: null })}
        onSuccess={fetchOrders}
        orderId={assignDeliveryModal.orderId}
      />
      <CancelOrderModal 
        isOpen={cancelModal.isOpen} 
        onClose={() => setCancelModal({ isOpen: false, orderId: null })}
        onSuccess={fetchOrders}
        orderId={cancelModal.orderId}
      />
      <InvoiceModal 
        isOpen={invoiceModal.isOpen}
        onClose={() => setInvoiceModal({ isOpen: false, orderId: null })}
        orderId={invoiceModal.orderId}
      />
    </div>
  );
};
