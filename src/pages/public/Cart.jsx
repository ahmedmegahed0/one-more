import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { deliveryAreasApi } from '../../api/deliveryAreas.api';
import { ordersApi } from '../../api/orders.api';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Loader2, CheckCircle } from 'lucide-react';

export const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [areas, setAreas] = useState([]);
  const [loadingAreas, setLoadingAreas] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhoneNumber: '',
    deliveryAreaId: '',
    address: '',
    comment: '',
    couponCode: ''
  });

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const res = await deliveryAreasApi.getDeliveryAreas(1, 100);
        const data = res.data?.data?.data || res.data?.data || [];
        setAreas(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load delivery areas", err);
      } finally {
        setLoadingAreas(false);
      }
    };
    fetchAreas();
  }, []);

  const selectedArea = areas.find(a => a.id.toString() === formData.deliveryAreaId);
  const deliveryFee = selectedArea ? selectedArea.deliveryFee : 0;
  const finalTotal = cartTotal + deliveryFee;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    
    if (!formData.customerName || !formData.customerPhoneNumber || !formData.deliveryAreaId || !formData.address) {
      setError('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    setError('');

    const payload = {
      customerName: formData.customerName,
      customerPhoneNumber: formData.customerPhoneNumber,
      deliveryAreaId: parseInt(formData.deliveryAreaId),
      address: formData.address,
      comment: formData.comment || undefined,
      couponCode: formData.couponCode ? formData.couponCode.trim() : null,
      items: cartItems.map(item => ({
        productVariantId: item.productVariantId,
        quantity: item.quantity,
        comment: item.comment || undefined
      }))
    };

    try {
      await ordersApi.createOrder(payload);
      clearCart();
      setShowSuccess(true);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (cartItems.length === 0 && !showSuccess) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mb-6 text-neutral-300">
          <ShoppingBag size={48} />
        </div>
        <h2 className="text-3xl font-black text-brand-black mb-3 tracking-tight">Your cart is empty</h2>
        <p className="text-neutral-500 font-medium mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link 
          to="/menu"
          className="px-8 py-4 rounded-xl bg-primary hover:bg-primary-dark text-white font-black tracking-wide transition-all shadow-[0_4px_20px_rgba(255,106,0,0.4)] hover:-translate-y-1"
        >
          EXPLORE MENU
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 animate-in fade-in duration-500">
      <h1 className="text-4xl font-black text-brand-black mb-8 tracking-tight">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Cart Items Section */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-neutral-100">
            <h2 className="text-xl font-black text-brand-black mb-6">Order Summary</h2>
            <div className="space-y-6 divide-y divide-neutral-100">
              {cartItems.map((item, idx) => (
                <div key={idx} className="pt-6 first:pt-0 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                  <div className="flex-grow">
                    <h3 className="font-bold text-brand-black text-lg">{item.productName}</h3>
                    <p className="text-sm font-bold text-neutral-400 mb-1">Variant: {item.variantName}</p>
                    {item.comment && (
                      <p className="text-xs font-medium text-neutral-500 italic bg-neutral-50 inline-block px-2 py-1 rounded-md">Note: {item.comment}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto mt-4 sm:mt-0">
                    <div className="flex items-center gap-3 bg-neutral-100 rounded-xl p-1 border border-neutral-200">
                      <button 
                        onClick={() => updateQuantity(item.productVariantId, Math.max(1, item.quantity - 1), item.comment)}
                        className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-brand-black hover:bg-neutral-50 transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="font-black text-sm w-4 text-center select-none">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.productVariantId, item.quantity + 1, item.comment)}
                        className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-brand-black hover:bg-neutral-50 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    
                    <div className="text-right min-w-[80px]">
                      <div className="font-black text-lg text-primary">{item.lineTotal.toFixed(2)}</div>
                    </div>
                    
                    <button 
                      onClick={() => removeFromCart(item.productVariantId, item.comment)}
                      className="p-2 text-neutral-400 hover:text-semantic-danger hover:bg-semantic-danger/10 rounded-xl transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Checkout Form Section */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-neutral-100 sticky top-24">
            <h2 className="text-xl font-black text-brand-black mb-6">Delivery Details</h2>
            
            {error && (
              <div className="mb-6 p-4 bg-semantic-danger/10 text-semantic-danger rounded-xl font-bold text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handlePlaceOrder} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-neutral-600 mb-2">Full Name *</label>
                <input 
                  type="text" 
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-medium"
                  placeholder="John Doe"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-neutral-600 mb-2">Phone Number *</label>
                <input 
                  type="tel" 
                  name="customerPhoneNumber"
                  value={formData.customerPhoneNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-medium"
                  placeholder="01xxxxxxxxx"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-neutral-600 mb-2">Delivery Area *</label>
                <select 
                  name="deliveryAreaId"
                  value={formData.deliveryAreaId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-medium"
                  required
                  disabled={loadingAreas}
                >
                  <option value="">Select an area...</option>
                  {areas.map(area => (
                    <option key={area.id} value={area.id}>
                      {area.cityName} (+{(area.deliveryFee || 0).toFixed(2)} EGP)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-neutral-600 mb-2">Full Address *</label>
                <textarea 
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-medium resize-none"
                  placeholder="Street, Building, Floor, Apartment"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-neutral-600 mb-2">Coupon Code (Optional)</label>
                <input 
                  type="text" 
                  name="couponCode"
                  value={formData.couponCode}
                  onChange={(e) => setFormData({ ...formData, couponCode: e.target.value.toUpperCase().replace(/\s/g, '') })}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-medium uppercase tracking-widest placeholder:normal-case placeholder:tracking-normal"
                  placeholder="Enter code here"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-neutral-600 mb-2">Order Notes (Optional)</label>
                <textarea 
                  name="comment"
                  value={formData.comment}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-medium resize-none"
                  placeholder="Any special requests for the delivery?"
                />
              </div>

              <div className="pt-6 border-t border-neutral-100 space-y-3">
                <div className="flex justify-between text-neutral-500 font-bold">
                  <span>Subtotal</span>
                  <span>{cartTotal.toFixed(2)} EGP</span>
                </div>
                <div className="flex justify-between text-neutral-500 font-bold">
                  <span>Delivery Fee</span>
                  <span>{deliveryFee.toFixed(2)} EGP</span>
                </div>
                <div className="flex justify-between text-xl font-black text-brand-black pt-3 border-t border-neutral-100">
                  <span>Total</span>
                  <span className="text-primary">{finalTotal.toFixed(2)} EGP</span>
                </div>
              </div>

              <button 
                type="submit"
                disabled={submitting}
                className="w-full py-4 mt-6 rounded-xl font-black text-white bg-primary hover:bg-primary-dark transition-all flex items-center justify-center gap-3 shadow-[0_4px_14px_0_rgba(255,106,0,0.39)] hover:-translate-y-1 hover:shadow-[0_6px_20px_0_rgba(255,106,0,0.5)] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {submitting ? (
                  <Loader2 size={24} className="animate-spin" />
                ) : (
                  <>
                    PLACE ORDER
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-sm w-full animate-in zoom-in-95 duration-300 p-8 text-center relative">
            <div className="w-20 h-20 bg-semantic-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-semantic-success w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-brand-black tracking-tight mb-2">Order Placed!</h3>
            <p className="text-neutral-500 font-medium mb-8">We've received your order and will contact you shortly to confirm.</p>
            <button
              onClick={() => {
                setShowSuccess(false);
                navigate('/');
              }}
              className="w-full py-4 rounded-xl font-black text-white bg-primary hover:bg-primary-dark transition-all shadow-[0_4px_14px_0_rgba(255,106,0,0.39)]"
            >
              BACK TO HOME
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
