import React from 'react';
import { Trash2, ArrowRight, ShieldCheck, Lock, CreditCard } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Page } from '../App';

interface CartPageProps {
  onNavigate: (page: Page) => void;
}

const CartPage: React.FC<CartPageProps> = ({ onNavigate }) => {
  const { cart, removeFromCart, cartTotal } = useStore();

  return (
    <div className="bg-zinc-50 min-h-screen pt-32 pb-20">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
        <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-8">Tu Carrito de Compras</h1>

        <div className="grid lg:grid-cols-12 gap-12">
           
           {/* Cart Items Table */}
           <div className="lg:col-span-8">
              <div className="bg-white rounded-3xl shadow-sm border border-zinc-200 overflow-hidden">
                 <table className="w-full text-left">
                    <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 text-sm uppercase tracking-wider">
                       <tr>
                          <th className="px-6 py-4 font-medium">Producto</th>
                          <th className="px-6 py-4 font-medium">Precio</th>
                          <th className="px-6 py-4 font-medium">Cantidad</th>
                          <th className="px-6 py-4 font-medium text-right">Total</th>
                          <th className="px-6 py-4"></th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                       {cart.length === 0 ? (
                          <tr>
                             <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                                Tu carrito está vacío. <button onClick={() => onNavigate('shop')} className="text-lime-600 font-bold hover:underline">Ir a la tienda</button>
                             </td>
                          </tr>
                       ) : (
                          cart.map(item => (
                             <tr key={item.id} className="hover:bg-zinc-50/50 transition-colors">
                                <td className="px-6 py-4">
                                   <div className="flex items-center gap-4">
                                      <div className="w-16 h-16 rounded-xl bg-zinc-100 overflow-hidden">
                                         <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                      </div>
                                      <div>
                                         <p className="font-bold text-zinc-900">{item.name}</p>
                                         <p className="text-xs text-zinc-500">{item.category}</p>
                                      </div>
                                   </div>
                                </td>
                                <td className="px-6 py-4 text-zinc-600">S/ {item.price.toFixed(2)}</td>
                                <td className="px-6 py-4">
                                   <div className="inline-flex items-center border border-zinc-200 rounded-lg bg-white px-2 py-1 text-sm font-bold">
                                      {item.quantity}
                                   </div>
                                </td>
                                <td className="px-6 py-4 text-right font-bold text-zinc-900">
                                   S/ {(item.price * item.quantity).toFixed(2)}
                                </td>
                                <td className="px-6 py-4 text-right">
                                   <button onClick={() => removeFromCart(item.id)} className="text-zinc-400 hover:text-red-500 transition-colors">
                                      <Trash2 size={18} />
                                   </button>
                                </td>
                             </tr>
                          ))
                       )}
                    </tbody>
                 </table>
              </div>

              {/* Coupon Code Section */}
              <div className="mt-8 bg-white p-6 rounded-2xl border border-zinc-200 flex flex-col md:flex-row items-center gap-4">
                 <div className="flex-1">
                    <label className="block text-sm font-bold text-zinc-700 mb-1">¿Tienes un cupón?</label>
                    <p className="text-xs text-zinc-500">Ingresa tu código para obtener descuentos extra.</p>
                 </div>
                 <div className="flex gap-2 w-full md:w-auto">
                    <input type="text" placeholder="Código" className="border border-zinc-200 rounded-xl px-4 py-2 outline-none focus:border-lime-400 w-full" />
                    <button className="bg-zinc-900 text-white px-6 py-2 rounded-xl font-bold hover:bg-zinc-800">Aplicar</button>
                 </div>
              </div>
           </div>

           {/* Summary Sidebar */}
           <div className="lg:col-span-4 space-y-6">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-200">
                 <h2 className="text-xl font-bold text-zinc-900 mb-6">Resumen</h2>
                 <div className="space-y-4 text-sm">
                    <div className="flex justify-between text-zinc-600">
                       <span>Subtotal</span>
                       <span>S/ {cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-zinc-600">
                       <span>Envío Estimado</span>
                       <span>S/ 10.00</span>
                    </div>
                    <div className="flex justify-between text-zinc-600">
                       <span>Impuestos</span>
                       <span>S/ 0.00</span>
                    </div>
                    <div className="border-t border-zinc-100 pt-4 flex justify-between text-lg font-bold text-zinc-900">
                       <span>Total</span>
                       <span>S/ {(cartTotal + 10).toFixed(2)}</span>
                    </div>
                 </div>

                 <button 
                   onClick={() => onNavigate('checkout')}
                   className="w-full bg-lime-400 text-zinc-900 font-bold py-4 rounded-xl mt-8 hover:bg-lime-300 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-lime-400/20"
                 >
                    Proceder al Pago <ArrowRight size={20} />
                 </button>

                 <div className="mt-6 flex flex-col gap-3">
                    <div className="flex items-center gap-3 text-xs text-zinc-500">
                       <ShieldCheck size={16} className="text-zinc-900" /> Compra Segura SSL
                    </div>
                    <div className="flex items-center gap-3 text-xs text-zinc-500">
                       <Lock size={16} className="text-zinc-900" /> Privacidad Garantizada
                    </div>
                 </div>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
};

export default CartPage;