import React, { useState, useEffect } from 'react';
import { X, Loader2, AlertOctagon } from 'lucide-react';
import { ordersApi } from '../../api/orders.api';

export const CancelOrderModal = ({ isOpen, onClose, onSuccess, order }) => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setReason('');
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('لازم تكتب سبب الإلغاء.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await ordersApi.cancelOrder(order.id, reason.trim());
      
      // WhatsApp message for cancellation
      let phone = order?.customerPhoneNumber || '';
      if (phone.startsWith('01')) {
        phone = '2' + phone;
      }
      
      const separator = '━━━━━━━━━━━━━━';
      const message = `أهلاً بيك في ONE MORE!\n${separator}\nنعتذر لإبلاغك بأنه تم إلغاء طلبك رقم #${order?.invoiceNumber || order?.id}.\n${separator}\n*سبب الإلغاء:*\n${reason.trim()}\n${separator}\nنتمنى خدمتك في أقرب وقت!`;
      
      const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
      window.open(waUrl, '_blank');

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'فشل في إلغاء الطلب.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70  p-4">
      <div className="bg-brand-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-semantic-danger/20">
        <div className="flex items-center justify-between p-6 border-b border-semantic-danger/10 bg-semantic-danger/5">
          <h2 className="text-xl font-black text-semantic-danger tracking-tight flex items-center gap-2">
            <AlertOctagon size={20} />
            إلغاء الطلب
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
              <label className="block text-sm font-bold text-brand-black mb-2 uppercase tracking-wide">سبب الإلغاء <span className="text-semantic-danger">*</span></label>
              <textarea
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-semantic-danger/50 focus:border-semantic-danger transition-all text-brand-black font-medium placeholder:text-neutral-400 shadow-sm resize-none"
                placeholder="مثال: العميل طلب الإلغاء"
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
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading || !reason.trim()}
              className="px-8 py-3 rounded-xl font-bold text-white bg-semantic-danger hover:bg-red-700 transition-all flex items-center gap-2 disabled:opacity-50 shadow-[0_4px_14px_0_rgba(217,45,32,0.39)]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  جاري الإلغاء...
                </>
              ) : 'تأكيد الإلغاء'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
