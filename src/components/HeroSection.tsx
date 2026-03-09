import React from 'react';
import { motion } from 'motion/react';
import { Navigation, MapPin } from 'lucide-react';

interface HeroSectionProps {
  onShowNearbyAgencies: () => void;
  onShowCityAgencies: () => void;
}

export function HeroSection({ onShowNearbyAgencies, onShowCityAgencies }: HeroSectionProps) {
  return (
    <header className="relative bg-brand-secondary pt-20 pb-32 overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#E67E22_0%,transparent_50%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
            Explorez l'Afrique,<br />
            <span className="italic text-brand-primary">au meilleur prix.</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-12">
            Votre comparateur indépendant pour trouver les meilleures liaisons vers et à travers l'Afrique. Comparez les prix en temps réel dans votre devise locale.
          </p>

          {/* Agency Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button
              onClick={onShowNearbyAgencies}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-2xl font-bold transition-all group"
            >
              <Navigation className="w-5 h-5 text-brand-primary group-hover:scale-110 transition-transform" />
              Agences à proximité
            </button>
            <button
              onClick={onShowCityAgencies}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-2xl font-bold transition-all group"
            >
              <MapPin className="w-5 h-5 text-brand-primary group-hover:scale-110 transition-transform" />
              Agences de ma ville
            </button>
          </div>
        </motion.div>
      </div>
    </header>
  );
}
