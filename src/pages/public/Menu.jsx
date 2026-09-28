import React, { useEffect, useState } from 'react';
import { categoriesApi } from '../../api/categories.api';
import { productsApi } from '../../api/products.api';
import { ProductCard } from '../../components/customer/ProductCard';
import { SkeletonCard } from '../../components/common/SkeletonLoader';
import { ProductDetailsModal } from '../../components/customer/ProductDetailsModal';
import { useCart } from '../../context/CartContext';
import { ArrowLeft } from 'lucide-react';
import logoImg from '../../assets/logo.jpeg';

export const Menu = () => {
  const { addToCart } = useCart();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [loadingProds, setLoadingProds] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const catRes = await categoriesApi.getCategories(1, 100);
        const catData = catRes.data?.data?.data || catRes.data?.data || [];
        setCategories(Array.isArray(catData) ? catData : []);
      } catch (err) {
        console.error("Categories fetch error", err);
      } finally {
        setLoadingCats(false);
      }

      try {
        const prodRes = await productsApi.getProducts(1, 100);
        const prodData = prodRes.data?.data?.data || prodRes.data?.data || [];
        setProducts(Array.isArray(prodData) ? prodData : []);
      } catch (err) {
        console.error("Products fetch error", err);
      } finally {
        setLoadingProds(false);
      }
    };

    fetchMenuData();
  }, []);

  return (
    <div className="flex flex-col w-full min-h-[100dvh] bg-brand-lightBg pt-8 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl sm:text-5xl font-black text-brand-black mb-4 tracking-tight">المنيو الكامل</h1>
          <p className="text-neutral-500 font-medium text-lg">كل حاجة بنعملها هنا، معمولة فريش مخصوص عشانك.</p>
        </div>

        {/* Main Content Area */}
        {selectedCategory === null ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {loadingCats ? (
              <div className="col-span-full flex justify-center py-12">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                {categories.map(cat => (
                  <div 
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl border border-neutral-100 transition-all cursor-pointer group flex flex-col items-center text-center hover:-translate-y-2"
                  >
                    <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-neutral-50 mb-4 overflow-hidden border-4 border-white shadow-md group-hover:border-primary/20 transition-all">
                      <img 
                        src={cat.image || logoImg}
                        alt={cat.name}
                        className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${!cat.image ? 'opacity-80 p-2' : ''}`}
                        onError={(e) => { e.target.src = logoImg; e.target.onerror = null; }}
                      />
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-brand-black group-hover:text-primary transition-colors line-clamp-2">
                      {cat.name}
                    </h3>
                  </div>
                ))}
                {categories.length === 0 && (
                  <div className="col-span-full text-center py-12 text-neutral-500 font-medium">
                    مفيش أصناف متاحة حالياً.
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <div>
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-neutral-100">
              <button 
                onClick={() => setSelectedCategory(null)} 
                className="flex items-center gap-2 text-neutral-500 hover:text-brand-black font-bold transition-colors w-fit bg-neutral-50 hover:bg-neutral-100 px-4 py-2 rounded-xl"
              >
                <ArrowLeft size={20} /> ارجع للتصنيفات
              </button>
              <h2 className="text-2xl font-black text-brand-black">
                {categories.find(c => c.id === selectedCategory)?.name || 'القسم'}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {(() => {
                if (loadingProds) return Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />);
                const filteredProducts = products.filter(p => p.categoryId === selectedCategory);
                if (filteredProducts.length > 0) {
                  return filteredProducts.map(prod => <ProductCard key={prod.id} product={prod} onAddClick={setSelectedProduct} />);
                }
                return (
                  <div className="col-span-full text-center py-16 text-neutral-500 font-medium bg-white rounded-3xl border border-neutral-100 shadow-sm flex flex-col items-center">
                    <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mb-4 text-neutral-300">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                    </div>
                    <p className="text-lg text-brand-black font-bold mb-1">مفيش منتجات</p>
                    <p className="text-sm">القسم ده لسه مفيهوش منتجات.</p>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>

      <ProductDetailsModal 
        isOpen={!!selectedProduct} 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
        onAddToCart={({ product, variant, quantity, comment }) => {
          addToCart({
            productVariantId: variant.id,
            productName: product.name,
            variantName: variant.name,
            quantity: quantity,
            unitPrice: variant.price,
            comment: comment
          });
        }} 
      />
    </div>
  );
};
