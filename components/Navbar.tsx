import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingCart, UserCog, LogOut } from 'lucide-react';
import { Page } from '../types';
import { useStore } from '../context/StoreContext';
import Logo from './ui/Logo';

interface NavbarProps {
  onNavigate: (page: Page) => void;
  onScrollToSection: (id: string) => void;
  currentPage: Page;
  onOpenCart?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, onScrollToSection, currentPage, onOpenCart }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const { cart, user, logout } = useStore();
  const cartCount = cart?.reduce((a, b) => a + b.quantity, 0) || 0;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handlePageClick = (page: Page) => {
    setMobileMenuOpen(false);
    onNavigate(page);
  };

  const handleLogout = async () => {
    await logout();
    onNavigate('home');
    setMobileMenuOpen(false);
  };

  const isHome = currentPage === 'home';
  const showBackground = isScrolled || !isHome;

  const isActive = (page: Page) => currentPage === page ? "text-white" : "text-white/80 hover:text-white";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${showBackground ? 'bg-zinc-900/95 backdrop-blur-md border-zinc-800 py-3' : 'bg-transparent border-white/10 py-5'}`}>
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 flex items-center justify-between">
        <div 
          className="flex items-center cursor-pointer" 
          onClick={() => handlePageClick('home')}
        >
          {/* Logo Component - Always light variant because navbar is dark/transparent */}
          <Logo className="h-10 w-auto" variant="light" />
        </div>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8 text-base font-medium">
          <button onClick={() => handlePageClick('home')} className={`transition-colors ${isActive('home')}`}>Inicio</button>
          <button onClick={() => handlePageClick('shop')} className={`transition-colors ${isActive('shop')}`}>Tienda</button>
          <button onClick={() => handlePageClick('about-us')} className={`transition-colors ${isActive('about-us')}`}>Nosotros</button>
          <button onClick={() => handlePageClick('contact')} className={`transition-colors ${isActive('contact')}`}>Contacto</button>
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-6">
          {user?.role === 'admin' && (
            <button 
               onClick={() => handlePageClick('admin')}
               className="text-white/60 hover:text-lime-400 transition-colors flex items-center gap-2 text-sm"
               title="Admin Panel"
            >
               <UserCog size={18} /> Panel
            </button>
          )}

          <button 
             onClick={onOpenCart}
             className="text-white hover:text-lime-400 transition-colors relative"
          >
             <ShoppingCart size={22} />
             {cartCount > 0 && (
               <span className="absolute -top-2 -right-2 bg-lime-400 text-zinc-900 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                 {cartCount}
               </span>
             )}
          </button>

          {user ? (
             <div className="flex items-center gap-4">
                <span className="text-sm text-white font-medium">Hola, {user.name}</span>
                <button 
                  onClick={handleLogout}
                  className="text-white/60 hover:text-white"
                  title="Cerrar Sesión"
                >
                  <LogOut size={20} />
                </button>
             </div>
          ) : (
            <button 
              onClick={() => handlePageClick('login')} 
              className="text-base font-medium text-white hover:text-white/80 transition-colors"
            >
              Entrar
            </button>
          )}

          <button 
            onClick={() => handlePageClick('shop')} 
            className="bg-lime-400 hover:bg-lime-300 text-zinc-900 px-5 py-2 rounded-full text-sm font-semibold transition-colors flex items-center gap-2"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-900"></span>
            Comprar
          </button>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-zinc-900 border-t border-zinc-800 p-6 md:hidden flex flex-col space-y-4 shadow-xl">
          <button onClick={() => handlePageClick('home')} className="text-left text-white/80 hover:text-white">Inicio</button>
          <button onClick={() => handlePageClick('shop')} className="text-left text-white/80 hover:text-white">Tienda</button>
          <button onClick={() => handlePageClick('about-us')} className="text-left text-white/80 hover:text-white">Nosotros</button>
          <button onClick={() => handlePageClick('contact')} className="text-left text-white/80 hover:text-white">Contacto</button>
          {user?.role === 'admin' && (
             <button onClick={() => handlePageClick('admin')} className="text-left text-lime-400 hover:text-lime-300">Admin Panel</button>
          )}
          <hr className="border-zinc-800" />
          {user ? (
            <button onClick={handleLogout} className="text-left text-white/80 hover:text-white">Cerrar Sesión</button>
          ) : (
            <button onClick={() => handlePageClick('login')} className="text-left text-white/80 hover:text-white">Entrar</button>
          )}
          <button onClick={() => handlePageClick('shop')} className="bg-lime-400 text-zinc-900 px-5 py-3 rounded-full text-center font-semibold">Ir a Tienda</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;