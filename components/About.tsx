import React, { useState } from 'react';
import { Page } from '../App';

interface AboutProps {
  onNavigate: (page: Page) => void;
}

type Tab = 'Quienes Somos' | 'Nuestros Cultivos' | 'Sostenibilidad' | 'Promesa';

const About: React.FC<AboutProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<Tab>('Quienes Somos');

  const content = {
    'Quienes Somos': {
      title: "Bienvenidos. Somos una familia de emprendedores.",
      description: "Todo comenzó en la tierra que nos vio crecer. Estamos dedicados a brindar productos naturales para un futuro mejor, impulsados por la pasión por el campo y la vida saludable."
    },
    'Nuestros Cultivos': {
      title: "100% Orgánicos y Libres de Pesticidas.",
      description: "Nuestros cultivos son cuidados con el máximo esmero. Aseguramos que lo que llevas a tu mesa esté completamente libre de químicos dañinos, entregando sabor puro y fresco en cada bocado."
    },
    'Sostenibilidad': {
      title: "Agricultura Ambientalmente Responsable.",
      description: "Cultivamos de manera sostenible, utilizando métodos naturales para proteger y nutrir nuestras plantas. Creemos en cuidar la tierra para que ella continúe cuidándonos a nosotros por generaciones."
    },
    'Promesa': {
      title: "Cosechamos Salud.",
      description: "Nuestra misión es simple: disfrutar de alimentos frescos y saludables. La salud de nuestra familia y comunidad es lo primero, por eso nunca comprometemos la calidad ni la seguridad."
    }
  };

  return (
    <section id="about" className="min-h-screen w-full flex items-center py-24 bg-white transition-all duration-500 relative z-10">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 w-full">
        
        {/* Pills */}
        <div className="flex flex-wrap gap-3 mb-20">
          {(Object.keys(content) as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full text-sm font-medium border transition-colors duration-300 ${
                activeTab === tab 
                  ? "bg-lime-300 text-zinc-900 border-lime-300 shadow-sm" 
                  : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-300 hover:text-zinc-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-12 gap-12 w-full">
          <div className="lg:col-span-3">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-900"></span>
              <span className="text-sm font-medium text-zinc-900 uppercase tracking-wide">Fundo San Isidro</span>
            </div>
          </div>
          <div className="lg:col-span-9 space-y-10 animate-fadeIn">
            <div key={activeTab} className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium text-zinc-900 tracking-tight leading-tight">
                {content[activeTab].title}
              </h2>
              <p className="text-xl md:text-2xl text-zinc-500 leading-relaxed max-w-4xl">
                {content[activeTab].description}
              </p>
              <button 
                onClick={() => onNavigate('about-us')}
                className="px-8 py-4 rounded-full border border-zinc-200 text-zinc-900 text-base font-medium hover:bg-zinc-50 transition-colors"
              >
                Conoce Más Sobre Nosotros
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;