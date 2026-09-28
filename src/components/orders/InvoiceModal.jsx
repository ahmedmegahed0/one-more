import React, { useState, useEffect } from 'react';
import { X, Loader2, Printer, Receipt } from 'lucide-react';
import { ordersApi } from '../../api/orders.api';

export const InvoiceModal = ({ isOpen, onClose, orderId }) => {
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && orderId) {
      const fetchInvoice = async () => {
        setLoading(true);
        setError('');
        try {
          const res = await ordersApi.getOrderInvoice(orderId);
          setInvoice(res.data?.data || res.data);
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to load invoice');
        } finally {
          setLoading(false);
        }
      };
      fetchInvoice();
    } else {
      setInvoice(null);
    }
  }, [isOpen, orderId]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70  p-4 print:p-0 print:bg-white print:">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-neutral-100 print:shadow-none print:border-none print:rounded-none">
        
        {/* Header - Hidden in Print */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-100 bg-neutral-50/50 print:hidden">
          <h2 className="text-xl font-black text-brand-black tracking-tight flex items-center gap-2">
            <Receipt size={20} className="text-brand-black" />
            Invoice #{orderId}
          </h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-semantic-danger transition-colors bg-white p-1 rounded-lg border border-neutral-200">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-8 print:p-4 font-mono text-brand-black">
          {loading ? (
            <div className="py-20 flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="p-4 bg-semantic-danger/10 text-semantic-danger rounded-xl text-center font-bold">
              {error}
            </div>
          ) : invoice ? (
            <div id="printable-invoice">
              <div className="text-center border-b-2 border-dashed border-neutral-300 pb-6 mb-6">
                <h1 className="text-2xl font-black uppercase tracking-widest">{invoice.restaurantName || 'ONE MORE'}</h1>
                <p className="text-sm text-neutral-500 mt-2 font-bold">INVOICE #{invoice.invoiceNumber}</p>
                <p className="text-sm text-neutral-500 font-bold">
                  {invoice.issuedAt ? new Date(invoice.issuedAt).toLocaleString() : new Date().toLocaleString()}
                </p>
              </div>

              <div className="mb-6 border-b-2 border-dashed border-neutral-300 pb-6">
                <table className="w-full text-sm font-bold">
                  <thead>
                    <tr className="border-b border-neutral-200 text-left">
                      <th className="pb-2">ITEM</th>
                      <th className="pb-2 text-center">QTY</th>
                      <th className="pb-2 text-right">TOTAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items?.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-3 pr-2">{item.productName} <div className="text-xs text-neutral-500">@{item.unitPrice?.toFixed(2)}</div></td>
                        <td className="py-3 text-center">{item.quantity}</td>
                        <td className="py-3 text-right">{(item.lineTotal || (item.quantity * item.unitPrice))?.toFixed(2)}</td>
                      </tr>
                    ))}
                    {(!invoice.items || invoice.items.length === 0) && (
                      <tr><td colSpan={3} className="py-3 text-center italic text-neutral-400">No items</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="space-y-2 text-sm font-bold mb-8">
                <div className="flex justify-between">
                  <span className="text-neutral-500">SUBTOTAL</span>
                  <span>{invoice.subtotal?.toFixed(2)} EGP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">DELIVERY FEE</span>
                  <span>{invoice.deliveryFee?.toFixed(2)} EGP</span>
                </div>
                <div className="flex justify-between text-lg font-black border-t-2 border-brand-black pt-3 mt-3">
                  <span>TOTAL</span>
                  <span>{invoice.total?.toFixed(2)} EGP</span>
                </div>
              </div>

              <div className="text-center text-xs font-bold text-neutral-400 italic">
                Thank you for choosing {invoice.restaurantName || 'ONE MORE'}!
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer - Hidden in Print */}
        {!loading && !error && (
          <div className="p-6 border-t border-neutral-100 bg-neutral-50/50 print:hidden flex justify-end">
            <button
              onClick={handlePrint}
              className="px-6 py-3 rounded-xl font-black text-white bg-brand-black hover:bg-neutral-800 transition-colors flex items-center gap-2 shadow-md w-full sm:w-auto justify-center"
            >
              <Printer size={18} /> Print Invoice
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
