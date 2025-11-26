import React from 'react';
import { Carrot, Apple, Leaf, Sprout, ArrowRight } from 'lucide-react';
import { Page } from '../App';

interface FeaturesProps {
  onNavigate: (page: Page) => void;
}

const Features: React.FC<FeaturesProps> = ({ onNavigate }) => {
  return (
    <section id="features" className="min-h-screen w-full py-32 md:py-48 bg-zinc-950 text-white relative flex items-center">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 w-full">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-lime-400"></span>
              <span className="text-sm font-medium text-zinc-400 uppercase tracking-wide">DE NUESTRO JARDÍN</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-medium tracking-tight">
              Categorías de Productos
            </h2>
          </div>
          <p className="text-zinc-400 text-lg max-w-md leading-relaxed md:text-right">
            Seleccionamos lo mejor de cada temporada. Cultivos limpios, frescos y llenos de vida para tu hogar.
          </p>
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Category 1 */}
          <div 
            onClick={() => onNavigate('shop')}
            className="group relative bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 hover:bg-zinc-900 hover:border-lime-400/30 transition-all duration-500 flex flex-col justify-between h-[420px] cursor-pointer"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center mb-8 group-hover:bg-lime-400 transition-colors duration-500">
                <Carrot className="w-7 h-7 text-lime-400 group-hover:text-zinc-900 transition-colors" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Verduras Frescas</h3>
              <p className="text-zinc-400 leading-relaxed">
                Desde lechugas crujientes hasta pimientos vibrantes. Cosechados diariamente para asegurar la máxima frescura.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-lime-400 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
              Ver Productos <ArrowRight size={16} />
            </div>
          </div>

          {/* Category 2 */}
          <div 
            onClick={() => onNavigate('shop')}
            className="group relative bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 hover:bg-zinc-900 hover:border-lime-400/30 transition-all duration-500 flex flex-col justify-between h-[420px] cursor-pointer"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center mb-8 group-hover:bg-lime-400 transition-colors duration-500">
                <Apple className="w-7 h-7 text-lime-400 group-hover:text-zinc-900 transition-colors" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Frutas de Estación</h3>
              <p className="text-zinc-400 leading-relaxed">
                Dulces y naturales. Frutas maduradas en la planta bajo el sol, sin procesos artificiales ni químicos.
              </p>
            </div>
             <div className="flex items-center gap-2 text-sm font-medium text-lime-400 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
              Ver Productos <ArrowRight size={16} />
            </div>
          </div>

          {/* Category 3 */}
          <div 
            onClick={() => onNavigate('shop')}
            className="group relative bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 hover:bg-zinc-900 hover:border-lime-400/30 transition-all duration-500 flex flex-col justify-between h-[420px] cursor-pointer"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center mb-8 group-hover:bg-lime-400 transition-colors duration-500">
                <Leaf className="w-7 h-7 text-lime-400 group-hover:text-zinc-900 transition-colors" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Hierbas Aromáticas</h3>
              <p className="text-zinc-400 leading-relaxed">
                El secreto del sabor. Albahaca, menta, romero y más, listas para potenciar tus recetas favoritas.
              </p>
            </div>
             <div className="flex items-center gap-2 text-sm font-medium text-lime-400 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
              Ver Productos <ArrowRight size={16} />
            </div>
          </div>

          {/* Category 4 */}
          <div 
            onClick={() => onNavigate('shop')}
            className="group relative bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 hover:bg-zinc-900 hover:border-lime-400/30 transition-all duration-500 flex flex-col justify-between h-[420px] cursor-pointer"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center mb-8 group-hover:bg-lime-400 transition-colors duration-500">
                <Sprout className="w-7 h-7 text-lime-400 group-hover:text-zinc-900 transition-colors" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Plantines Orgánicos</h3>
              <p className="text-zinc-400 leading-relaxed">
                Cultiva tu propio alimento. Plantines robustos y sanos listos para trasplantar a tu huerto casero.
              </p>
            </div>
             <div className="flex items-center gap-2 text-sm font-medium text-lime-400 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
              Ver Productos <ArrowRight size={16} />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Features;