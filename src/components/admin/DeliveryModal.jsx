import React, { useState, useEffect } from 'react';
import { X, Loader2, Truck } from 'lucide-react';
import { deliveriesApi } from '../../api/deliveries.api';

export const DeliveryModal = ({ isOpen, onClose, onSuccess, initialData = null }) => {
  const isEdit = !!initialData;
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name || '');
        setPhoneNumber(initialData.phoneNumber || '');
      } else {
        setName('');
        setPhoneNumber('');
      }
      setError('');
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (phoneNumber.trim().length < 8) {
      setError('Please enter a valid phone number.');
      setLoading(false);
      return;
    }

    try {
      if (isEdit) {
        await deliveriesApi.updateDelivery(initialData.id, {
          name: name.trim(),
          phoneNumber: phoneNumber.trim()
        });
      } else {
        await deliveriesApi.createDelivery({
          name: name.trim(),
          phoneNumber: phoneNumber.trim()
        });
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save delivery personnel');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70  p-4">
      <div className="bg-brand-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-neutral-100">
        <div className="flex items-center justify-between p-6 border-b border-neutral-100 bg-neutral-50/50">
          <h2 className="text-xl font-black text-brand-black tracking-tight flex items-center gap-2">
            <Truck size={20} className="text-primary" />
            {isEdit ? 'Edit Delivery Person' : 'Add Delivery Person'}
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
              <label className="block text-sm font-bold text-brand-black mb-2 uppercase tracking-wide">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-brand-black font-medium placeholder:text-neutral-400 shadow-sm"
                placeholder="e.g. Alice Courier"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-brand-black mb-2 uppercase tracking-wide">Phone Number</label>
              <input
                type="tel"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-brand-black font-medium placeholder:text-neutral-400 shadow-sm"
                placeholder="e.g. 01033334444"
              />
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
              disabled={loading}
              className="px-8 py-3 rounded-xl font-bold text-white bg-primary hover:bg-primary-dark transition-all flex items-center gap-2 disabled:opacity-50 shadow-[0_4px_14px_0_rgba(255,106,0,0.39)] hover:shadow-[0_6px_20px_rgba(255,106,0,0.23)]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : isEdit ? 'Save Changes' : 'Add Courier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
