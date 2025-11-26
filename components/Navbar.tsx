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

  // Lock body scroll when menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

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
  const showBackground = isScrolled || !isHome || mobileMenuOpen; 

  const isActive = (page: Page) => currentPage === page ? "text-white" : "text-white/80 hover:text-white";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${showBackground ? 'bg-zinc-900/95 backdrop-blur-md border-zinc-800 py-3' : 'bg-transparent border-white/10 py-4 md:py-6'}`}>
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-12 flex items-center justify-between">
        <div 
          className="flex items-center cursor-pointer z-[70] relative" 
          onClick={() => handlePageClick('home')}
        >
          <Logo className="h-7 md:h-10 w-auto transition-all" variant="light" />
        </div>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8 text-base font-medium">
          <button onClick={() => handlePageClick('home')} className={`transition-colors ${isActive('home')}`}>Inicio</button>
          <button onClick={() => handlePageClick('shop')} className={`transition-colors ${isActive('shop')}`}>Tienda</button>
          <button onClick={() => handlePageClick('about-us')} className={`transition-colors ${isActive('about-us')}`}>Nosotros</button>
          <button onClick={() => handlePageClick('contact')} className={`transition-colors ${isActive('contact')}`}>Contacto</button>
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-6">
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
                <span className="text-sm text-white font-medium truncate max-w-[100px]">Hola, {user.name.split(' ')[0]}</span>
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

        {/* Mobile Actions & Toggle */}
        <div className="lg:hidden flex items-center gap-2 z-[70] relative">
           {/* Mobile Cart Icon - Hide when menu open to clean up header */}
           {!mobileMenuOpen && (
             <button 
               onClick={onOpenCart}
               className="text-white hover:text-lime-400 transition-colors relative p-2"
             >
               <ShoppingCart size={24} />
               {cartCount > 0 && (
                 <span className="absolute top-0 right-0 bg-lime-400 text-zinc-900 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center transform scale-90">
                   {cartCount}
                 </span>
               )}
             </button>
           )}

           <button 
            className="text-white p-2 hover:text-lime-400 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={30} /> : <Menu size={30} />}
          </button>
        </div>
      </div>

      {/* Mobile Full Screen Menu - Overlay */}
      <div 
        className={`fixed inset-0 w-screen h-[100dvh] bg-zinc-950 z-[60] flex flex-col justify-center items-center transition-all duration-500 ease-in-out ${
          mobileMenuOpen 
            ? 'opacity-100 visible translate-y-0' 
            : 'opacity-0 invisible -translate-y-full'
        }`}
      >
          {/* Centered Content */}
          <div className="flex flex-col items-center justify-center gap-8 w-full px-8 py-20">
             <button onClick={() => handlePageClick('home')} className="text-3xl font-bold text-white hover:text-lime-400 transition-colors">Inicio</button>
             <button onClick={() => handlePageClick('shop')} className="text-3xl font-bold text-white hover:text-lime-400 transition-colors">Tienda</button>
             <button onClick={() => handlePageClick('about-us')} className="text-3xl font-bold text-white hover:text-lime-400 transition-colors">Nosotros</button>
             <button onClick={() => handlePageClick('contact')} className="text-3xl font-bold text-white hover:text-lime-400 transition-colors">Contacto</button>
             
             {user?.role === 'admin' && (
                <button onClick={() => handlePageClick('admin')} className="text-2xl font-bold text-lime-400 hover:text-lime-300 transition-colors mt-2">Panel Admin</button>
             )}

             <div className="w-16 h-[1px] bg-zinc-800 my-4"></div>

             {user ? (
               <button onClick={handleLogout} className="text-lg font-medium text-white/60 hover:text-white border border-zinc-800 px-8 py-3 rounded-full w-full max-w-xs">
                 Cerrar Sesión
               </button>
             ) : (
               <div className="flex flex-col gap-4 w-full max-w-xs">
                   <button onClick={() => handlePageClick('login')} className="border border-white text-white text-lg font-semibold px-8 py-3 rounded-full w-full hover:bg-white hover:text-zinc-900 transition-all">
                     Inicia Sesión
                   </button>
                   <button onClick={() => handlePageClick('signup')} className="bg-white text-zinc-950 text-lg font-bold px-8 py-3 rounded-full w-full hover:bg-zinc-200 transition-all">
                     Empieza Hoy
                   </button>
               </div>
             )}
          </div>
      </div>
    </nav>
  );
};

export default Navbar;