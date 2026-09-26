import React, { useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { ArrowRight, Utensils, Clock, ThumbsUp } from 'lucide-react';
import { categoriesApi } from '../../api/categories.api';
import { productsApi } from '../../api/products.api';
import { CategoryCard } from '../../components/customer/CategoryCard';
import { ProductCard } from '../../components/customer/ProductCard';
import { SkeletonCard, SkeletonCategory } from '../../components/common/SkeletonLoader';

export const Home = () => {
  const { settings } = useOutletContext();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [loadingProds, setLoadingProds] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const catRes = await categoriesApi.getCategories(1, 6);
        const catData = catRes.data?.data?.data || catRes.data?.data || [];
        setCategories(Array.isArray(catData) ? catData : []);
      } catch (err) {
        console.error("Categories fetch error", err);
      } finally {
        setLoadingCats(false);
      }

      try {
        const prodRes = await productsApi.getProducts(1, 6);
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
      <section className="relative bg-brand-black overflow-hidden py-24 sm:py-32 flex items-center min-h-[600px] lg:min-h-[700px]">
        {/* Placeholder for dynamic hero background */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-brand-black via-brand-black/90 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
          <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-10 duration-700">
            {settings?.restaurantOpen ? (
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-semantic-success/20 text-semantic-success font-bold text-sm mb-6 border border-semantic-success/30 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-semantic-success animate-pulse"></span>
                Open Now
              </span>
            ) : settings && (
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-semantic-danger/20 text-semantic-danger font-bold text-sm mb-6 border border-semantic-danger/30 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-semantic-danger"></span>
                Currently Closed
              </span>
            )}
            
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-white leading-[1.1] mb-6 tracking-tighter">
              One Bite, <br/>
              <span className="text-primary text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#ff8c3a]">One More.</span>
            </h1>
            <p className="text-lg sm:text-xl text-neutral-300 mb-10 font-medium max-w-lg leading-relaxed">
              Experience the boldest flavors in town. Crafted with premium ingredients and a passion for perfection.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/menu"
                className="px-8 py-4 rounded-xl bg-primary hover:bg-primary-dark text-white font-black tracking-wide text-lg transition-all shadow-[0_4px_20px_rgba(255,106,0,0.4)] hover:shadow-[0_6px_25px_rgba(255,106,0,0.5)] hover:-translate-y-1 flex items-center justify-center gap-3"
              >
                ORDER NOW
                <ArrowRight size={22} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-24 bg-brand-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-4xl font-black text-brand-black mb-2 tracking-tight">Crave It? We Have It.</h2>
              <p className="text-neutral-500 font-medium text-lg">Explore our most popular categories</p>
            </div>
            <Link to="/menu" className="hidden sm:flex items-center gap-2 text-primary font-bold hover:text-primary-dark transition-colors group">
              Full Menu <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="flex overflow-x-auto pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar gap-8">
            {loadingCats ? (
              Array.from({ length: 6 }).map((_, i) => <SkeletonCategory key={i} />)
            ) : categories.length > 0 ? (
              categories.map(cat => <CategoryCard key={cat.id} category={cat} />)
            ) : (
              <p className="text-neutral-500 font-medium italic">No categories available at the moment.</p>
            )}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-brand-lightBg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-brand-black mb-4 tracking-tight">Featured Favorites</h2>
            <p className="text-neutral-500 font-medium text-lg">Hand-picked selections that keep our customers coming back for ONE MORE.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {loadingProds ? (
              Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            ) : products.length > 0 ? (
              products.map(prod => <ProductCard key={prod.id} product={prod} />)
            ) : (
              <div className="col-span-full text-center py-12 text-neutral-500 font-medium">
                No featured products currently available.
              </div>
            )}
          </div>
          
          <div className="mt-16 text-center">
            <Link 
              to="/menu"
              className="inline-flex items-center justify-center px-10 py-4 rounded-xl border-2 border-brand-black text-brand-black font-black tracking-wide text-lg hover:bg-brand-black hover:text-white transition-colors gap-2"
            >
              EXPLORE FULL MENU
            </Link>
          </div>
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
    </div>
  );
};
