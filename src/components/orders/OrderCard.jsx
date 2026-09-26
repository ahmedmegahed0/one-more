import { useState } from 'react';
import { OrderStatusBadge } from './OrderStatusBadge';
import { Phone, MapPin, Tag, MessageSquare, PackageOpen, Play, Truck, Ban, MessageCircle, Receipt, CheckCircle2 } from 'lucide-react';
import { ordersApi } from '../../api/orders.api';

export const OrderCard = ({ order, onPrepare, onOnWay, onCancel, disableActions, onOpenInvoice }) => {
  const [waSent, setWaSent] = useState(order.whatsAppSent || false);
  const [waLoading, setWaLoading] = useState(false);

  const handleWaSent = async () => {
    if (waSent) return;
    setWaLoading(true);
    try {
      await ordersApi.markWhatsAppSent(order.id);
      setWaSent(true);
    } catch (err) {
      console.error(err);
    } finally {
      setWaLoading(false);
    }
  };
  const formatDate = (dateString) => {
    if (!dateString) return 'Just now';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true
    });
  };

  return (
    <div className="bg-brand-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-5 border-b border-neutral-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-neutral-50/50">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h3 className="font-black text-xl text-brand-black tracking-tight">#{order.invoiceNumber || order.id}</h3>
            <OrderStatusBadge status={order.status} />
          </div>
          <span className="text-sm font-bold text-neutral-400">
            {formatDate(order.createdAt)}
          </span>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-1">Total</div>
          <div className="text-2xl font-black text-primary leading-none">
            {order.finalAmount?.toFixed(2)} <span className="text-sm">EGP</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3 text-neutral-600">
              <Phone size={18} className="mt-0.5 text-neutral-400 shrink-0" />
              <div className="font-bold">{order.customerPhoneNumber}</div>
            </div>
            <div className="flex items-start gap-3 text-neutral-600">
              <MapPin size={18} className="mt-0.5 text-neutral-400 shrink-0" />
              <div>
                <div className="font-bold">{order.deliveryAreaName || `Area ID: ${order.deliveryAreaId}`}</div>
                <div className="text-sm text-neutral-500 mt-1">{order.address}</div>
              </div>
            </div>
            {order.couponCode && (
              <div className="flex items-start gap-3 text-primary font-bold">
                <Tag size={18} className="mt-0.5 shrink-0" />
                <div>{order.couponCode}</div>
              </div>
            )}
            {order.comment && (
              <div className="flex items-start gap-3 text-neutral-600 p-3 bg-neutral-100 rounded-xl">
                <MessageSquare size={18} className="mt-0.5 text-neutral-400 shrink-0" />
                <div className="text-sm font-medium italic">"{order.comment}"</div>
              </div>
            )}
          </div>
          
          <div>
            <h4 className="font-bold text-brand-black flex items-center gap-2 mb-3">
              <PackageOpen size={18} className="text-neutral-400" /> Order Items
            </h4>
            <ul className="space-y-3 bg-neutral-50 p-4 rounded-xl border border-neutral-100">
              {order.items?.map((item, idx) => (
                <li key={idx} className="flex justify-between text-sm">
                  <div>
                    <span className="font-black text-brand-black">{item.quantity}x</span>{' '}
                    <span className="font-bold text-neutral-600">Variant {item.productVariantId}</span>
                    {item.comment && (
                      <p className="text-xs text-neutral-500 italic mt-1 ml-5">Note: {item.comment}</p>
                    )}
                  </div>
                </li>
              ))}
              {(!order.items || order.items.length === 0) && (
                <li className="text-sm text-neutral-400 italic">Items hidden or not fetched</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-5 border-t border-neutral-100 bg-neutral-50/50 flex flex-wrap justify-end gap-3">
        <div className="flex items-center gap-3 mr-auto flex-wrap">
          {!disableActions && [1, 2].includes(order.status) && (
            <button 
              onClick={() => onCancel(order.id)}
              className="px-4 py-2 rounded-xl font-bold text-semantic-danger border border-semantic-danger/20 hover:bg-semantic-danger hover:text-white transition-all flex items-center gap-2"
            >
              <Ban size={16} /> Cancel
            </button>
          )}
          
          <button 
            onClick={() => onOpenInvoice(order.id)}
            className="px-4 py-2 rounded-xl font-bold text-brand-black bg-white border border-neutral-200 hover:bg-neutral-100 transition-all flex items-center gap-2 shadow-sm"
          >
            <Receipt size={16} /> Invoice
          </button>

          <button 
            onClick={handleWaSent}
            disabled={waSent || waLoading}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 shadow-sm border ${
              waSent 
                ? 'bg-[#25D366]/10 text-[#25D366] border-[#25D366]/20 cursor-default' 
                : 'bg-white text-[#25D366] border-neutral-200 hover:bg-[#25D366]/10 hover:border-[#25D366]/50'
            }`}
          >
            {waSent ? <CheckCircle2 size={16} /> : <MessageCircle size={16} />}
            {waSent ? 'WhatsApp Sent' : waLoading ? 'Sending...' : 'Mark WA Sent'}
          </button>
        </div>

        {!disableActions && [1, 2].includes(order.status) && (
          <div className="flex gap-3">
            {order.status === 1 && (
              <button 
                onClick={() => onPrepare(order.id)}
                className="px-6 py-2 rounded-xl font-bold text-white bg-[#61AFFE] hover:bg-blue-600 transition-all flex items-center gap-2 shadow-sm"
              >
                <Play size={16} className="fill-white" /> Prepare Order
              </button>
            )}
            
            {order.status === 2 && (
              <button 
                onClick={() => onOnWay(order.id)}
                className="px-6 py-2 rounded-xl font-bold text-white bg-primary hover:bg-primary-dark transition-all flex items-center gap-2 shadow-sm"
              >
                <Truck size={16} /> Dispatch (On Way)
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
