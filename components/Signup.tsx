import React, { useState } from 'react';
import { ArrowLeft, User, Mail, Lock, AlertCircle, Phone } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Page } from '../App';

interface SignupProps {
  onNavigate: (page: Page) => void;
}

const Signup: React.FC<SignupProps> = ({ onNavigate }) => {
  const { signup } = useStore();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await signup(formData.email, formData.password, formData.name, formData.phone);
      if (error) {
        setError(error);
      } else {
        // Success
        onNavigate('shop');
      }
    } catch (err) {
      setError('Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row-reverse">
        {/* Image Side */}
        <div className="w-full md:w-1/2 relative bg-zinc-900">
           <img 
            src="https://images.unsplash.com/photo-1599598425947-320d39865eb7?q=80&w=2670&auto=format&fit=crop" 
            alt="Plántulas verdes" 
            className="w-full h-full object-cover opacity-60"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent"></div>
           <div className="absolute bottom-8 left-8 right-8 text-white">
              <h3 className="text-2xl font-semibold mb-2">Únete a la Revolución</h3>
              <p className="text-zinc-300 text-sm">Comienza tu viaje hacia una alimentación más inteligente y sostenible hoy.</p>
           </div>
        </div>

        {/* Form Side */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <button 
            onClick={() => onNavigate('home')} 
            className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors mb-8"
          >
            <ArrowLeft size={16} /> Volver al Inicio
          </button>

          <h2 className="text-3xl font-semibold text-zinc-900 mb-6">Crear Cuenta</h2>
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Nombre Completo</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 focus:border-lime-400 focus:ring-1 focus:ring-lime-400 outline-none transition-all" 
                  placeholder="Juan Pérez"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Correo Electrónico</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 focus:border-lime-400 focus:ring-1 focus:ring-lime-400 outline-none transition-all" 
                  placeholder="tu@empresa.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Celular</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 focus:border-lime-400 focus:ring-1 focus:ring-lime-400 outline-none transition-all" 
                  placeholder="987 654 321"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
                <input 
                  type="password" 
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 focus:border-lime-400 focus:ring-1 focus:ring-lime-400 outline-none transition-all" 
                  placeholder="Crea una contraseña segura"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-lime-400 text-zinc-900 font-semibold py-3 rounded-xl hover:bg-lime-300 transition-colors mt-2 flex justify-center"
            >
               {loading ? <div className="w-5 h-5 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin"></div> : "Empezar"}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-zinc-500">
            ¿Ya tienes cuenta? 
            <button onClick={() => onNavigate('login')} className="text-zinc-900 font-semibold ml-1 hover:underline">
              Iniciar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;