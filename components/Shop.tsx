import React, { useState } from 'react';
import { ShoppingBag, Filter, Search, Star, SlidersHorizontal, ArrowUpDown, ChevronDown } from 'lucide-react';
import { useStore, Product } from '../context/StoreContext';
import { Page } from '../App';

interface ShopProps {
  onNavigate?: (page: Page) => void;
  onProductSelect?: (product: Product) => void;
}

const Shop: React.FC<ShopProps> = ({ onNavigate, onProductSelect }) => {
  const { products, addToCart } = useStore();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todo');
  const [sortOrder, setSortOrder] = useState<'default' | 'asc' | 'desc'>('default');
  const [showFilters, setShowFilters] = useState(false);

  // Filter Logic
  const filteredProducts = products.filter(p => 
    (activeCategory === 'Todo' || p.category === activeCategory) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => {
      if (sortOrder === 'asc') return a.price - b.price;
      if (sortOrder === 'desc') return b.price - a.price;
      return 0;
  });

  const categories = ['Todo', 'Verduras', 'Frutas', 'Hierbas'];

  return (
    <div className="bg-white min-h-screen pt-20 relative">
      
      {/* Featured Hero */}
      <div className="relative h-[40vh] min-h-[400px] w-full overflow-hidden mx-auto max-w-[98%] mt-4 rounded-3xl">
        <img 
          src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=2674&auto=format&fit=crop" 
          alt="Mercado de productos frescos" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/90 via-zinc-950/40 to-transparent"></div>
        <div className="absolute inset-0 flex flex-col justify-center px-8 lg:px-24">
          <div className="max-w-xl space-y-6">
            <span className="inline-block px-3 py-1 rounded-full bg-lime-400 text-zinc-900 text-xs font-bold tracking-wider uppercase">
              Nuestra Tienda
            </span>
            <h1 className="text-4xl md:text-6xl font-medium text-white tracking-tight">
              Frescura <br/>Directa a tu Mesa
            </h1>
            <p className="text-lg text-zinc-300">
              Verduras, frutas y hierbas 100% orgánicas. Sin intermediarios, sin químicos, solo sabor real.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 py-12">
        {/* Controls Bar */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-10 gap-6 sticky top-24 z-30 bg-white/90 backdrop-blur-xl p-4 rounded-2xl border border-zinc-100 shadow-sm transition-all">
          
          {/* Mobile Filter Toggle */}
          <div className="flex lg:hidden w-full gap-4">
             <div className="relative flex-grow">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
               <input 
                  type="text" 
                  placeholder="Buscar..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-3 rounded-xl border border-zinc-200 text-sm focus:border-lime-400 outline-none w-full"
               />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="p-3 bg-zinc-900 text-white rounded-xl"
            >
              <SlidersHorizontal size={20} />
            </button>
          </div>

          {/* Desktop Categories */}
          <div className={`flex-col lg:flex-row items-center gap-3 w-full lg:w-auto ${showFilters ? 'flex' : 'hidden lg:flex'}`}>
             <span className="text-sm font-semibold text-zinc-500 mr-2 lg:block hidden">Categorías:</span>
             <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === cat ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'}`}
                  >
                    {cat}
                  </button>
                ))}
             </div>
          </div>

          {/* Search & Sort */}
          <div className={`flex-col lg:flex-row items-center gap-3 w-full lg:w-auto ${showFilters ? 'flex' : 'hidden lg:flex'}`}>
            <div className="relative hidden lg:block">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
               <input 
                  type="text" 
                  placeholder="Buscar productos..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-full border border-zinc-200 text-sm focus:border-lime-400 focus:ring-1 focus:ring-lime-400 outline-none w-64 transition-all"
               />
            </div>
            
            <div className="relative group w-full lg:w-auto">
              <button className="flex items-center justify-between gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-full text-sm font-medium hover:border-zinc-300 w-full lg:w-auto">
                 <span className="flex items-center gap-2"><ArrowUpDown size={14} /> Ordenar</span>
                 <ChevronDown size={14} />
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white border border-zinc-100 rounded-xl shadow-xl overflow-hidden hidden group-hover:block z-50">
                 <button onClick={() => setSortOrder('default')} className="w-full text-left px-4 py-3 text-sm hover:bg-zinc-50 text-zinc-600 hover:text-zinc-900">Relevancia</button>
                 <button onClick={() => setSortOrder('asc')} className="w-full text-left px-4 py-3 text-sm hover:bg-zinc-50 text-zinc-600 hover:text-zinc-900">Precio: Menor a Mayor</button>
                 <button onClick={() => setSortOrder('desc')} className="w-full text-left px-4 py-3 text-sm hover:bg-zinc-50 text-zinc-600 hover:text-zinc-900">Precio: Mayor a Menor</button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
           <div className="text-center py-20">
             <p className="text-zinc-400 text-lg">No encontramos productos que coincidan con tu búsqueda.</p>
             <button onClick={() => {setSearch(''); setActiveCategory('Todo')}} className="mt-4 text-lime-600 font-semibold hover:underline">Limpiar Filtros</button>
           </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
            {filteredProducts.map((product) => (
              <div key={product.id} className="group flex flex-col cursor-pointer" onClick={() => onProductSelect?.(product)}>
                {/* Image Card */}
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-zinc-100 mb-4 border border-zinc-100 group-hover:border-lime-200 transition-colors">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide text-zinc-900">
                      {product.category}
                    </span>
                  </div>

                  {/* Quick Add Button */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                    className="absolute bottom-3 right-3 bg-white hover:bg-lime-400 hover:text-zinc-900 text-zinc-900 p-3 rounded-full shadow-lg translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10"
                    title="Agregar al Carrito"
                  >
                    <ShoppingBag className="w-5 h-5" />
                  </button>
                </div>

                {/* Info */}
                <div className="space-y-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-zinc-900 group-hover:text-lime-600 transition-colors leading-tight">
                      {product.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1 text-zinc-500 text-xs mb-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span>{product.rating} (120 reviews)</span>
                  </div>
                  <span className="font-bold text-lg text-zinc-900">S/ {product.price.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;