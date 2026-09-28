import React, { useState, useEffect } from 'react';
import { X, Loader2, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import { productsApi } from '../../api/products.api';
import { categoriesApi } from '../../api/categories.api';
import logoImg from '../../assets/logo.jpeg';

export const ProductModal = ({ isOpen, onClose, onSuccess, initialData = null }) => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    categoryId: '',
    name: '',
    description: '',
    displayOrder: 1,
    isAvailable: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  const [variants, setVariants] = useState([{ name: 'Standard', price: 0, displayOrder: 1, isAvailable: true }]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      if (initialData) {
        setFormData({
          categoryId: initialData.categoryId || '',
          name: initialData.name || '',
          description: initialData.description || '',
          displayOrder: initialData.displayOrder || 1,
          isAvailable: initialData.isAvailable !== false,
        });
        setImagePreview(initialData.image || null);
        setImageFile(null);
        setVariants(initialData.variants?.length ? initialData.variants : [{ name: 'Standard', price: 0, displayOrder: 1, isAvailable: true }]);
      } else {
        setFormData({ categoryId: '', name: '', description: '', displayOrder: 1, isAvailable: true });
        setImagePreview(null);
        setImageFile(null);
        setVariants([{ name: 'Standard', price: 0, displayOrder: 1, isAvailable: true }]);
      }
      setError('');
    }
  }, [isOpen, initialData]);

  const fetchCategories = async () => {
    try {
      const res = await categoriesApi.getCategories(1, 100);
      const data = res.data?.data?.data || res.data?.data || [];
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  const addVariant = () => {
    setVariants([...variants, { name: '', price: 0, displayOrder: variants.length + 1, isAvailable: true }]);
  };

  const removeVariant = (index) => {
    const newVariants = variants.filter((_, i) => i !== index);
    setVariants(newVariants);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.categoryId || !formData.name || variants.length === 0) {
      setError('Category, Name, and at least one Variant are required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const submitData = new FormData();
      if (initialData) submitData.append('Id', initialData.id);
      submitData.append('CategoryId', formData.categoryId);
      submitData.append('Name', formData.name);
      if (formData.description) submitData.append('Description', formData.description);
      submitData.append('DisplayOrder', formData.displayOrder);
      submitData.append('IsAvailable', formData.isAvailable);
      
      if (imageFile) {
        submitData.append('Image', imageFile);
      }

      variants.forEach((v, index) => {
        if (v.id) submitData.append(`Variants[${index}].Id`, v.id);
        submitData.append(`Variants[${index}].Name`, v.name);
        submitData.append(`Variants[${index}].Price`, v.price);
        submitData.append(`Variants[${index}].DisplayOrder`, v.displayOrder);
        submitData.append(`Variants[${index}].IsAvailable`, v.isAvailable);
      });

      if (initialData) {
        await productsApi.updateProduct(initialData.id, submitData);
      } else {
        await productsApi.createProduct(submitData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save product.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70  p-4 overflow-y-auto">
      <div className="bg-brand-lightBg rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-neutral-200 my-8">
        <div className="flex items-center justify-between p-6 border-b border-neutral-200 bg-white sticky top-0 z-10">
          <h2 className="text-xl font-black text-brand-black tracking-tight">
            {initialData ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-semantic-danger transition-colors bg-neutral-100 p-1.5 rounded-lg border border-neutral-200">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-5 p-4 rounded-xl bg-semantic-danger/10 text-semantic-danger text-sm font-bold border border-semantic-danger/20 flex items-center">
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-brand-black mb-1.5 uppercase tracking-wide">Category</label>
                <select
                  required
                  value={formData.categoryId}
                  onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-brand-black font-medium shadow-sm"
                >
                  <option value="" disabled>Select Category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-brand-black mb-1.5 uppercase tracking-wide">Name</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-brand-black font-medium shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-brand-black mb-1.5 uppercase tracking-wide">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={2}
                  className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-brand-black font-medium shadow-sm resize-none"
                />
              </div>

              <div className="flex items-center gap-6">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-brand-black mb-1.5 uppercase tracking-wide">Display Order</label>
                  <input
                    required
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({...formData, displayOrder: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-brand-black font-medium shadow-sm"
                  />
                </div>
                <label className="flex items-center gap-2 cursor-pointer mt-6">
                  <input
                    type="checkbox"
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData({...formData, isAvailable: e.target.checked})}
                    className="w-5 h-5 rounded text-primary focus:ring-primary border-neutral-300 bg-white"
                  />
                  <span className="font-bold text-brand-black">Available</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-brand-black mb-1.5 uppercase tracking-wide">Product Image</label>
              <div className="relative group w-full aspect-square md:aspect-auto md:h-full max-h-64 rounded-2xl overflow-hidden border-2 border-dashed border-neutral-300 bg-white hover:border-primary transition-colors cursor-pointer flex flex-col items-center justify-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <img 
                  src={imagePreview || logoImg} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.onerror = null; e.target.src = logoImg; }}
                />
                {!imagePreview && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 ] text-brand-black group-hover:text-primary transition-colors">
                    <ImageIcon size={32} className="mb-2 opacity-80" />
                    <span className="font-bold text-sm drop-shadow-md">Upload Image</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white font-bold tracking-wider">CHANGE IMAGE</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-neutral-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-brand-black uppercase tracking-wide">Variants</h3>
              <button 
                type="button" 
                onClick={addVariant}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-100 text-brand-black font-bold text-sm hover:bg-neutral-200 transition-colors border border-neutral-200"
              >
                <Plus size={16} /> Add Variant
              </button>
            </div>
            
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
              {variants.map((v, idx) => (
                <div key={idx} className="flex flex-wrap sm:flex-nowrap items-end gap-3 bg-white p-3 rounded-xl border border-neutral-200 shadow-sm relative">
                  <div className="flex-1 min-w-[120px] flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wide">Name</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Medium"
                      value={v.name}
                      onChange={(e) => handleVariantChange(idx, 'name', e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-bold"
                    />
                  </div>
                  
                  <div className="w-24 flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wide">Price</label>
                    <input
                      required
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={v.price}
                      onChange={(e) => handleVariantChange(idx, 'price', e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-bold"
                    />
                  </div>

                  <div className="w-20 hidden sm:flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wide">Order</label>
                    <input
                      required
                      type="number"
                      placeholder="1"
                      value={v.displayOrder}
                      onChange={(e) => handleVariantChange(idx, 'displayOrder', e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-bold"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-transparent uppercase tracking-wide hidden sm:block">Status</label>
                    <label className="flex items-center justify-center gap-1.5 cursor-pointer bg-neutral-50 px-2 py-2 rounded-lg border border-neutral-200 h-[38px]">
                      <input
                        type="checkbox"
                        checked={v.isAvailable}
                        onChange={(e) => handleVariantChange(idx, 'isAvailable', e.target.checked)}
                        className="w-4 h-4 rounded text-primary focus:ring-primary border-neutral-300 bg-white"
                      />
                      <span className="text-xs font-bold uppercase">On</span>
                    </label>
                  </div>

                  {variants.length > 1 && (
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-transparent uppercase tracking-wide hidden sm:block">Del</label>
                      <button
                        type="button"
                        onClick={() => removeVariant(idx)}
                        className="p-2 text-neutral-400 hover:text-semantic-danger hover:bg-semantic-danger/10 rounded-lg transition-colors h-[38px] flex items-center justify-center"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-neutral-200 sticky bottom-0 bg-brand-lightBg pb-2">
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
              className="px-8 py-3 rounded-xl font-bold text-white bg-primary hover:bg-primary-dark transition-all flex items-center gap-2 disabled:opacity-50 shadow-[0_4px_14px_0_rgba(255,106,0,0.39)]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
