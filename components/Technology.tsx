import React, { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const Technology: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      category: "Paso 1",
      title: "Preparación",
      description: "Comienza con el suelo. Preparamos nuestra tierra usando compost natural y técnicas sostenibles para asegurar una base rica en nutrientes para nuestros cultivos.",
      image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=2670&auto=format&fit=crop",
      thumbnail: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=400&auto=format&fit=crop"
    },
    {
      category: "Paso 2",
      title: "Siembra",
      description: "Seleccionamos cuidadosamente las mejores semillas orgánicas. Cada planta se coloca a mano, dándole el espacio y la atención que necesita para prosperar naturalmente.",
      image: "https://images.unsplash.com/photo-1599598425947-320d39865eb7?q=80&w=2670&auto=format&fit=crop",
      thumbnail: "https://images.unsplash.com/photo-1599598425947-320d39865eb7?q=80&w=400&auto=format&fit=crop"
    },
    {
      category: "Paso 3",
      title: "Cuidado",
      description: "Durante todo el ciclo de crecimiento, usamos cero pesticidas dañinos. Confiamos en controles biológicos y cuidado manual para proteger nuestras plantas y el medio ambiente.",
      image: "https://images.unsplash.com/photo-1615477021177-3e6c0c45161a?q=80&w=2670&auto=format&fit=crop",
      thumbnail: "https://images.unsplash.com/photo-1615477021177-3e6c0c45161a?q=80&w=400&auto=format&fit=crop"
    },
    {
      category: "Paso 4",
      title: "Cosecha",
      description: "Cosechamos en el punto máximo de madurez. Al recolectar específicamente cuando la fruta o verdura está lista, garantizamos el máximo sabor y valor nutricional.",
      image: "https://images.unsplash.com/photo-1595837936173-90d16eb78278?q=80&w=2670&auto=format&fit=crop",
      thumbnail: "https://images.unsplash.com/photo-1595837936173-90d16eb78278?q=80&w=400&auto=format&fit=crop"
    },
    {
      category: "Paso 5",
      title: "Entrega",
      description: "De nuestros campos directamente a tu hogar o tienda local. Productos frescos, limpios y saludables entregados con amor.",
      image: "https://images.unsplash.com/photo-1610348725531-843dff998e4c?q=80&w=2670&auto=format&fit=crop",
      thumbnail: "https://images.unsplash.com/photo-1610348725531-843dff998e4c?q=80&w=400&auto=format&fit=crop"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const slide = slides[currentSlide];
  const nextSlideIndex = (currentSlide + 1) % slides.length;

  return (
    <section id="technology" className="relative h-[90vh] w-full overflow-hidden bg-zinc-950">
      {/* Background Image Transition */}
      <div key={slide.image} className="absolute inset-0 w-full h-full animate-in fade-in duration-1000">
         <img 
            src={slide.image}
            alt={slide.title} 
            className="w-full h-full object-cover opacity-80"
          />
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent"></div>

      <div className="absolute inset-0 flex flex-col justify-end pb-20 px-6 lg:px-12">
        <div className="max-w-screen-2xl mx-auto w-full">
          <div className="mb-10 animate-in slide-in-from-bottom-8 fade-in duration-700">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white text-xs font-semibold tracking-wide mb-6">
              {slide.category}
            </span>
            <h2 className="text-5xl md:text-6xl font-medium text-white tracking-tight mb-6">Los mejores cultivos del campo a tu hogar</h2>
            <h3 className="text-3xl text-lime-400 mb-4">{slide.title}</h3>
            <p className="text-xl text-zinc-300 max-w-2xl leading-relaxed">
              {slide.description}
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-end justify-between border-t border-white/10 pt-8 gap-6">
            <div className="flex gap-4">
              {/* Active/Current Thumbnail */}
              <div className="w-48 h-28 rounded-xl overflow-hidden border-2 border-lime-400 relative cursor-pointer transition-all hover:scale-105">
                <img 
                  src={slide.thumbnail}
                  alt="Vista Actual"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20"></div>
              </div>
              
              {/* Next Preview Thumbnail */}
              <div 
                className="w-48 h-28 rounded-xl overflow-hidden border border-white/20 relative opacity-60 hover:opacity-100 transition-all cursor-pointer hidden sm:block"
                onClick={nextSlide}
              >
                 <img 
                   src={slides[nextSlideIndex].thumbnail}
                   alt="Siguiente Vista"
                   className="w-full h-full object-cover"
                 />
                 <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <span className="text-white text-xs font-medium uppercase tracking-wider">Sig</span>
                 </div>
              </div>
            </div>

            <div className="flex items-center gap-6 text-white font-mono text-sm">
              <span>[ 0{currentSlide + 1} / 0{slides.length} ]</span>
              <div className="flex gap-2">
                <button 
                  onClick={prevSlide}
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-zinc-900 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={nextSlide}
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-zinc-900 transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Technology;