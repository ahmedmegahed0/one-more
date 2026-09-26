import React, { useState, useEffect } from 'react';
import { X, Minus, Plus, ShoppingCart } from 'lucide-react';
import logoImg from '../../assets/logo.jpeg';

export const ProductDetailsModal = ({ isOpen, onClose, product, onAddToCart }) => {
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (isOpen && product) {
      // Auto-select first available variant
      const available = product.variants?.filter(v => v.isAvailable) || [];
      setSelectedVariant(available.length > 0 ? available[0] : null);
      setQuantity(1);
      setComment('');
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const handleAdd = () => {
    if (!selectedVariant) return;
    
    onAddToCart({
      product,
      variant: selectedVariant,
      quantity,
      comment
    });
    onClose();
  };

  const totalPrice = selectedVariant ? (selectedVariant.price * quantity) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm sm:p-4">
      <div className="bg-brand-lightBg w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
        
        {/* Close Button Floating */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-colors"
        >
          <X size={20} strokeWidth={3} />
        </button>

        {/* Product Image */}
        <div className="w-full aspect-[4/3] bg-neutral-200 relative">
          <img 
            src={product.image || logoImg} 
            alt={product.name} 
            className="w-full h-full object-cover"
            onError={(e) => { e.target.onerror = null; e.target.src = logoImg; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {/* Title & Desc */}
          <div className="mb-6">
            <h2 className="text-2xl font-black text-brand-black tracking-tight leading-tight mb-2">{product.name}</h2>
            {product.description && (
              <p className="text-neutral-500 font-medium leading-relaxed">{product.description}</p>
            )}
          </div>

          {/* Variants Selection */}
          <div className="mb-6">
            <h3 className="text-sm font-black text-brand-black uppercase tracking-wider mb-3">Choose Size / Variant</h3>
            <div className="space-y-3">
              {product.variants?.filter(v => v.isAvailable).map((variant) => (
                <label 
                  key={variant.id} 
                  className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedVariant?.id === variant.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-neutral-200 bg-white hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedVariant?.id === variant.id ? 'border-primary' : 'border-neutral-300'
                    }`}>
                      {selectedVariant?.id === variant.id && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                    </div>
                    <span className="font-bold text-brand-black">{variant.name}</span>
                  </div>
                  <span className="font-black text-brand-black">{variant.price.toFixed(2)} <span className="text-xs text-neutral-500">EGP</span></span>
                </label>
              ))}
              {product.variants?.filter(v => v.isAvailable).length === 0 && (
                <div className="text-sm text-semantic-danger font-bold p-3 bg-semantic-danger/10 rounded-lg">No available options currently.</div>
              )}
            </div>
          </div>

          {/* Special Instructions */}
          <div className="mb-6">
            <h3 className="text-sm font-black text-brand-black uppercase tracking-wider mb-3">Special Instructions</h3>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="e.g. No pickles, extra sauce..."
              rows={2}
              className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-brand-black font-medium shadow-sm resize-none"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-neutral-200 bg-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4 bg-neutral-100 rounded-xl p-1 border border-neutral-200">
              <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-brand-black hover:bg-neutral-50 transition-colors"
              >
                <Minus size={20} />
              </button>
              <span className="font-black text-lg w-4 text-center select-none">{quantity}</span>
              <button 
                onClick={() => setQuantity(q => q + 1)}
                className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-brand-black hover:bg-neutral-50 transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Total Price</div>
              <div className="text-2xl font-black text-primary leading-none">
                {totalPrice.toFixed(2)} <span className="text-sm">EGP</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleAdd}
            disabled={!selectedVariant}
            className="w-full py-4 rounded-xl font-black text-white bg-primary hover:bg-primary-dark transition-all flex items-center justify-center gap-2 shadow-[0_4px_14px_0_rgba(255,106,0,0.39)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={20} />
            ADD TO CART
          </button>
        </div>
      </div>
    </div>
  );
};
