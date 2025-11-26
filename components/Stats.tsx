import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const Stats: React.FC = () => {
  return (
    <section id="stats" className="w-full py-32 px-6 lg:px-12 bg-white">
      <div className="max-w-screen-2xl mx-auto w-full">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 h-full">
          {/* Image 1 */}
          <div className="h-80 md:h-[500px] rounded-3xl overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?q=80&w=2670&auto=format&fit=crop" 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
              alt="Agricultor con caja de vegetales" 
            />
          </div>

          {/* Stat Card 1 */}
          <div className="h-80 md:h-[500px] bg-zinc-100 rounded-3xl p-10 flex flex-col justify-between relative group">
            <div className="absolute top-10 right-10 bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowUpRight className="w-6 h-6 text-zinc-900" />
            </div>
            <div className="text-7xl font-medium text-zinc-900 tracking-tighter">100%</div>
            <div>
              <h3 className="text-xl font-semibold text-zinc-900 mb-3">Orgánico</h3>
              <p className="text-lg text-zinc-500 leading-snug">Los mejores productos cultivados con el máximo cuidado, asegurando pureza natural.</p>
            </div>
          </div>

          {/* Image 2 */}
          <div className="h-80 md:h-[500px] rounded-3xl overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?q=80&w=2670&auto=format&fit=crop" 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
              alt="Invernadero y plantines" 
            />
          </div>

          {/* Stat Card 2 */}
          <div className="h-80 md:h-[500px] bg-lime-300 rounded-3xl p-10 flex flex-col justify-between relative group">
            <div className="absolute top-10 right-10 bg-white/40 backdrop-blur p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowUpRight className="w-6 h-6 text-zinc-900" />
            </div>
            <div className="text-7xl font-medium text-zinc-900 tracking-tighter">Cero</div>
            <div>
              <h3 className="text-xl font-semibold text-zinc-900 mb-3">Pesticidas</h3>
              <p className="text-lg text-zinc-800/80 leading-snug">Frescura y salud. Cultivado responsablemente y entregado por locales como tú.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;