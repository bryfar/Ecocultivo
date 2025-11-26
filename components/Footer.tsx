import React, { useState } from 'react';
import { ArrowRight, Linkedin, Instagram, X as XIcon, Check } from 'lucide-react';
import { Page } from '../App';

interface FooterProps {
  onNavigate: (page: Page) => void;
  onScrollToSection: (id: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate, onScrollToSection }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000); 
    }
  };

  return (
    <footer className="bg-zinc-950 text-zinc-400 pt-24 pb-12 border-t border-zinc-900">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
        
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-24">
          <div className="max-w-xl">
            <h2 className="text-3xl text-white font-medium mb-4">De nuestro jardín a tu hogar.</h2>
            <p className="text-lg mb-8">Sabores que nutren y cuidan tu salud.</p>
            <button 
              onClick={() => onNavigate('shop')}
              className="inline-flex items-center gap-2 bg-lime-400 hover:bg-lime-300 text-zinc-950 px-6 py-3 rounded-full text-sm font-semibold transition-colors"
            >
              Visitar Tienda <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col">
              <span className="text-xs font-medium uppercase tracking-wider mb-4">Síguenos</span>
              <div className="flex gap-2">
                <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-zinc-800 transition-colors text-white">
                  <XIcon className="w-4 h-4" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-zinc-800 transition-colors text-white">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-zinc-800 transition-colors text-white">
                  <Instagram className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-12 border-t border-zinc-900">
          <div>
            <h3 className="text-white font-medium mb-6">Información de Contacto</h3>
            <ul className="space-y-3 text-sm">
              <li className="text-zinc-400">Fundo San Isidro s/n</li>
              <li className="text-zinc-400">Carabayllo</li>
              <li className="text-zinc-400">950-172-732</li>
              <li className="text-lime-400 mt-2">Lunes - Sábado</li>
              <li className="text-zinc-400">8:00 a.m. a 6:00 p.m.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-medium mb-6">Explorar</h3>
            <ul className="space-y-3 text-sm">
              <li><button onClick={() => onNavigate('home')} className="hover:text-lime-400 transition-colors text-left">Inicio</button></li>
              <li><button onClick={() => onNavigate('shop')} className="hover:text-lime-400 transition-colors text-left">Tienda</button></li>
              <li><button onClick={() => onNavigate('about-us')} className="hover:text-lime-400 transition-colors text-left">Nosotros</button></li>
              <li><button onClick={() => onNavigate('contact')} className="hover:text-lime-400 transition-colors text-left">Contacto</button></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-medium mb-6">Legal</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-lime-400 transition-colors">Términos y Condiciones</a></li>
              <li><a href="#" className="hover:text-lime-400 transition-colors">Política de Privacidad</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-medium mb-6">Boletín</h3>
            <form onSubmit={handleSubscribe} className="flex items-center bg-zinc-900 rounded-full p-1 pr-2 border border-zinc-800 focus-within:border-lime-400/50 transition-colors relative overflow-hidden">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ingresa tu correo" 
                className="bg-transparent border-none text-sm px-4 py-2 w-full text-white focus:ring-0 outline-none placeholder:text-zinc-600"
                disabled={subscribed}
              />
              <button 
                type="submit" 
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
                  subscribed 
                    ? "bg-lime-400 text-zinc-900 w-24" 
                    : "bg-white text-zinc-900 hover:bg-zinc-200"
                }`}
              >
                {subscribed ? (
                  <span className="flex items-center justify-center gap-1"><Check size={12}/> Listo</span>
                ) : (
                  "Suscribir"
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-zinc-900 text-sm text-zinc-600">
          <p>© 2024 Fundo San Isidro. Todos los derechos reservados.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-zinc-400">Política de Privacidad</a>
            <a href="#" className="hover:text-zinc-400">Términos y Condiciones</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;