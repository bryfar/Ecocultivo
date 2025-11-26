import React from 'react';
import { Leaf, Users, Globe, Heart, ShieldCheck } from 'lucide-react';
import { TextRevealByWord } from './ui/text-reveal';
import { Page } from '../types';

interface AboutUsProps {
  onNavigate: (page: Page) => void;
}

const AboutUs: React.FC<AboutUsProps> = ({ onNavigate }) => {
  return (
    <div className="bg-white min-h-screen">
      {/* Immersive Hero */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=2672&auto=format&fit=crop" 
            alt="Paisaje de granja amplio" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/70 via-zinc-900/50 to-zinc-900"></div>
        </div>
        
        <div className="relative z-10 max-w-screen-2xl mx-auto px-6 lg:px-12 w-full pt-20">
          <div className="max-w-3xl">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-md text-lime-400 text-sm font-medium mb-8">
              <span>Fundo San Isidro</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-medium text-white tracking-tight leading-[1.1] mb-8">
              Productos naturales para un <span className="text-lime-400">futuro mejor.</span>
            </h1>
            <p className="text-xl text-zinc-200 max-w-xl leading-relaxed">
               Cultivamos con amor y cosechamos salud. Nuestro compromiso es el bienestar de tu familia a través de una agricultura orgánica y sostenible.
            </p>
          </div>
        </div>
      </section>

      {/* Text Reveal / Origin Story Section */}
      <section className="bg-white">
        <TextRevealByWord 
          text="Todo comenzó en la tierra que nos vio crecer, y que nuestro padre amaba tanto. Nuestra pasión nos llevó a cultivar productos más sanos y ecológicos. La salud de nuestra familia y comunidad es lo primero." 
          className="text-zinc-900 dark:text-zinc-900"
        />
      </section>

      {/* Values Grid */}
      <section className="py-32 bg-zinc-50">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-20">
             <span className="text-sm font-semibold text-lime-600 uppercase tracking-wider mb-2 block">Nuestros Valores Fundamentales</span>
             <h2 className="text-4xl font-medium text-zinc-900 tracking-tight">100% Orgánico y Libre de Pesticidas</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-zinc-100 hover:border-lime-200 transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-lime-100 flex items-center justify-center mb-8 group-hover:bg-lime-400 transition-colors">
                <Leaf className="w-6 h-6 text-lime-700 group-hover:text-zinc-900" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 mb-4">Sostenibilidad Primero</h3>
              <p className="text-zinc-500 leading-relaxed">
                Utilizamos métodos naturales para proteger y nutrir nuestras plantas, asegurando responsabilidad ambiental.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-zinc-100 hover:border-lime-200 transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-zinc-100 flex items-center justify-center mb-8 group-hover:bg-zinc-900 transition-colors">
                <ShieldCheck className="w-6 h-6 text-zinc-700 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 mb-4">Puro y Limpio</h3>
              <p className="text-zinc-500 leading-relaxed">
                Nuestras verduras son tiernas, deliciosas, limpias y libres de pesticidas. Cultivadas responsablemente para tu salud.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-zinc-100 hover:border-lime-200 transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-zinc-100 flex items-center justify-center mb-8 group-hover:bg-zinc-900 transition-colors">
                <Heart className="w-6 h-6 text-zinc-700 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 mb-4">Familia y Comunidad</h3>
              <p className="text-zinc-500 leading-relaxed">
                Somos una familia de emprendedores. Creemos en proporcionar alimentos frescos y saludables para nuestros vecinos y seres queridos.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;