import React, { useState } from 'react';
import { Plane, Clock, ArrowRight, RefreshCw, ChevronDown, DollarSign, X, Search } from 'lucide-react';
import { Flight } from '../services/flightService';
import { convertCurrency, POPULAR_CURRENCIES } from '../services/currencyService';

interface FlightCardProps {
  flight: Flight;
}

export const FlightCard: React.FC<FlightCardProps> = ({ flight }) => {
  const [imgSrc, setImgSrc] = useState<string>(
    flight.logo && flight.logo.startsWith('http') 
      ? flight.logo 
      : `https://logo.clearbit.com/${flight.domain}`
  );
  const [showFallback, setShowFallback] = useState(false);
  
  // Currency conversion states
  const [isConverting, setIsConverting] = useState(false);
  const [showCurrencyList, setShowCurrencyList] = useState(false);
  const [currencySearch, setCurrencySearch] = useState('');
  const [convertedPrice, setConvertedPrice] = useState<{ amount: number; currency: string } | null>(null);

  const handleError = () => {
    if (imgSrc.includes('clearbit.com')) {
      setImgSrc(`https://www.google.com/s2/favicons?domain=${flight.domain}&sz=128`);
    } else {
      setShowFallback(true);
    }
  };

  const filteredCurrencies = POPULAR_CURRENCIES.filter(curr => 
    curr.name.toLowerCase().includes(currencySearch.toLowerCase()) || 
    curr.code.toLowerCase().includes(currencySearch.toLowerCase())
  );

  const handleConvert = async (targetCurrency: string) => {
    if (targetCurrency === flight.currency) {
      setConvertedPrice(null);
      setShowCurrencyList(false);
      setCurrencySearch('');
      return;
    }

    setIsConverting(true);
    setShowCurrencyList(false);
    setCurrencySearch('');
    try {
      const result = await convertCurrency(flight.price, flight.currency, targetCurrency);
      setConvertedPrice({
        amount: Math.round(result.amount),
        currency: targetCurrency
      });
    } catch (error) {
      console.error("Conversion error", error);
      alert("La conversion a échoué. Veuillez réessayer dans quelques instants.");
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className={`glass-card p-6 hover:shadow-md transition-shadow group relative ${showCurrencyList ? 'z-[100]' : 'z-0'}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Airline Info */}
        <div className="flex items-center gap-4 min-w-[200px]">
          <div className="w-12 h-12 bg-white border border-gray-100 rounded-xl flex items-center justify-center overflow-hidden p-1 shadow-sm">
            {showFallback ? (
              <div className="w-full h-full bg-orange-50 flex items-center justify-center text-brand-primary">
                <Plane className="w-6 h-6" />
              </div>
            ) : (
              <img 
                src={imgSrc} 
                alt={flight.airline} 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
                onError={handleError}
              />
            )}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 leading-tight">{flight.airline}</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Classe Économique</p>
          </div>
        </div>

        {/* Journey Info */}
        <div className="flex-1 flex items-center justify-between max-w-md">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{flight.departureTime}</p>
            <p className="text-sm font-medium text-gray-500">{flight.origin}</p>
          </div>

          <div className="flex-1 px-8 flex flex-col items-center">
            <div className="w-full flex items-center gap-2">
              <div className="h-[2px] flex-1 bg-gray-200 relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-300 rounded-full" />
              </div>
              <Plane className="w-4 h-4 text-gray-300 rotate-90" />
              <div className="h-[2px] flex-1 bg-gray-200 relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-300 rounded-full" />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2 font-medium">
              {flight.duration} • {flight.stops === 0 ? 'Direct' : `${flight.stops} escale${flight.stops > 1 ? 's' : ''}`}
            </p>
          </div>

          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{flight.arrivalTime}</p>
            <p className="text-sm font-medium text-gray-500">{flight.destination}</p>
          </div>
        </div>

        {/* Price & Action */}
        <div className="flex flex-col items-center md:items-end gap-4 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-8 min-w-[300px]">
          {/* Price (Full width above buttons) */}
          <div className="w-full text-center md:text-right">
            <div className="flex items-center justify-center md:justify-end gap-2 mb-1">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Vérifié en temps réel</p>
            </div>
            <div className="flex flex-col items-center md:items-end">
              <p className="text-3xl font-bold text-brand-primary whitespace-nowrap">
                {convertedPrice ? convertedPrice.amount : flight.price} <span className="text-lg font-medium">{convertedPrice ? convertedPrice.currency : flight.currency}</span>
              </p>
              {convertedPrice && (
                <p className="text-[10px] text-gray-400 font-medium italic">
                  Original: {flight.price} {flight.currency}
                </p>
              )}
            </div>
          </div>

          {/* Buttons Container (Side by side) */}
          <div className="flex items-center gap-2 w-full">
            {/* Convert Button */}
            <div className="flex-1 relative">
              <button 
                onClick={() => {
                  setShowCurrencyList(!showCurrencyList);
                  if (!showCurrencyList) setCurrencySearch('');
                }}
                disabled={isConverting}
                className="w-full bg-orange-50 text-brand-primary border border-orange-100 px-3 py-2.5 rounded-xl font-bold hover:bg-orange-100 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 shadow-sm"
              >
                {isConverting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <DollarSign className="w-4 h-4" />
                    <span>Devise</span>
                    <ChevronDown className={`w-3 h-3 transition-transform ${showCurrencyList ? 'rotate-180' : ''}`} />
                  </>
                )}
              </button>

              {showCurrencyList && (
                <>
                  {/* Backdrop for mobile/desktop */}
                  <div 
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[150]"
                    onClick={() => setShowCurrencyList(false)}
                  />
                  
                  <div 
                    className="fixed inset-x-4 bottom-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-auto md:w-[500px] bg-white rounded-3xl shadow-2xl border border-gray-100 py-6 z-[200] animate-in slide-in-from-bottom-8 md:zoom-in-95 duration-300"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 pb-4 border-b border-gray-100 mb-4">
                      <div className="flex flex-col">
                        <h3 className="font-black text-xl text-brand-secondary">Choisir une devise</h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Mise à jour en temps réel</p>
                      </div>
                      <button 
                        onClick={() => setShowCurrencyList(false)}
                        className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Search Bar */}
                    <div className="px-6 pb-4">
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Rechercher par nom ou code (ex: Euro, XOF...)"
                          autoFocus
                          value={currencySearch}
                          onChange={(e) => setCurrencySearch(e.target.value)}
                          className="w-full pl-12 pr-10 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-brand-primary transition-all"
                        />
                        {currencySearch && (
                          <button 
                            onClick={() => setCurrencySearch('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-200 rounded-full transition-colors"
                          >
                            <X className="w-4 h-4 text-gray-500" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Scrollable List */}
                    <div className="max-h-[50vh] md:max-h-[400px] overflow-y-auto custom-scrollbar px-4">
                      <div className="px-2 py-1 flex justify-between items-center mb-3">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                          {currencySearch ? 'Résultats' : 'Toutes les devises'}
                        </span>
                        <span className="text-[10px] font-black text-brand-primary bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                          {filteredCurrencies.length}
                        </span>
                      </div>

                      {filteredCurrencies.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {filteredCurrencies.map((curr) => (
                            <button
                              key={curr.code}
                              onClick={() => handleConvert(curr.code)}
                              className="w-full text-left px-4 py-4 rounded-2xl text-sm hover:bg-orange-50 hover:text-brand-primary transition-all flex items-center justify-between group border border-transparent hover:border-orange-100"
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-11 h-11 bg-gray-50 rounded-xl flex items-center justify-center font-bold text-lg text-gray-400 group-hover:bg-white group-hover:text-brand-primary transition-colors shadow-sm border border-gray-100">
                                  {curr.symbol}
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-black text-gray-700 group-hover:text-brand-primary transition-colors">
                                    {curr.name}
                                  </span>
                                  <span className="text-[10px] text-gray-400 font-mono font-bold tracking-wider">
                                    {curr.code}
                                  </span>
                                </div>
                              </div>
                              <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-brand-primary" />
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="py-16 text-center">
                          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                            <Search className="w-8 h-8 text-gray-300" />
                          </div>
                          <p className="text-gray-400 font-bold">Aucune devise trouvée</p>
                          <p className="text-xs text-gray-300 mt-1">Essayez un autre mot-clé</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Details Button */}
            <div className="flex-[1.5]">
              <a 
                href={flight.bookingUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full bg-brand-secondary text-white px-4 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 text-sm shadow-md hover:shadow-lg"
              >
                Vérifier & Réserver
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
          <p className="text-[9px] text-gray-400 italic text-center md:text-right">
            Redirection vers le site officiel de {flight.airline}
          </p>
        </div>
      </div>
    </div>
  );
};
