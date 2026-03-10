import React from 'react';
import { Globe, ShieldCheck, CreditCard } from 'lucide-react';

export function FeaturesSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="text-center p-6">
        <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center text-brand-primary mx-auto mb-6">
          <Globe className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold mb-3">Réseau Africain</h3>
        <p className="text-gray-500">Accédez à toutes les compagnies aériennes majeures du continent en un seul clic.</p>
      </div>
      <div className="text-center p-6">
        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-6">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold mb-3">Réservation Sécurisée</h3>
        <p className="text-gray-500">Vos données et vos paiements sont protégés par les derniers standards de sécurité.</p>
      </div>
      <div className="text-center p-6">
        <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto mb-6">
          <CreditCard className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold mb-3">Meilleurs Tarifs</h3>
        <p className="text-gray-500">Nous comparons les prix en temps réel pour vous garantir les offres les plus compétitives.</p>
      </div>
    </div>
  );
}
