import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowLeft, CreditCard, CheckCircle } from 'lucide-react';

type Page = 'home' | 'login' | 'signup' | 'shop' | 'product-detail' | 'cart' | 'about-us' | 'contact' | 'admin' | 'checkout';

interface CheckoutProps {
  onNavigate: (page: Page) => void;
}

const Checkout: React.FC<CheckoutProps> = ({ onNavigate }) => {
  const { cart, cartTotal, placeOrder } = useStore();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    card: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      placeOrder({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email
      });
      setLoading(false);
      setSuccess(true);
    }, 2000);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6 pt-24">
        <div className="bg-white p-12 rounded-3xl shadow-xl text-center max-w-lg w-full">
          <div className="w-20 h-20 bg-lime-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-lime-600" />
          </div>
          <h2 className="text-3xl font-bold text-zinc-900 mb-4">¡Gracias por tu compra!</h2>
          <p className="text-zinc-500 mb-8">Tu pedido ha sido procesado exitosamente. Recibirás un correo de confirmación en breve.</p>
          <button 
            onClick={() => onNavigate('shop')} 
            className="bg-zinc-900 text-white px-8 py-3 rounded-full font-semibold hover:bg-zinc-800"
          >
            Seguir Comprando
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 pt-32 pb-20">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
        <button onClick={() => onNavigate('shop')} className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 mb-8">
          <ArrowLeft size={16} /> Volver a la Tienda
        </button>
        
        <h1 className="text-4xl font-medium mb-12">Finalizar Compra</h1>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-100">
              <h2 className="text-xl font-semibold mb-6">Información de Envío</h2>
              <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                     <label className="text-sm font-medium text-zinc-700">Nombre</label>
                     <input required type="text" className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:border-lime-400 outline-none" 
                       value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                   </div>
                   <div className="space-y-2">
                     <label className="text-sm font-medium text-zinc-700">Apellido</label>
                     <input required type="text" className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:border-lime-400 outline-none" 
                       value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})}/>
                   </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700">Correo Electrónico</label>
                  <input required type="email" className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:border-lime-400 outline-none" 
                    value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}/>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700">Dirección</label>
                  <input required type="text" className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:border-lime-400 outline-none" 
                    value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}/>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700">Tarjeta de Crédito (Simulada)</label>
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5"/>
                    <input required type="text" placeholder="0000 0000 0000 0000" className="w-full pl-12 pr-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:border-lime-400 outline-none" 
                      value={formData.card} onChange={e => setFormData({...formData, card: e.target.value})}/>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-5">
             <div className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-100 sticky top-32">
                <h2 className="text-xl font-semibold mb-6">Resumen del Pedido</h2>
                <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-zinc-100 rounded-lg overflow-hidden">
                          <img src={item.image} className="w-full h-full object-cover"/>
                        </div>
                        <div>
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-zinc-500">Cant: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-medium text-sm">S/ {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-zinc-100 pt-6 space-y-2">
                   <div className="flex justify-between text-zinc-500">
                     <span>Subtotal</span>
                     <span>S/ {cartTotal.toFixed(2)}</span>
                   </div>
                   <div className="flex justify-between text-zinc-500">
                     <span>Envío</span>
                     <span>S/ 10.00</span>
                   </div>
                   <div className="flex justify-between text-xl font-bold text-zinc-900 pt-4">
                     <span>Total</span>
                     <span>S/ {(cartTotal + 10).toFixed(2)}</span>
                   </div>
                </div>

                <button 
                  type="submit" 
                  form="checkout-form"
                  disabled={loading}
                  className="w-full bg-lime-400 text-zinc-900 font-bold py-4 rounded-xl mt-8 hover:bg-lime-300 transition-colors disabled:opacity-50 flex justify-center items-center"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin"></div>
                  ) : "Pagar Ahora"}
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;