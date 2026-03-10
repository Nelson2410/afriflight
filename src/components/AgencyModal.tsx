import React from 'react';
import { X, MapPin, Phone, ExternalLink, Star } from 'lucide-react';
import { Agency } from '../services/locationService';
import { motion, AnimatePresence } from 'motion/react';

interface AgencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  agencies: Agency[];
  title: string;
  isLoading: boolean;
}

export const AgencyModal: React.FC<AgencyModalProps> = ({ isOpen, onClose, agencies, title, isLoading }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-brand-secondary text-white">
              <h2 className="text-xl font-bold">{title}</h2>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
                  <p className="text-gray-500 font-medium">Recherche d'agences...</p>
                </div>
              ) : agencies.length > 0 ? (
                agencies.map((agency, idx) => (
                  <div key={idx} className="p-4 border border-gray-100 rounded-2xl hover:border-brand-primary/30 transition-colors bg-gray-50/50">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-gray-900">{agency.name}</h3>
                      {agency.rating && (
                        <div className="flex items-center gap-1 bg-orange-100 text-brand-primary px-2 py-1 rounded-lg text-xs font-bold">
                          <Star className="w-3 h-3 fill-current" />
                          {agency.rating}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mt-0.5 text-gray-400 shrink-0" />
                        <span>{agency.address}</span>
                      </div>
                      {agency.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                          <span>{agency.phone}</span>
                        </div>
                      )}
                    </div>
                    {agency.url && (
                      <a
                        href={agency.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-brand-primary hover:underline"
                      >
                        Voir sur Google Maps
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <MapPin className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-500">Aucune agence trouvée dans cette zone.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
