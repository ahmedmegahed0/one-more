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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80  sm:p-4">
      <div className="bg-brand-lightBg w-full sm:max-w-lg max-h-[90dvh] flex flex-col rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
        
        {/* Close Button Floating */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center  transition-colors"
        >
          <X size={20} strokeWidth={3} />
        </button>

        {/* Product Image */}
        <div className="w-full h-48 sm:h-64 bg-white relative shrink-0 overflow-hidden">
          <img 
            src={product.image || logoImg} 
            alt={product.name} 
            decoding="async"
            width={500}
            height={256}
            className={`w-full h-full transition-transform duration-500 hover:scale-105 ${!product.image ? 'object-contain p-8' : 'object-cover'}`}
            onError={(e) => { 
              e.target.onerror = null; 
              e.target.src = logoImg;
              e.target.className = "w-full h-full object-contain p-8 transition-transform duration-500 hover:scale-105";
            }}
          />
          {product.image && <div className="absolute inset-0 bg-gradient-to-t from-brand-lightBg via-black/20 to-transparent"></div>}
        </div>

        <div className="p-5 sm:p-6 flex-grow overflow-y-auto relative z-10 -mt-6 bg-brand-lightBg rounded-t-3xl">
          {/* Title & Desc */}
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-black text-brand-black tracking-tight leading-tight mb-2">{product.name}</h2>
            {product.description && (
              <p className="text-neutral-500 font-medium leading-relaxed">{product.description}</p>
            )}
          </div>

          {/* Variants Selection */}
          <div className="mb-6">
            <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest mb-3">Choose Size / Variant</h3>
            <div className="space-y-3">
              {product.variants?.filter(v => v.isAvailable).map((variant) => (
                <div 
                  key={variant.id} 
                  onClick={() => setSelectedVariant(variant)}
                  className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                    selectedVariant?.id === variant.id 
                      ? 'border-primary bg-primary/5 shadow-sm scale-[1.01]' 
                      : 'border-transparent bg-white shadow-sm hover:border-primary/30 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      selectedVariant?.id === variant.id ? 'border-primary' : 'border-neutral-300'
                    }`}>
                      {selectedVariant?.id === variant.id && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                    </div>
                    <span className="font-bold text-brand-black text-lg">{variant.name}</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-black text-brand-black text-lg">{variant.price.toFixed(2)}</span>
                    <span className="text-xs font-bold text-neutral-500">EGP</span>
                  </div>
                </div>
              ))}
              {product.variants?.filter(v => v.isAvailable).length === 0 && (
                <div className="text-sm text-semantic-danger font-bold p-4 bg-semantic-danger/10 rounded-2xl flex items-center gap-2">
                  No available options currently.
                </div>
              )}
            </div>
          </div>

          {/* Special Instructions */}
          <div className="mb-2">
            <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest mb-3">Special Instructions</h3>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="e.g. No pickles, extra sauce..."
              rows={2}
              className="w-full px-4 py-3 bg-white border-2 border-transparent rounded-2xl focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-brand-black font-medium shadow-sm resize-none placeholder:text-neutral-400"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 sm:p-6 pb-[calc(1.25rem+env(safe-area-inset-bottom))] bg-white shrink-0 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] rounded-t-3xl relative z-20">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between mb-5">
            
            <div className="flex items-center justify-between sm:justify-start gap-6 bg-neutral-100 rounded-2xl p-1.5 border border-neutral-200/60">
              <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-11 h-11 rounded-xl bg-white shadow-sm flex items-center justify-center text-brand-black hover:bg-neutral-50 hover:text-primary transition-colors active:scale-95"
              >
                <Minus size={20} strokeWidth={2.5} />
              </button>
              <span className="font-black text-xl w-6 text-center select-none">{quantity}</span>
              <button 
                onClick={() => setQuantity(q => q + 1)}
                className="w-11 h-11 rounded-xl bg-white shadow-sm flex items-center justify-center text-brand-black hover:bg-neutral-50 hover:text-primary transition-colors active:scale-95"
              >
                <Plus size={20} strokeWidth={2.5} />
              </button>
            </div>

            <div className="flex items-center justify-between sm:flex-col sm:items-end sm:justify-center">
              <div className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-0.5">Total Price</div>
              <div className="flex items-baseline gap-1 text-primary">
                <span className="text-3xl font-black leading-none">{totalPrice.toFixed(2)}</span>
                <span className="text-sm font-bold">EGP</span>
              </div>
            </div>
            
          </div>

          <button
            onClick={handleAdd}
            disabled={!selectedVariant}
            className="w-full py-4 rounded-2xl font-black text-white bg-primary hover:bg-primary/90 transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_8px_20px_-6px_rgba(255,106,0,0.5)] hover:shadow-[0_8px_25px_-4px_rgba(255,106,0,0.6)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
          >
            <ShoppingCart size={22} strokeWidth={2.5} />
            <span className="text-lg tracking-wide">ADD TO CART</span>
          </button>
        </div>
      </div>
    </div>
  );
};
