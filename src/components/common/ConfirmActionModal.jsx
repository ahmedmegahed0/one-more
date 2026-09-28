import React from 'react';
import { HelpCircle, X, Loader2 } from 'lucide-react';

export const ConfirmActionModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel',
  isProcessing = false,
  icon: Icon = HelpCircle,
  colorClass = 'text-primary',
  bgClass = 'bg-primary',
  hoverClass = 'hover:bg-primary-dark'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-brand-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8">
          <div style={{ backgroundColor: `color-mix(in srgb, currentColor 10%, transparent)` }} className={`mx-auto mb-6 flex items-center justify-center w-20 h-20 rounded-full ${colorClass.replace('text-', 'bg-').replace('text-brand-black', 'bg-neutral-100')} bg-opacity-10`}>
            <div className={`flex items-center justify-center w-full h-full rounded-full ${colorClass.replace('text-', 'bg-')}/10`}>
                <Icon size={40} className={colorClass} strokeWidth={2.5} />
            </div>
          </div>
          
          <h2 className="text-2xl font-black text-brand-black text-center mb-4 tracking-tight">{title}</h2>
          
          <p className="text-neutral-500 font-medium text-center text-lg leading-relaxed mb-8">
            {message}
          </p>

          <div className="flex flex-col-reverse sm:flex-row gap-3">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="w-full sm:w-1/2 py-3.5 rounded-xl font-bold text-brand-black bg-neutral-100 hover:bg-neutral-200 transition-colors disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={isProcessing}
              className={`w-full sm:w-1/2 py-3.5 rounded-xl font-black text-white ${bgClass} ${hoverClass} transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50`}
            >
              {isProcessing ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Processing...
                </>
              ) : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
