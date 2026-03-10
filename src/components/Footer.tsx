import React from 'react';
import { Plane } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-brand-secondary text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-12">
          {/* Top Section: Logo & Description */}
          <div className="flex flex-col items-center gap-6 max-w-2xl text-center">
            <div className="flex items-center gap-2">
              <Plane className="w-8 h-8 text-brand-primary" />
              <span className="text-3xl font-black tracking-tight">
                Afri<span className="text-brand-primary">Flights</span>
              </span>
            </div>
            <p className="text-gray-400 text-base leading-relaxed">
              Le comparateur indépendant numéro 1 pour l'Afrique. Nous vous aidons à trouver le vol idéal en comparant les prix en temps réel dans votre devise locale.
            </p>
          </div>

          {/* Bottom Section: Copyright */}
          <div className="w-full pt-8 border-t border-white/5 text-center">
            <p className="text-sm text-gray-500 font-medium">
              © {new Date().getFullYear()} AfriFlights. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
