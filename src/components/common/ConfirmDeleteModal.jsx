import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, title, message, isDeleting }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70  p-4">
      <div className="bg-brand-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3 text-semantic-danger">
              <div className="bg-semantic-danger/10 p-2 rounded-full">
                <AlertTriangle size={24} />
              </div>
              <h2 className="text-xl font-bold">{title || 'Confirm Deletion'}</h2>
            </div>
            <button onClick={onClose} className="text-neutral-500 hover:text-brand-black transition-colors">
              <X size={20} />
            </button>
          </div>
          
          <div className="text-neutral-500 text-sm leading-relaxed">
            {message || 'Are you sure you want to delete this? This action cannot be undone.'}
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2 rounded-lg font-medium text-brand-black bg-neutral-100 hover:bg-neutral-200 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="px-4 py-2 rounded-lg font-medium text-white bg-semantic-danger hover:bg-[#B42318] transition-colors flex items-center gap-2 disabled:opacity-50 shadow-sm"
            >
              {isDeleting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Deleting...
                </>
              ) : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
