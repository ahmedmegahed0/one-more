import React, { useState, useEffect } from 'react';
import { X, Loader2, Tag } from 'lucide-react';
import { couponsApi } from '../../api/coupons.api';

export const CreateCouponModal = ({ isOpen, onClose, onSuccess }) => {
  const [code, setCode] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setCode('');
      setDiscountPercentage('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const parsedDiscount = parseFloat(discountPercentage);
    if (isNaN(parsedDiscount) || parsedDiscount < 0.1 || parsedDiscount > 100) {
      setError('Discount percentage must be between 0.1 and 100.');
      setLoading(false);
      return;
    }

    try {
      await couponsApi.createCoupon({
        code: code.trim(),
        discountPercentage: parsedDiscount
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create coupon');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (e) => {
    setCode(e.target.value.toUpperCase().replace(/\s/g, ''));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70  p-4">
      <div className="bg-brand-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-neutral-100">
        <div className="flex items-center justify-between p-6 border-b border-neutral-100 bg-neutral-50/50">
          <h2 className="text-xl font-black text-brand-black tracking-tight flex items-center gap-2">
            <Tag size={20} className="text-primary" />
            Create Coupon
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
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-brand-black mb-2 uppercase tracking-wide">Coupon Code</label>
              <input
                type="text"
                required
                maxLength={20}
                value={code}
                onChange={handleCodeChange}
                className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-brand-black font-black placeholder:text-neutral-300 shadow-sm uppercase tracking-widest"
                placeholder="e.g. SUMMER20"
              />
              <p className="text-xs text-neutral-400 mt-1.5 font-medium">Use alphanumeric characters only. Auto-uppercased.</p>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-brand-black mb-2 uppercase tracking-wide">Discount Percentage (%)</label>
              <input
                type="number"
                required
                min="0.1"
                max="100"
                step="0.5"
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-brand-black font-medium placeholder:text-neutral-300 shadow-sm"
                placeholder="e.g. 10.5"
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
                  Creating...
                </>
              ) : 'Create Coupon'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
