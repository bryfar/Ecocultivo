import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Stats from './components/Stats';
import Features from './components/Features';
import Technology from './components/Technology';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import Login from './components/Login';
import Signup from './components/Signup';
import Shop from './components/Shop';
import AboutUs from './components/AboutUs';
import Contact from './components/Contact';
import AdminDashboard from './components/Admin/AdminDashboard';
import Checkout from './components/Checkout';
import ProductDetail from './components/ProductDetail';
import CartDrawer from './components/CartDrawer';
import CartPage from './components/CartPage';
import { StoreProvider, Product } from './context/StoreContext';
import { Page } from './types';

// Re-export Page for backward compatibility with components that haven't been updated yet
export type { Page };

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const lenisRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Lenis for smooth scrolling
    // @ts-ignore
    if (typeof window !== 'undefined' && window.Lenis) {
      // @ts-ignore
      const lenis = new window.Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        autoRaf: true,
      });

      lenisRef.current = lenis;

      // Cleanup on unmount
      return () => {
        lenis.destroy();
        lenisRef.current = null;
      };
    }
  }, []);

  const navigate = (page: Page) => {
    setCurrentPage(page);
    // Use Lenis to scroll to top immediately but smoothly if on same page, or instant if changing
    if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true });
    } else {
        window.scrollTo({ top: 0, behavior: 'auto' });
    }
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    navigate('product-detail');
  };

  const scrollToSection = (id: string) => {
    if (currentPage !== 'home') {
      setCurrentPage('home');
      // Allow time for re-render before scrolling
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element && lenisRef.current) {
          lenisRef.current.scrollTo(element, { offset: -50 });
        } else if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element && lenisRef.current) {
        lenisRef.current.scrollTo(element, { offset: -50 });
      } else if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <StoreProvider>
      <div className="min-h-screen bg-white text-zinc-600 w-full font-sans flex flex-col overflow-x-hidden">
        {currentPage !== 'admin' && (
          <Navbar 
            onNavigate={navigate} 
            onScrollToSection={scrollToSection} 
            currentPage={currentPage}
            onOpenCart={() => setIsCartOpen(true)}
          />
        )}
        
        <CartDrawer 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)} 
          onNavigate={navigate}
        />

        <main className={`flex-grow w-full relative ${currentPage === 'admin' ? 'h-screen overflow-hidden' : ''}`}>
          {currentPage === 'home' && (
            <div className="w-full flex flex-col">
              <Hero onSignup={() => navigate('signup')} onExplore={() => scrollToSection('features')} />
              <About onNavigate={navigate} />
              <Stats />
              <Features onNavigate={navigate} />
              <Technology />
              <Testimonials />
            </div>
          )}

          {currentPage === 'shop' && <Shop onNavigate={navigate} onProductSelect={handleProductSelect} />}
          {currentPage === 'product-detail' && selectedProduct && (
            <ProductDetail 
              product={selectedProduct} 
              onNavigate={navigate} 
              onProductSelect={handleProductSelect}
              onOpenCart={() => setIsCartOpen(true)}
            />
          )}
          {currentPage === 'cart' && <CartPage onNavigate={navigate} />}
          {currentPage === 'about-us' && <AboutUs onNavigate={navigate} />}
          {currentPage === 'contact' && <Contact onNavigate={navigate} />}
          {currentPage === 'login' && <Login onNavigate={navigate} />}
          {currentPage === 'signup' && <Signup onNavigate={navigate} />}
          {currentPage === 'checkout' && <Checkout onNavigate={navigate} />}
          
          {/* Admin Dashboard */}
          {currentPage === 'admin' && <AdminDashboard onNavigate={navigate} />}
        </main>

        {currentPage !== 'admin' && <Footer onNavigate={navigate} onScrollToSection={scrollToSection} />}
      </div>
    </StoreProvider>
  );
};

export default App;