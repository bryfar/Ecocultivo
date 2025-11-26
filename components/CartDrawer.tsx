import React from 'react';
import { X, Minus, Plus, ShoppingBag, ArrowRight, Trash2, Truck } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Page } from '../App';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: Page) => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, onNavigate }) => {
  const { cart, removeFromCart, addToCart, cartTotal, products } = useStore();
  
  // Free Shipping Logic (Threshold S/ 100)
  const freeShippingThreshold = 100;
  const progress = Math.min((cartTotal / freeShippingThreshold) * 100, 100);
  const remaining = Math.max(freeShippingThreshold - cartTotal, 0);

  // Simple Upsell Logic (Pick 2 products not in cart)
  const upsells = products
    .filter(p => !cart.some(c => c.id === p.id))
    .slice(0, 2);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 z-[90] backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[100] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-white z-10">
          <h2 className="text-xl font-bold flex items-center gap-2">
             <ShoppingBag className="text-lime-500" /> Tu Carrito ({cart.length})
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Bar */}
        <div className="px-6 py-4 bg-zinc-50 border-b border-zinc-100">
           {remaining > 0 ? (
             <p className="text-sm text-zinc-600 mb-2">
               Agrega <span className="font-bold text-zinc-900">S/ {remaining.toFixed(2)}</span> más para <span className="text-lime-600 font-bold">Envío Gratis</span>
             </p>
           ) : (
             <p className="text-sm text-lime-600 font-bold mb-2 flex items-center gap-2">
               <Truck size={16}/> ¡Felicidades! Tienes Envío Gratis
             </p>
           )}
           <div className="w-full h-2 bg-zinc-200 rounded-full overflow-hidden">
             <div className="h-full bg-lime-400 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
           </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center">
                 <ShoppingBag size={32} className="text-zinc-300" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-zinc-900">Tu carrito está vacío</h3>
                <p className="text-sm text-zinc-500 max-w-[200px] mx-auto mt-1">Parece que aún no has agregado productos frescos.</p>
              </div>
              <button onClick={onClose} className="text-lime-600 font-semibold hover:underline">
                Volver a la Tienda
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex gap-4 group">
                <div className="w-20 h-20 bg-zinc-100 rounded-xl overflow-hidden flex-shrink-0 border border-zinc-100">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover"/>
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-zinc-900 text-sm leading-tight">{item.name}</h4>
                    <button onClick={() => removeFromCart(item.id)} className="text-zinc-400 hover:text-red-500 transition-colors">
                      <Trash2 size={16}/>
                    </button>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-3 bg-zinc-50 rounded-lg px-2 py-1 border border-zinc-200">
                      <button className="text-zinc-400 hover:text-zinc-900" onClick={() => removeFromCart(item.id)}><Minus size={14} /></button>
                      <span className="text-xs font-semibold w-4 text-center">{item.quantity}</span>
                      <button className="text-zinc-400 hover:text-zinc-900" onClick={() => addToCart(item)}><Plus size={14} /></button>
                    </div>
                    <span className="font-bold text-zinc-900">S/ {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Upsells */}
          {cart.length > 0 && upsells.length > 0 && (
             <div className="pt-6 border-t border-zinc-100">
               <h3 className="text-sm font-bold text-zinc-900 mb-4">Te podría interesar</h3>
               <div className="space-y-4">
                 {upsells.map(product => (
                   <div key={product.id} className="flex gap-3 items-center bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                      <img src={product.image} className="w-12 h-12 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                         <p className="text-sm font-medium text-zinc-900 truncate">{product.name}</p>
                         <p className="text-xs text-zinc-500">S/ {product.price.toFixed(2)}</p>
                      </div>
                      <button 
                        onClick={() => addToCart(product)}
                        className="p-2 bg-white border border-zinc-200 rounded-lg hover:border-lime-400 hover:text-lime-600 transition-colors text-xs font-bold"
                      >
                        + Agregar
                      </button>
                   </div>
                 ))}
               </div>
             </div>
          )}
        </div>

        {/* Footer Actions */}
        {cart.length > 0 && (
           <div className="p-6 bg-white border-t border-zinc-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
             <div className="flex justify-between items-center mb-4">
               <span className="text-zinc-500 text-sm">Subtotal</span>
               <span className="text-xl font-bold text-zinc-900">S/ {cartTotal.toFixed(2)}</span>
             </div>
             <p className="text-xs text-zinc-400 mb-4 text-center">Impuestos y gastos de envío calculados en el pago.</p>
             <div className="grid grid-cols-2 gap-3">
               <button 
                 onClick={() => { onClose(); onNavigate('cart'); }}
                 className="px-4 py-3 border border-zinc-200 rounded-xl font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
               >
                 Ver Carrito
               </button>
               <button 
                 onClick={() => { onClose(); onNavigate('checkout'); }}
                 className="px-4 py-3 bg-lime-400 rounded-xl font-bold text-zinc-900 hover:bg-lime-300 transition-colors flex items-center justify-center gap-2"
               >
                 Pagar <ArrowRight size={18}/>
               </button>
             </div>
           </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;