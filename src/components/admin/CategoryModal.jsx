import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { categoriesApi } from '../../api/categories.api';
import logoImg from '../../assets/logo.jpeg';
export const CategoryModal = ({ isOpen, onClose, onSuccess, initialData = null }) => {
  const isEdit = !!initialData;
  const [name, setName] = useState('');
  const [displayOrder, setDisplayOrder] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name || '');
        setDisplayOrder(initialData.displayOrder || '');
        setImagePreview(initialData.image ? initialData.image.replace(/\[|\]|\(|\)/g, '') : null);
      } else {
        setName('');
        setDisplayOrder('');
        setImagePreview(null);
      }
      setImageFile(null);
      setError('');
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('Name', name);
      formData.append('DisplayOrder', displayOrder);
      
      if (isEdit) {
        formData.append('Id', initialData.id);
      }
      
      if (imageFile) {
        formData.append('Image', imageFile);
      }

      if (isEdit) {
        await categoriesApi.updateCategory(initialData.id, formData);
      } else {
        await categoriesApi.createCategory(formData);
      }
      
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70  p-4">
      <div className="bg-brand-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-neutral-100">
        <div className="flex items-center justify-between p-6 border-b border-neutral-100 bg-neutral-50/50">
          <h2 className="text-xl font-black text-brand-black tracking-tight">{isEdit ? 'Edit Category' : 'Add New Category'}</h2>
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
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-brand-black mb-2 uppercase tracking-wide">Category Image</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-44 border-2 border-dashed border-neutral-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all overflow-hidden group relative bg-neutral-50"
              >
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Preview" decoding="async" width={400} height={176} className="w-full h-full object-cover" onError={(e) => { e.target.src = logoImg; e.target.onerror = null; }} />
                    <div className="absolute inset-0 bg-brand-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ">
                      <span className="text-white font-bold flex items-center gap-2 bg-primary/90 px-4 py-2 rounded-full">
                        <Upload size={18} /> Change Image
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <img src={logoImg} alt="Default" decoding="async" width={400} height={176} className="w-full h-full object-cover opacity-20 grayscale" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-brand-black group-hover:text-primary transition-colors">
                      <div className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center mb-3">
                        <Upload size={24} />
                      </div>
                      <span className="text-sm font-bold bg-white/80 px-3 py-1 rounded-full  shadow-sm">Click to upload image</span>
                    </div>
                  </>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageChange} 
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-2">
                <label className="block text-sm font-bold text-brand-black mb-2 uppercase tracking-wide">Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-brand-black font-medium placeholder:text-neutral-400 shadow-sm"
                  placeholder="e.g. Signature Burgers"
                />
              </div>
              
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-bold text-brand-black mb-2 uppercase tracking-wide">Display Order</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-brand-black font-medium placeholder:text-neutral-400 shadow-sm"
                  placeholder="e.g. 1"
                />
              </div>
            </div>
          </div>

          <div className="mt-10 flex justify-end gap-3 pt-6 border-t border-neutral-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-3 rounded-xl font-bold text-neutral-600 bg-white border border-neutral-200 hover:bg-neutral-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 rounded-xl font-bold text-white bg-primary hover:bg-primary-dark transition-all flex items-center gap-2 disabled:opacity-50 shadow-[0_4px_14px_0_rgba(255,106,0,0.39)] hover:shadow-[0_6px_20px_rgba(255,106,0,0.23)]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : isEdit ? 'Save Changes' : 'Create Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
