import React, { useState, useRef } from 'react';
import { ArrowLeft, Star, ShoppingBag, Truck, ShieldCheck, Heart, Minus, Plus, ChevronLeft, ChevronRight, CheckCircle, Zap, RefreshCcw } from 'lucide-react';
import { Product, useStore } from '../context/StoreContext';
import { Page } from '../types';

interface ProductDetailProps {
  product: Product;
  onNavigate: (page: Page) => void;
  onProductSelect: (product: Product) => void;
  onOpenCart: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onNavigate, onProductSelect, onOpenCart }) => {
  const { addToCart, products } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  
  // Gallery State
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // Simulating multiple images for the gallery
  const galleryImages = [
    product.image,
    product.image, // Duplicate for demo purposes to show navigation
    product.image,
    product.image
  ];

  // Purchase Option State
  const [purchaseOption, setPurchaseOption] = useState<'one-time' | 'subscribe'>('one-time');

  // Related Products Carousel State
  const relatedScrollRef = useRef<HTMLDivElement>(null);
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 6);

  const handleAddToCart = () => {
    for(let i = 0; i < quantity; i++) {
        addToCart(product);
    }
    onOpenCart();
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const scrollRelated = (direction: 'left' | 'right') => {
    if (relatedScrollRef.current) {
      const scrollAmount = 300;
      relatedScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="bg-white min-h-screen pt-24 pb-20">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
        {/* Breadcrumb / Back */}
        <button onClick={() => onNavigate('shop')} className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 mb-8 font-medium">
           <ArrowLeft size={18} /> Volver a Tienda
        </button>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 mb-20">
           
           {/* LEFT COLUMN: Gallery */}
           <div className="space-y-4">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-zinc-100 border border-zinc-100 group">
                 <img 
                    src={galleryImages[currentImageIndex]} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-500" 
                 />
                 
                 {/* Navigation Arrows */}
                 <button 
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-zinc-900 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                 >
                    <ChevronLeft size={20} />
                 </button>
                 <button 
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-zinc-900 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                 >
                    <ChevronRight size={20} />
                 </button>

                 <div className="absolute top-4 left-4">
                     <span className="bg-lime-400 text-zinc-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                        {product.category}
                     </span>
                  </div>
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-4 gap-4">
                 {galleryImages.map((img, i) => (
                    <div 
                        key={i} 
                        onClick={() => setCurrentImageIndex(i)}
                        className={`aspect-square rounded-2xl overflow-hidden border-2 cursor-pointer transition-all ${
                            currentImageIndex === i ? 'border-lime-400 opacity-100' : 'border-transparent hover:border-zinc-200 opacity-70'
                        }`}
                    >
                       <img src={img} className="w-full h-full object-cover" />
                    </div>
                 ))}
              </div>
           </div>

           {/* RIGHT COLUMN: High Converting Info */}
           <div className="flex flex-col">
              
              {/* Ratings Header */}
              <div className="flex items-center gap-4 mb-4">
                 <div className="flex text-yellow-400">
                    {[1,2,3,4,5].map(i => <Star key={i} size={18} fill="currentColor" />)}
                 </div>
                 <span className="text-zinc-900 font-bold">4.8 (300+ Reseñas)</span>
                 
                 {/* Mock Avatars */}
                 <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                        <div key={i} className="w-6 h-6 rounded-full border border-white overflow-hidden bg-zinc-200">
                            <img src={`https://ui-avatars.com/api/?name=User+${i}&background=random`} alt="User" />
                        </div>
                    ))}
                 </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-2 tracking-tight">{product.name}</h1>
              
              {/* Price Block */}
              <div className="flex items-center gap-4 mb-6">
                 <div className="text-3xl font-bold text-zinc-900">
                    S/ {product.price.toFixed(2)}
                 </div>
                 <div className="text-xl text-zinc-400 font-normal line-through decoration-red-400">
                    S/ {(product.price * 1.3).toFixed(2)}
                 </div>
                 <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-md uppercase">
                    Oferta termina pronto
                 </span>
              </div>

              {/* Benefits List */}
              <div className="space-y-3 mb-8">
                 <BenefitItem text="100% Orgánico, Sin Pesticidas" />
                 <BenefitItem text="Cosechado el día de la entrega" />
                 <BenefitItem text="Promueve la salud familiar" />
                 <BenefitItem text="Cultivo Sostenible en Carabayllo" />
              </div>

              {/* Purchase Options */}
              <div className="space-y-4 mb-8">
                 <div className="flex items-center gap-4 mb-2">
                     <div className="h-[1px] bg-zinc-200 flex-1"></div>
                     <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Opciones de Compra</span>
                     <div className="h-[1px] bg-zinc-200 flex-1"></div>
                 </div>

                 {/* Option 1: One Time */}
                 <div 
                    onClick={() => setPurchaseOption('one-time')}
                    className={`relative border-2 rounded-2xl p-4 cursor-pointer transition-all ${
                        purchaseOption === 'one-time' 
                        ? 'border-lime-400 bg-lime-50/30' 
                        : 'border-zinc-100 hover:border-zinc-200'
                    }`}
                 >
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                purchaseOption === 'one-time' ? 'border-lime-500' : 'border-zinc-300'
                            }`}>
                                {purchaseOption === 'one-time' && <div className="w-2.5 h-2.5 rounded-full bg-lime-500" />}
                            </div>
                            <div>
                                <h3 className="font-bold text-zinc-900">Compra Única</h3>
                                <p className="text-sm text-zinc-500">Entrega estándar</p>
                            </div>
                        </div>
                        <span className="font-bold text-zinc-900">S/ {product.price.toFixed(2)}</span>
                    </div>
                 </div>

                 {/* Option 2: Subscribe */}
                 <div 
                    onClick={() => setPurchaseOption('subscribe')}
                    className={`relative border-2 rounded-2xl p-4 cursor-pointer transition-all ${
                        purchaseOption === 'subscribe' 
                        ? 'border-lime-400 bg-lime-50/30' 
                        : 'border-zinc-100 hover:border-zinc-200'
                    }`}
                 >
                    <div className="absolute -top-3 right-4 bg-lime-400 text-zinc-900 text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                        Ahorra 20%
                    </div>
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                purchaseOption === 'subscribe' ? 'border-lime-500' : 'border-zinc-300'
                            }`}>
                                {purchaseOption === 'subscribe' && <div className="w-2.5 h-2.5 rounded-full bg-lime-500" />}
                            </div>
                            <div>
                                <h3 className="font-bold text-zinc-900 flex items-center gap-2">
                                    Suscríbete & Ahorra <RefreshCcw size={14} className="text-lime-600"/>
                                </h3>
                                <p className="text-sm text-zinc-500">Entrega cada mes. Cancela cuando quieras.</p>
                            </div>
                        </div>
                        <div className="text-right">
                             <span className="font-bold text-zinc-900 block">S/ {(product.price * 0.8).toFixed(2)}</span>
                             <span className="text-xs text-zinc-400 line-through">S/ {product.price.toFixed(2)}</span>
                        </div>
                    </div>
                    
                    {/* Subscription Upsell Box */}
                    {purchaseOption === 'subscribe' && (
                        <div className="mt-4 bg-white/50 rounded-xl p-3 flex items-center gap-3 border border-lime-200/50">
                            <div className="bg-lime-100 p-2 rounded-lg">
                                <Zap size={16} className="text-lime-700"/>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-zinc-900">Guía de Recetas Gratis</p>
                                <p className="text-xs text-zinc-500">Te enviaremos un ebook con recetas saludables.</p>
                            </div>
                            <span className="ml-auto bg-lime-400 text-zinc-900 text-[10px] font-bold px-2 py-1 rounded">GRATIS</span>
                        </div>
                    )}
                 </div>
              </div>

              {/* Quantity & CTA */}
              <div className="flex items-center gap-4 mb-6">
                 <div className="flex items-center border-2 border-zinc-100 rounded-full h-14 w-32 justify-between px-4">
                     <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-zinc-400 hover:text-zinc-900"><Minus size={18}/></button>
                     <span className="font-bold text-lg">{quantity}</span>
                     <button onClick={() => setQuantity(quantity + 1)} className="text-zinc-400 hover:text-zinc-900"><Plus size={18}/></button>
                 </div>
                 <button 
                   onClick={() => { handleAddToCart(); onNavigate('checkout'); }}
                   className="flex-1 bg-lime-400 hover:bg-lime-300 text-zinc-900 font-bold h-14 rounded-full transition-all shadow-lg shadow-lime-400/20 flex items-center justify-center gap-2 text-lg"
                 >
                    <ShoppingBag size={20} strokeWidth={2.5} />
                    {purchaseOption === 'subscribe' ? 'Suscribir Ahora' : 'Agregar al Carrito'}
                 </button>
              </div>

              {/* Trust Signals */}
              <div className="flex items-center justify-center gap-6 text-xs font-medium text-zinc-500">
                 <div className="flex items-center gap-1"><Truck size={14}/> Envío Gratis &gt; S/100</div>
                 <div className="flex items-center gap-1"><ShieldCheck size={14}/> Garantía de Satisfacción</div>
              </div>
           </div>
        </div>

        {/* Tabs / Details */}
        <div className="mb-24">
           <div className="flex border-b border-zinc-200 mb-8 overflow-x-auto">
              {['Descripción', 'Información Nutricional', 'Envíos'].map(tab => (
                 <button 
                   key={tab}
                   onClick={() => setActiveTab(tab.toLowerCase().split(' ')[0])}
                   className={`px-8 py-4 font-medium text-lg relative whitespace-nowrap ${activeTab === tab.toLowerCase().split(' ')[0] ? 'text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'}`}
                 >
                    {tab}
                    {activeTab === tab.toLowerCase().split(' ')[0] && (
                       <div className="absolute bottom-0 left-0 w-full h-0.5 bg-zinc-900"></div>
                    )}
                 </button>
              ))}
           </div>
           
           <div className="bg-zinc-50 rounded-3xl p-8 lg:p-12">
              <h3 className="text-xl font-bold text-zinc-900 mb-4">Detalles del Producto</h3>
              <p className="text-zinc-600 leading-relaxed max-w-4xl">
                 Nuestros productos son seleccionados a mano en el momento óptimo de maduración. Al elegir orgánico, no solo estás eligiendo un mejor sabor, sino que estás apoyando prácticas agrícolas que regeneran el suelo y protegen la biodiversidad local. Ideal para ensaladas frescas, jugos detox o como acompañamiento saludable para tus comidas principales.
              </p>
           </div>
        </div>

        {/* Related Products Carousel */}
        <div className="relative">
           <div className="flex justify-between items-end mb-8">
               <h2 className="text-3xl font-bold text-zinc-900">Productos Relacionados</h2>
               <div className="flex gap-2">
                   <button onClick={() => scrollRelated('left')} className="w-10 h-10 rounded-full border border-zinc-200 flex items-center justify-center hover:bg-zinc-100 transition-colors">
                       <ChevronLeft size={20} />
                   </button>
                   <button onClick={() => scrollRelated('right')} className="w-10 h-10 rounded-full border border-zinc-200 flex items-center justify-center hover:bg-zinc-100 transition-colors">
                       <ChevronRight size={20} />
                   </button>
               </div>
           </div>
           
           <div 
                ref={relatedScrollRef}
                className="flex overflow-x-auto gap-6 pb-8 snap-x scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
           >
              {relatedProducts.length > 0 ? relatedProducts.map(relProduct => (
                 <div key={relProduct.id} className="min-w-[280px] md:min-w-[320px] snap-start group cursor-pointer" onClick={() => onProductSelect(relProduct)}>
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-100 mb-4 relative">
                       <img src={relProduct.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                       
                       <div className="absolute top-3 left-3">
                            <span className="bg-white/90 backdrop-blur px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide text-zinc-900">
                            {relProduct.category}
                            </span>
                        </div>
                    </div>
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-semibold text-zinc-900 text-lg group-hover:text-lime-600 transition-colors">{relProduct.name}</h3>
                            <div className="flex items-center gap-1 text-xs text-zinc-500">
                                <Star size={12} className="fill-yellow-400 text-yellow-400"/> {relProduct.rating}
                            </div>
                        </div>
                        <p className="font-bold text-zinc-900">S/ {relProduct.price.toFixed(2)}</p>
                    </div>
                 </div>
              )) : (
                  <p className="text-zinc-500">No hay productos relacionados disponibles.</p>
              )}
           </div>
        </div>

      </div>
    </div>
  );
};

const BenefitItem = ({ text }: { text: string }) => (
    <div className="flex items-center gap-2">
        <CheckCircle size={16} className="text-lime-500 fill-lime-100" />
        <span className="text-zinc-700 font-medium">{text}</span>
    </div>
);

export default ProductDetail;