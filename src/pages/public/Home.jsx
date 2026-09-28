import React, { useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Utensils, Clock, ThumbsUp } from 'lucide-react';
import { categoriesApi } from '../../api/categories.api';
import { productsApi } from '../../api/products.api';
import { CategoryCard } from '../../components/customer/CategoryCard';
import { ProductCard } from '../../components/customer/ProductCard';
import { SkeletonCard, SkeletonCategory } from '../../components/common/SkeletonLoader';
import { ProductDetailsModal } from '../../components/customer/ProductDetailsModal';
import { useCart } from '../../context/CartContext';
import logoImg from '../../assets/logo.jpeg';

export const Home = () => {
  const { settings } = useOutletContext();
  const { addToCart } = useCart();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [loadingProds, setLoadingProds] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchHomeData = async () => {
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

    fetchHomeData();
  }, []);

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative bg-[#0a0a0a] overflow-hidden py-24 sm:py-32 flex items-center min-h-[600px] lg:min-h-[700px]">
        {/* Dynamic Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-[#ff8c3a]/20 blur-[100px] rounded-full"></div>
        
        {/* Subtle grid pattern for texture */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50"></div>
        
        {/* Mobile Background Image */}
        <div className="absolute inset-0 lg:hidden z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-[#0a0a0a]/90 z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop" 
            alt="Mobile Background" 
            className="w-full h-full object-cover opacity-40 scale-105"
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="max-w-2xl animate-in fade-in slide-in-from-left-10 duration-700">
              {settings?.restaurantOpen ? (
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-semantic-success/10 text-semantic-success font-bold text-sm mb-6 border border-semantic-success/20 backdrop-blur-md shadow-[0_0_15px_rgba(34,197,94,0.15)]">
                  <span className="w-2 h-2 rounded-full bg-semantic-success animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
                  Open Now
                </span>
              ) : settings && (
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-semantic-danger/10 text-semantic-danger font-bold text-sm mb-6 border border-semantic-danger/20 backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-semantic-danger"></span>
                  Currently Closed
                </span>
              )}
              
              <h1 className="text-6xl sm:text-7xl lg:text-[5.5rem] font-black text-white leading-[1.05] mb-6 tracking-tighter">
                One Bite, <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#ff8c3a] to-[#ffb873] filter drop-shadow-sm">
                  One More.
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-neutral-300 mb-10 font-medium max-w-lg leading-relaxed">
                Experience the boldest flavors in town. Crafted with premium ingredients and a passion for perfection that keeps you coming back.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-5">
                <Link 
                  to="/menu"
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-[#ff8c3a] text-white font-black tracking-wide text-lg transition-all duration-300 shadow-[0_8px_25px_rgba(255,106,0,0.35)] hover:shadow-[0_12px_35px_rgba(255,106,0,0.5)] hover:-translate-y-1 flex items-center justify-center gap-3 group border border-primary/50 relative overflow-hidden"
                >
                  {/* Button shine effect */}
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></div>
                  <span className="relative">ORDER NOW</span>
                  <ArrowRight size={22} className="relative group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Right Content / Image showcase */}
            <div className="relative hidden lg:block animate-in fade-in zoom-in-95 slide-in-from-right-10 duration-1000 delay-200">
              {/* Decorative elements behind image */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-brand-black via-primary/10 to-brand-black rounded-full blur-3xl -z-10 animate-[pulse_6s_ease-in-out_infinite]"></div>
              
              {/* Main showcase image - using a modern, appetizing framing */}
              <div className="relative z-10 w-full aspect-square rounded-[3rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-neutral-800/50 rotate-3 hover:rotate-0 transition-all duration-500 group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
                <img 
                  src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop" 
                  alt="Delicious premium burger" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute bottom-8 left-8 z-20 bg-brand-black/80 backdrop-blur-md border border-neutral-700 px-6 py-3 rounded-2xl shadow-xl transform group-hover:-translate-y-2 transition-transform duration-500">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs shadow-md border-2 border-brand-black">100%</div>
                    </div>
                    <div className="text-white">
                      <p className="text-sm font-bold leading-tight">Fresh Quality</p>
                      <p className="text-xs text-neutral-400">Premium Beef</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating accent elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#ff8c3a] rounded-full blur-[40px] opacity-60"></div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary rounded-full blur-[50px] opacity-40"></div>
            </div>

          </div>
        </div>
      </section>



      {/* Our Menu Section */}
      <section id="menu-section" className="py-24 bg-brand-lightBg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-4xl sm:text-5xl font-black text-brand-black mb-4 tracking-tight">Our Menu</h2>
            <p className="text-neutral-500 font-medium text-lg">Explore our full selection of delicious items, freshly prepared just for you.</p>
          </div>

          {/* Main Content Area */}
          {selectedCategory === null ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {categories.slice(0, 4).map(cat => (
                <div 
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl border border-neutral-100 transition-all cursor-pointer group flex flex-col items-center text-center hover:-translate-y-2 h-full"
                >
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-neutral-50 mb-4 overflow-hidden border-4 border-white shadow-md group-hover:border-primary/20 transition-all shrink-0 flex items-center justify-center">
                    <img 
                      src={cat.imageUrl || cat.image || logoImg}
                      alt={cat.name}
                      className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${!(cat.imageUrl || cat.image) ? 'opacity-80 p-2' : ''}`}
                      onError={(e) => { e.target.src = logoImg; e.target.onerror = null; }}
                    />
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-brand-black group-hover:text-primary transition-colors line-clamp-2 mt-auto">
                    {cat.name}
                  </h3>
                </div>
              ))}
              
              {categories.length > 4 && (
                <Link 
                  to="/menu"
                  className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl border border-neutral-100 transition-all cursor-pointer group flex flex-col items-center justify-center text-center hover:-translate-y-2 h-full"
                >
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-primary/10 text-primary mb-4 flex items-center justify-center border-4 border-white shadow-md group-hover:bg-primary group-hover:text-white transition-all shrink-0">
                    <ArrowRight size={40} className="group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-brand-black group-hover:text-primary transition-colors mt-auto">
                    View All
                  </h3>
                </Link>
              )}
              
              {categories.length === 0 && (
                <div className="col-span-full text-center py-12 text-neutral-500 font-medium">
                  No categories available.
                </div>
              )}
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-neutral-100">
                <button 
                  onClick={() => setSelectedCategory(null)} 
                  className="flex items-center gap-2 text-neutral-500 hover:text-brand-black font-bold transition-colors w-fit bg-neutral-50 hover:bg-neutral-100 px-4 py-2 rounded-xl"
                >
                  <ArrowLeft size={20} /> Back to Categories
                </button>
                <h2 className="text-2xl font-black text-brand-black">
                  {categories.find(c => c.id === selectedCategory)?.name || 'Category'}
                </h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {loadingProds ? (
                  Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                ) : products.filter(p => p.categoryId === selectedCategory).length > 0 ? (
                  products
                    .filter(prod => prod.categoryId === selectedCategory)
                    .map(prod => <ProductCard key={prod.id} product={prod} onAddClick={setSelectedProduct} />)
                ) : (
                  <div className="col-span-full text-center py-16 text-neutral-500 font-medium bg-white rounded-3xl border border-neutral-100 shadow-sm flex flex-col items-center">
                    <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mb-4 text-neutral-300">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                    </div>
                    <p className="text-lg text-brand-black font-bold mb-1">No items found</p>
                    <p className="text-sm">There are no products in this category yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Brand Story Highlights */}
      <section className="py-24 bg-brand-black text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-2xl bg-primary text-white flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
                <Utensils size={40} />
              </div>
              <h3 className="text-2xl font-black mb-3">Premium Ingredients</h3>
              <p className="text-neutral-400 font-medium leading-relaxed">We source only the freshest, highest quality ingredients for every single bite.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-2xl bg-primary text-white flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
                <Clock size={40} />
              </div>
              <h3 className="text-2xl font-black mb-3">Fast Preparation</h3>
              <p className="text-neutral-400 font-medium leading-relaxed">Hot and fresh, prepared precisely when you order it so it's perfect every time.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-2xl bg-primary text-white flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
                <ThumbsUp size={40} />
              </div>
              <h3 className="text-2xl font-black mb-3">Unmatched Quality</h3>
              <p className="text-neutral-400 font-medium leading-relaxed">Our commitment to excellence means you'll always want ONE MORE.</p>
            </div>
          </div>
        </div>
      </section>

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
