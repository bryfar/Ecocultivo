import React from 'react';
import { ArrowRight } from 'lucide-react';
import SplitText from './ui/split-text';

interface HeroProps {
  onSignup: () => void;
  onExplore: () => void;
}

const Hero: React.FC<HeroProps> = ({ onSignup, onExplore }) => {
  return (
    <section className="relative min-h-screen flex items-end pb-20 pt-32 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2532&auto=format&fit=crop" 
          alt="Agricultor en campo al atardecer" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/60 via-zinc-900/20 to-zinc-900/90"></div>
      </div>

      <div className="relative z-10 w-full max-w-screen-2xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-12 items-end">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-md text-white text-sm font-medium">
            <span>DE NUESTRO JARDÍN</span>
          </div>
          
          <div className="text-5xl md:text-7xl text-white leading-[1.1]">
            <SplitText text="De la Chacra" className="block" delay={0.1} />
            <span className="text-lime-400">a tu Casa.</span>
          </div>

          <p className="text-xl text-zinc-200 max-w-lg leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-forwards opacity-0" style={{ animationDelay: '500ms' }}>
            Sabores que nutren y cuidan tu salud. Cultivamos con amor, cosechamos salud.
          </p>
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500 fill-mode-forwards opacity-0" style={{ animationDelay: '700ms' }}>
            <button 
              onClick={onExplore}
              className="group bg-lime-400 hover:bg-lime-300 text-zinc-900 px-8 py-4 rounded-full text-base font-semibold transition-all flex items-center gap-2"
            >
              Explora Nuestros Productos
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Floating Mission Card */}
        <div className="hidden lg:flex justify-end items-end">
          <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 p-8 rounded-2xl max-w-md text-white animate-in fade-in slide-in-from-right-8 duration-1000">
            <div className="flex items-center gap-2 mb-4 text-lime-400">
              <span className="w-2 h-2 bg-lime-400 rounded-full"></span>
              <span className="text-sm font-semibold uppercase tracking-wider">Nuestra Promesa</span>
            </div>
            <p className="text-lg font-light leading-relaxed mb-6">
              Productos naturales para un futuro mejor. 100% orgánicos, libres de pesticidas y cultivados con métodos sostenibles para proteger a tu familia.
            </p>
            <button 
              onClick={onSignup}
              className="inline-flex items-center gap-2 text-sm font-medium hover:text-lime-400 transition-colors"
            >
              Visita Nuestra Tienda <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;