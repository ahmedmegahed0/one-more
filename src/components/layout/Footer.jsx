import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, MessageCircle } from 'lucide-react';

export const Footer = ({ settings }) => {
  return (
    <footer className="bg-brand-black text-white pt-16 pb-8 border-t-[6px] border-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <span className="text-3xl font-black tracking-tight mb-4 block">ONE<span className="text-primary">MORE</span></span>
            <p className="text-neutral-400 font-medium italic">"One Bite , One More"</p>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-6 text-white tracking-wide">Quick Links</h4>
            <div className="space-y-3">
              <Link to="/" className="block text-neutral-400 font-medium hover:text-primary transition-colors">Home</Link>
              <Link to="/menu" className="block text-neutral-400 font-medium hover:text-primary transition-colors">Menu</Link>
              <Link to="/cart" className="block text-neutral-400 font-medium hover:text-primary transition-colors">Cart</Link>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-white tracking-wide">Contact Us</h4>
            <div className="space-y-4">
              {settings?.address && (
                <div className="flex items-start gap-3 text-neutral-400 font-medium">
                  <MapPin className="text-primary shrink-0" size={20} />
                  <span>{settings.address}</span>
                </div>
              )}
              {settings?.phoneNumber && (
                <a href={`tel:${settings.phoneNumber}`} className="flex items-center gap-3 text-neutral-400 font-medium hover:text-white transition-colors">
                  <Phone className="text-primary shrink-0" size={20} />
                  <span>{settings.phoneNumber}</span>
                </a>
              )}
              {settings?.whatsAppNumber && (
                <a href={`https://wa.me/${settings.whatsAppNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-neutral-400 font-medium hover:text-white transition-colors">
                  <MessageCircle className="text-primary shrink-0" size={20} />
                  <span>WhatsApp Us</span>
                </a>
              )}
            </div>
          </div>
        </div>
        
        <div className="border-t border-neutral-800 pt-8 text-center text-neutral-500 text-sm font-medium">
          <p>Copyright &copy; {new Date().getFullYear()} ONE MORE. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
