import React, { useState } from 'react';
import { ArrowLeft, Mail, Lock, AlertCircle, Shield, User, Zap } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Page } from '../App';

interface LoginProps {
  onNavigate: (page: Page) => void;
}

const Login: React.FC<LoginProps> = ({ onNavigate }) => {
  const { login, signup } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const { error } = await login(email, password);
      if (error) {
        setError(error === 'Invalid login credentials' ? 'Credenciales incorrectas o email no confirmado' : error);
      } else {
        // Successful login - navigation handled by auth state change in App/Context usually, 
        // but explicit nav here for feedback
        if (email === 'bryan@greta.pe') {
           onNavigate('admin');
        } else {
           onNavigate('shop');
        }
      }
    } catch (err) {
      setError('Ocurrió un error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const createDemoUsers = async () => {
    setLoading(true);
    setError('');
    setSuccessMsg('');
    
    try {
        // Attempt to create Admin
        await signup('bryan@greta.pe', 'admin123', 'Administrador', '950172732');
        // Attempt to create Client
        await signup('bryfaro3@gmail.com', 'cliente123', 'Cliente Demo', '000000000');
        
        setSuccessMsg('Usuarios registrados. Se ha enviado un correo de confirmación a bryan@greta.pe y bryfaro3@gmail.com. Por favor verifícalos antes de entrar.');
    } catch (err: any) {
        // Supabase returns error if user already exists, which is fine for demo button
        if (err.message?.includes('registered')) {
             setSuccessMsg('Los usuarios ya están registrados. Intenta iniciar sesión.');
        } else {
             setError('Nota: Si los usuarios ya existen, solo inicia sesión. ' + (err.message || ''));
        }
    } finally {
        setLoading(false);
    }
  };

  const fillCredentials = (type: 'admin' | 'client') => {
      if (type === 'admin') {
          setEmail('bryan@greta.pe');
          setPassword('admin123');
      } else {
          setEmail('bryfaro3@gmail.com');
          setPassword('cliente123');
      }
  };

  return (
    <div className="pt-24 min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Side: Image */}
        <div className="w-full md:w-1/2 relative bg-zinc-900 hidden md:block">
           <img 
            src="https://images.unsplash.com/photo-1596484552993-9c8695f36e81?q=80&w=2670&auto=format&fit=crop" 
            alt="Tecnología Agrícola" 
            className="w-full h-full object-cover opacity-60"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent"></div>
           <div className="absolute bottom-8 left-8 right-8 text-white">
              <h3 className="text-2xl font-semibold mb-2">Bienvenido de Nuevo</h3>
              <p className="text-zinc-300 text-sm">
                Accede para gestionar tus pedidos o administrar la tienda.
              </p>
           </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <button 
            onClick={() => onNavigate('home')} 
            className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors mb-8"
          >
            <ArrowLeft size={16} /> Volver al Inicio
          </button>

          <h2 className="text-3xl font-semibold text-zinc-900 mb-2">Iniciar Sesión</h2>
          <p className="text-sm text-zinc-500 mb-6">
            Ingresa tus credenciales para continuar.
          </p>

          {/* DEMO TOOLS */}
          <div className="mb-6 p-4 bg-zinc-50 border border-zinc-200 rounded-xl">
             <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Herramientas Demo (Desarrollo)</p>
             <div className="flex gap-2 mb-3">
                 <button 
                    type="button"
                    onClick={() => fillCredentials('admin')}
                    className="flex-1 bg-white border border-zinc-200 hover:border-lime-400 text-zinc-700 hover:text-lime-600 text-xs font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                 >
                    <Shield size={14} /> Admin
                 </button>
                 <button 
                    type="button"
                    onClick={() => fillCredentials('client')}
                    className="flex-1 bg-white border border-zinc-200 hover:border-lime-400 text-zinc-700 hover:text-lime-600 text-xs font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                 >
                    <User size={14} /> Cliente
                 </button>
             </div>
             <button 
                type="button"
                onClick={createDemoUsers}
                className="w-full text-xs text-zinc-500 hover:text-zinc-900 underline flex items-center justify-center gap-1"
             >
                <Zap size={12} /> Registrar Usuarios Demo (Admin/Cliente)
             </button>
          </div>
          
          <form className="space-y-4" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={16} /> {error}
              </div>
            )}
            {successMsg && (
              <div className="bg-green-50 text-green-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={16} /> {successMsg}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Correo Electrónico</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 focus:border-lime-400 focus:ring-1 focus:ring-lime-400 outline-none transition-all" 
                  placeholder="usuario@ejemplo.com"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-zinc-700">Contraseña</label>
                <a href="#" className="text-xs text-lime-600 hover:underline">¿Olvidaste tu contraseña?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 focus:border-lime-400 focus:ring-1 focus:ring-lime-400 outline-none transition-all" 
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-zinc-900 text-white font-semibold py-3 rounded-xl hover:bg-zinc-800 transition-colors mt-2 flex justify-center"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : "Ingresar"}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-zinc-500">
            ¿No tienes cuenta? 
            <button onClick={() => onNavigate('signup')} className="text-lime-600 font-semibold ml-1 hover:underline">
              Regístrate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;