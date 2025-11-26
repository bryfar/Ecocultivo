import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, ArrowLeft, CheckCircle } from 'lucide-react';
import { Page } from '../types';

interface ContactProps {
  onNavigate: (page: Page) => void;
}

const Contact: React.FC<ContactProps> = ({ onNavigate }) => {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // Simulate API call
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col lg:flex-row">
      
      {/* Left Side - Image & Info */}
      <div className="lg:w-5/12 relative bg-zinc-900 min-h-[50vh] lg:min-h-screen">
        <img 
          src="https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?q=80&w=2670&auto=format&fit=crop" 
          alt="Agricultor en campo" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/20 to-transparent"></div>
        
        <div className="relative z-10 h-full flex flex-col justify-between p-12 lg:p-16 text-white pt-32">
          <div>
            <span className="text-lime-400 font-semibold tracking-wider uppercase text-sm mb-4 block">Ponte en Contacto</span>
            <h1 className="text-4xl lg:text-5xl font-medium mb-6">Cultivemos algo grande juntos.</h1>
            <p className="text-zinc-300 text-lg max-w-md">
              Visita nuestro fundo o contáctanos para saber más sobre nuestros productos orgánicos.
            </p>
          </div>

          <div className="bg-zinc-900/60 backdrop-blur-md border border-white/10 p-8 rounded-3xl space-y-8 mt-12 lg:mt-0">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/10 rounded-full">
                 <Phone className="w-5 h-5 text-lime-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-400 mb-1">Llámanos</p>
                <p className="font-medium text-lg">950-172-732</p>
                <p className="text-xs text-zinc-500">Lun - Sab, 8:00 AM - 6:00 PM</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/10 rounded-full">
                 <MapPin className="w-5 h-5 text-lime-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-400 mb-1">Visita Fundo San Isidro</p>
                <p className="font-medium text-lg">Fundo San Isidro s/n<br/>Carabayllo</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="lg:w-7/12 p-8 lg:p-24 flex items-center bg-white">
        <div className="max-w-xl w-full mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl font-semibold text-zinc-900 mb-2">Envíanos un mensaje</h2>
            <p className="text-zinc-500">Normalmente respondemos dentro de las 24 horas.</p>
          </div>

          {sent ? (
            <div className="bg-lime-50 border border-lime-200 rounded-3xl p-10 text-center animate-in fade-in zoom-in-95">
              <div className="w-16 h-16 bg-lime-100 text-lime-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-2">¡Mensaje Enviado!</h3>
              <p className="text-zinc-600 mb-6">Gracias por contactarnos. Nos pondremos en contacto contigo lo antes posible.</p>
              <button 
                onClick={() => setSent(false)} 
                className="text-sm font-semibold text-zinc-900 underline hover:text-lime-600"
              >
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700">Nombre</label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:border-lime-400 focus:bg-white focus:ring-1 focus:ring-lime-400 outline-none transition-all" 
                    placeholder="Juan" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700">Apellido</label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:border-lime-400 focus:bg-white focus:ring-1 focus:ring-lime-400 outline-none transition-all" 
                    placeholder="Pérez" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">Correo Electrónico</label>
                <input 
                  required
                  type="email" 
                  className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:border-lime-400 focus:bg-white focus:ring-1 focus:ring-lime-400 outline-none transition-all" 
                  placeholder="tu@correo.com" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">Mensaje</label>
                <textarea 
                  required
                  rows={5} 
                  className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:border-lime-400 focus:bg-white focus:ring-1 focus:ring-lime-400 outline-none transition-all resize-none" 
                  placeholder="¿Cómo podemos ayudarte?"
                ></textarea>
              </div>

              <div className="flex items-center gap-3 pt-2">
                 <input type="checkbox" id="privacy" className="w-4 h-4 rounded border-zinc-300 text-lime-600 focus:ring-lime-500" required />
                 <label htmlFor="privacy" className="text-sm text-zinc-500">
                   Acepto la <a href="#" className="underline text-zinc-800 hover:text-lime-600">Política de Privacidad</a>
                 </label>
              </div>

              <button 
                type="submit" 
                disabled={sending}
                className="w-full md:w-auto bg-zinc-900 text-white px-8 py-4 rounded-xl font-semibold hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2 mt-4 disabled:opacity-70"
              >
                {sending ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : (
                  <>Enviar Mensaje <Send className="w-4 h-4" /></>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

    </div>
  );
};

export default Contact;