import React, { useState, useEffect } from 'react';
import { X, Loader2, Truck } from 'lucide-react';
import { deliveriesApi } from '../../api/deliveries.api';
import { ordersApi } from '../../api/orders.api';

export const AssignDeliveryModal = ({ isOpen, onClose, onSuccess, orderId }) => {
  const [deliveries, setDeliveries] = useState([]);
  const [selectedDeliveryId, setSelectedDeliveryId] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setError('');
      setSelectedDeliveryId('');
      const fetchDeliveries = async () => {
        setFetchLoading(true);
        try {
          const res = await deliveriesApi.getDeliveries(1, 100);
          const data = res.data?.data?.data || res.data?.data || [];
          setDeliveries(Array.isArray(data) ? data : []);
        } catch (err) {
          console.error(err);
          setError('Failed to load couriers.');
        } finally {
          setFetchLoading(false);
        }
      };
      fetchDeliveries();
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDeliveryId) {
      setError('Please select a delivery person.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await ordersApi.moveOrderToPrepare(orderId, selectedDeliveryId);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to assign delivery.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-brand-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-neutral-100">
        <div className="flex items-center justify-between p-6 border-b border-neutral-100 bg-neutral-50/50">
          <h2 className="text-xl font-black text-brand-black tracking-tight flex items-center gap-2">
            <Truck size={20} className="text-[#61AFFE]" />
            Assign Courier & Prepare
          </h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-semantic-danger transition-colors bg-white p-1 rounded-lg border border-neutral-200">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-5 p-4 rounded-xl bg-semantic-danger/10 text-semantic-danger text-sm font-bold border border-semantic-danger/20 flex items-center">
              {error}
            </div>
          )}
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-brand-black mb-2 uppercase tracking-wide">Select Delivery Person</label>
              {fetchLoading ? (
                <div className="flex items-center gap-2 text-neutral-500 font-bold p-3 border border-neutral-200 rounded-xl bg-neutral-50">
                  <Loader2 className="w-5 h-5 animate-spin" /> Loading couriers...
                </div>
              ) : (
                <select
                  value={selectedDeliveryId}
                  onChange={(e) => setSelectedDeliveryId(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#61AFFE]/50 focus:border-[#61AFFE] transition-all text-brand-black font-medium shadow-sm"
                >
                  <option value="" disabled>Select courier...</option>
                  {deliveries.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.phoneNumber})</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="mt-10 flex justify-end gap-3 pt-6 border-t border-neutral-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-3 rounded-xl font-bold text-neutral-600 bg-white border border-neutral-200 hover:bg-neutral-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !selectedDeliveryId}
              className="px-8 py-3 rounded-xl font-bold text-white bg-[#61AFFE] hover:bg-blue-600 transition-all flex items-center gap-2 disabled:opacity-50 shadow-[0_4px_14px_0_rgba(97,175,254,0.39)]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Assigning...
                </>
              ) : 'Confirm & Prepare'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
