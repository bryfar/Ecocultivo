import React from 'react';
import { Quote } from 'lucide-react';

const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="w-full min-h-[80vh] flex items-center py-32 bg-white">
      <div className="max-w-screen-lg mx-auto px-6 text-center w-full">
        <div className="flex justify-center items-center w-full mb-12 text-xs font-medium text-zinc-400 uppercase tracking-widest">
          <span>FAMILIA</span>
        </div>

        <div className="min-h-[250px] mb-20 flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Quote className="w-12 h-12 text-lime-400 mb-8 opacity-50" />
          <h2 className="text-3xl md:text-5xl lg:text-5xl font-medium text-zinc-900 tracking-tight leading-tight mb-8 max-w-4xl">
            "Todo comenzó en la tierra que nos vio crecer, y que nuestro padre amaba tanto. Nuestra pasión nos llevó a cultivar productos más sanos y ecológicos."
          </h2>
          <p className="text-xl text-zinc-500">
            La salud de nuestra familia y comunidad es lo primero. <br/>
            <span className="text-lime-600 font-semibold mt-2 block">Amor por el campo y todo lo natural.</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="h-64 rounded-3xl overflow-hidden">
                <img src="https://images.unsplash.com/photo-1542038784456-1ea0e93ca375?q=80&w=2670&auto=format&fit=crop" alt="Familia en campo" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="h-64 rounded-3xl overflow-hidden">
                <img src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=2670&auto=format&fit=crop" alt="Paisaje de cultivo" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="h-64 rounded-3xl overflow-hidden">
                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2670&auto=format&fit=crop" alt="Retrato Padre" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;