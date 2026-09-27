import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Menu, X, Phone } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const Navbar = ({ settings }) => {
  const { cartCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-brand-white/90 backdrop-blur-md border-b border-neutral-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-2">
            {settings?.logo && settings.logo !== 'string' ? (
              <img src={settings.logo.replace(/\[|\]|\(|\)/g, '')} alt="ONE MORE" className="h-10 object-contain" />
            ) : (
              <span className="text-2xl font-black text-brand-black tracking-tight">ONE<span className="text-primary">MORE</span></span>
            )}
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-brand-black hover:text-primary font-bold transition-colors">Home</Link>
            <Link to="/menu" className="text-brand-black hover:text-primary font-bold transition-colors">Menu</Link>
          </nav>

          <div className="hidden md:flex items-center gap-6">
            {settings?.phoneNumber && (
              <a href={`tel:${settings.phoneNumber}`} className="flex items-center gap-2 text-neutral-500 hover:text-brand-black transition-colors">
                <Phone size={18} />
                <span className="font-bold">{settings.phoneNumber}</span>
              </a>
            )}
            
            <Link to="/cart" className="relative p-2 text-brand-black hover:text-primary transition-colors">
              <ShoppingBag size={24} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-primary text-white text-xs font-black rounded-full flex items-center justify-center transform translate-x-1/4 -translate-y-1/4 shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-4">
            <Link to="/cart" className="relative p-2 text-brand-black">
              <ShoppingBag size={24} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-primary text-white text-xs font-black rounded-full flex items-center justify-center transform translate-x-1/4 -translate-y-1/4">
                  {cartCount}
                </span>
              )}
            </Link>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-brand-black">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-brand-white border-t border-neutral-100 absolute w-full left-0 animate-in slide-in-from-top-2 shadow-lg">
          <div className="px-4 py-6 space-y-4">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block font-bold text-xl text-brand-black">Home</Link>
            <Link to="/menu" onClick={() => setIsMobileMenuOpen(false)} className="block font-bold text-xl text-brand-black">Menu</Link>
            


            {settings?.phoneNumber && (
              <a href={`tel:${settings.phoneNumber}`} className="flex items-center gap-3 text-primary font-bold py-2 mt-4 border-t border-neutral-100 pt-4">
                <Phone size={20} /> Call {settings.phoneNumber}
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
