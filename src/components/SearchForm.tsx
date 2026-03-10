import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Calendar, ArrowRightLeft, Plane, X } from 'lucide-react';
import { format } from 'date-fns';
import { POPULAR_CITIES, City } from '../constants/cities';

interface SearchFormProps {
  onSearch: (params: any) => void;
  isLoading: boolean;
}

export const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading }) => {
  const [origin, setOrigin] = useState('Dakar');
  const [destination, setDestination] = useState('Abidjan');
  const [departureDate, setDepartureDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [returnDate, setReturnDate] = useState('');
  const [tripType, setTripType] = useState<'one-way' | 'round-trip'>('one-way');
  
  const [originSuggestions, setOriginSuggestions] = useState<City[]>([]);
  const [destSuggestions, setDestSuggestions] = useState<City[]>([]);
  const [showOriginSug, setShowOriginSug] = useState(false);
  const [showDestSug, setShowDestSug] = useState(false);

  const originRef = useRef<HTMLDivElement>(null);
  const destRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (originRef.current && !originRef.current.contains(event.target as Node)) {
        setShowOriginSug(false);
      }
      if (destRef.current && !destRef.current.contains(event.target as Node)) {
        setShowDestSug(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOriginChange = (val: string) => {
    setOrigin(val);
    if (val.length > 1) {
      const filtered = POPULAR_CITIES.filter(c => 
        c.name.toLowerCase().includes(val.toLowerCase()) || 
        c.country.toLowerCase().includes(val.toLowerCase())
      );
      setOriginSuggestions(filtered);
      setShowOriginSug(true);
    } else {
      setOriginSuggestions([]);
      setShowOriginSug(false);
    }
  };

  const handleDestChange = (val: string) => {
    setDestination(val);
    if (val.length > 1) {
      const filtered = POPULAR_CITIES.filter(c => 
        c.name.toLowerCase().includes(val.toLowerCase()) || 
        c.country.toLowerCase().includes(val.toLowerCase())
      );
      setDestSuggestions(filtered);
      setShowDestSug(true);
    } else {
      setDestSuggestions([]);
      setShowDestSug(false);
    }
  };

  const selectOrigin = (city: City) => {
    setOrigin(city.name);
    setShowOriginSug(false);
  };

  const selectDest = (city: City) => {
    setDestination(city.name);
    setShowDestSug(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ origin, destination, departureDate, returnDate, tripType });
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8 -mt-12 relative z-10">
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          type="button"
          onClick={() => setTripType('one-way')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            tripType === 'one-way' ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Aller simple
        </button>
        <button
          type="button"
          onClick={() => setTripType('round-trip')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            tripType === 'round-trip' ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Aller-retour
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative" ref={originRef}>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 ml-1">Origine</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={origin}
              onChange={(e) => handleOriginChange(e.target.value)}
              onFocus={() => origin.length > 1 && setShowOriginSug(true)}
              placeholder="Ville de départ"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl input-focus"
              required
            />
          </div>
          {showOriginSug && originSuggestions.length > 0 && (
            <div className="absolute top-full left-0 w-full bg-white mt-1 rounded-xl shadow-2xl border border-gray-100 py-2 z-50 max-h-60 overflow-y-auto custom-scrollbar">
              {originSuggestions.map((city) => (
                <button
                  key={`${city.code}-${city.name}`}
                  type="button"
                  onClick={() => selectOrigin(city)}
                  className="w-full text-left px-4 py-3 hover:bg-orange-50 transition-colors flex items-center justify-between group"
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-700 group-hover:text-brand-primary transition-colors">{city.name}</span>
                    <span className="text-[10px] text-gray-400">{city.country}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-gray-300 group-hover:text-brand-primary">{city.code}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative" ref={destRef}>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 ml-1">Destination</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={destination}
              onChange={(e) => handleDestChange(e.target.value)}
              onFocus={() => destination.length > 1 && setShowDestSug(true)}
              placeholder="Ville d'arrivée"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl input-focus"
              required
            />
          </div>
          {showDestSug && destSuggestions.length > 0 && (
            <div className="absolute top-full left-0 w-full bg-white mt-1 rounded-xl shadow-2xl border border-gray-100 py-2 z-50 max-h-60 overflow-y-auto custom-scrollbar">
              {destSuggestions.map((city) => (
                <button
                  key={`${city.code}-${city.name}`}
                  type="button"
                  onClick={() => selectDest(city)}
                  className="w-full text-left px-4 py-3 hover:bg-orange-50 transition-colors flex items-center justify-between group"
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-700 group-hover:text-brand-primary transition-colors">{city.name}</span>
                    <span className="text-[10px] text-gray-400">{city.country}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-gray-300 group-hover:text-brand-primary">{city.code}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 ml-1">Départ</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl input-focus"
              required
            />
          </div>
        </div>

        {tripType === 'round-trip' ? (
          <div className="relative">
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 ml-1">Retour</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl input-focus"
                required={tripType === 'round-trip'}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-end">
            <button
              disabled={isLoading}
              type="submit"
              className="w-full bg-brand-primary hover:bg-orange-600 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-orange-200 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Rechercher
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {tripType === 'round-trip' && (
        <div className="mt-4 flex justify-end">
          <button
            disabled={isLoading}
            type="submit"
            className="w-full md:w-auto bg-brand-primary hover:bg-orange-600 text-white font-bold py-3.5 px-12 rounded-xl transition-all shadow-lg shadow-orange-200 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Search className="w-5 h-5" />
                Rechercher
              </>
            )}
          </button>
        </div>
      )}
    </form>
  );
};
