import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plane, Globe, ShieldCheck, CreditCard, Menu, X, Filter, ChevronDown, MapPin, Navigation } from 'lucide-react';
import { SearchForm } from './components/SearchForm';
import { FlightCard } from './components/FlightCard';
import { AgencyModal } from './components/AgencyModal';
import { searchFlights, Flight } from './services/flightService';
import { getUserLocationInfo, getNearbyAgencies, getCityAgencies, Agency } from './services/locationService';
import { POPULAR_CURRENCIES } from './services/currencyService';

export default function App() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Location & Agency states
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationInfo, setLocationInfo] = useState<{ city: string; country: string; currency: string } | null>(null);
  const [globalCurrency, setGlobalCurrency] = useState('USD');
  const [isCurrencySelectorOpen, setIsCurrencySelectorOpen] = useState(false);
  const [currencySearch, setCurrencySearch] = useState('');
  
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [isAgencyModalOpen, setIsAgencyModalOpen] = useState(false);
  const [agencyModalTitle, setAgencyModalTitle] = useState('');
  const [isAgencyLoading, setIsAgencyLoading] = useState(false);
  const [stopsFilter, setStopsFilter] = useState<'all' | '0' | '1' | '2+'>('all');
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        const info = await getUserLocationInfo(latitude, longitude);
        setLocationInfo(info);
        if (info?.currency) {
          setGlobalCurrency(info.currency);
        }
      }, (error) => {
        console.error("Geolocation error:", error);
      });
    }
  }, []);

  const filteredCurrencies = POPULAR_CURRENCIES.filter(curr => 
    curr.name.toLowerCase().includes(currencySearch.toLowerCase()) || 
    curr.code.toLowerCase().includes(currencySearch.toLowerCase())
  );

  const handleSearch = async (params: any) => {
    setIsLoading(true);
    setHasSearched(true);
    try {
      const results = await searchFlights({
        ...params,
        targetCurrency: globalCurrency
      });
      setFlights(results);
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowNearbyAgencies = async () => {
    if (!userLocation) {
      alert("Veuillez autoriser la géolocalisation pour voir les agences proches.");
      return;
    }
    setAgencyModalTitle("Agences à proximité (2km)");
    setIsAgencyModalOpen(true);
    setIsAgencyLoading(true);
    try {
      const results = await getNearbyAgencies(userLocation.lat, userLocation.lng);
      setAgencies(results);
    } catch (error) {
      console.error("Failed to fetch nearby agencies", error);
    } finally {
      setIsAgencyLoading(false);
    }
  };

  const handleShowCityAgencies = async () => {
    if (!locationInfo?.city) {
      alert("Localisation non détectée.");
      return;
    }
    setAgencyModalTitle(`Agences à ${locationInfo.city}`);
    setIsAgencyModalOpen(true);
    setIsAgencyLoading(true);
    try {
      const results = await getCityAgencies(locationInfo.city);
      setAgencies(results);
    } catch (error) {
      console.error("Failed to fetch city agencies", error);
    } finally {
      setIsAgencyLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-brand-primary p-1.5 rounded-lg">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-brand-secondary">
                Afri<span className="text-brand-primary">Flights</span>
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-6">
              <button 
                onClick={() => setIsAboutModalOpen(true)}
                className="text-sm font-bold text-gray-500 hover:text-brand-primary transition-colors"
              >
                À propos
              </button>

              {locationInfo && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100">
                  <MapPin className="w-4 h-4 text-brand-primary" />
                  <span className="text-xs font-bold text-gray-600">{locationInfo.city}, {locationInfo.country}</span>
                </div>
              )}
              
              <div className="relative">
                <button 
                  onClick={() => setIsCurrencySelectorOpen(!isCurrencySelectorOpen)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all shadow-sm group border-2 ${
                    isCurrencySelectorOpen 
                      ? 'bg-orange-50 border-brand-primary text-brand-primary' 
                      : 'bg-white border-gray-100 text-gray-700 hover:border-brand-primary hover:bg-orange-50/30'
                  }`}
                >
                  <CreditCard className={`w-4 h-4 ${isCurrencySelectorOpen ? 'text-brand-primary' : 'text-gray-400 group-hover:text-brand-primary'}`} />
                  <div className="flex flex-col items-start leading-none">
                    <span className="text-[10px] uppercase tracking-wider font-bold opacity-60">Devise</span>
                    <span className="text-xs font-black">{globalCurrency}</span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isCurrencySelectorOpen ? 'rotate-180 text-brand-primary' : 'text-gray-400'}`} />
                </button>

                {isCurrencySelectorOpen && (
                  <>
                    <div 
                      className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[150] md:hidden"
                      onClick={() => setIsCurrencySelectorOpen(false)}
                    />
                    <div className="absolute top-full right-0 md:right-0 mt-2 w-72 md:w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 z-[200] animate-in fade-in zoom-in duration-200">
                      <div className="px-4 pb-3 border-b border-gray-50 mb-2">
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Rechercher une devise..."
                            autoFocus
                            value={currencySearch}
                            onChange={(e) => setCurrencySearch(e.target.value)}
                            className="w-full pl-8 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-brand-primary transition-all"
                          />
                          <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        </div>
                      </div>
                      <div className="max-h-80 overflow-y-auto custom-scrollbar px-2">
                        {filteredCurrencies.map((curr) => (
                          <button
                            key={curr.code}
                            onClick={() => {
                              setGlobalCurrency(curr.code);
                              setIsCurrencySelectorOpen(false);
                              setCurrencySearch('');
                            }}
                            className={`w-full text-left px-3 py-2.5 rounded-lg text-xs transition-all flex justify-between items-center mb-0.5 ${
                              globalCurrency === curr.code 
                                ? 'bg-orange-50 text-brand-primary font-bold' 
                                : 'hover:bg-gray-50 text-gray-600'
                            }`}
                          >
                            <div className="flex flex-col">
                              <span className="font-bold">{curr.name}</span>
                              <span className="text-[9px] opacity-50 uppercase">{curr.code}</span>
                            </div>
                            <span className="font-mono font-bold text-gray-400">{curr.symbol}</span>
                          </button>
                        ))}
                        {filteredCurrencies.length === 0 && (
                          <div className="py-8 text-center text-gray-400 text-[10px]">
                            Aucune devise trouvée
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <a href="#" className="text-sm font-medium text-gray-600 hover:text-brand-primary transition-colors">Vols</a>
            </div>

            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white border-b border-gray-100 p-4 absolute top-16 left-0 w-full z-40 shadow-xl"
          >
            <div className="flex flex-col gap-4">
              {locationInfo && (
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                  <MapPin className="w-5 h-5 text-brand-primary" />
                  <span className="text-sm font-bold text-gray-600">{locationInfo.city}, {locationInfo.country}</span>
                </div>
              )}

              <div className="bg-white border-2 border-orange-100 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <CreditCard className="w-5 h-5 text-brand-primary" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Votre Devise</span>
                      <span className="text-lg font-black text-brand-secondary">{globalCurrency}</span>
                    </div>
                  </div>
                </div>
                <div className="relative mb-3">
                  <input
                    type="text"
                    placeholder="Rechercher une devise..."
                    value={currencySearch}
                    onChange={(e) => setCurrencySearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-brand-primary transition-all"
                  />
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                <div className="max-h-40 overflow-y-auto px-1 space-y-1">
                  {filteredCurrencies.slice(0, 10).map((curr) => (
                    <button
                      key={curr.code}
                      onClick={() => {
                        setGlobalCurrency(curr.code);
                        setCurrencySearch('');
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex justify-between items-center ${
                        globalCurrency === curr.code 
                          ? 'bg-orange-50 text-brand-primary font-bold' 
                          : 'hover:bg-gray-50 text-gray-600'
                      }`}
                    >
                      <span>{curr.name}</span>
                      <span className="opacity-50">{curr.code}</span>
                    </button>
                  ))}
                  {filteredCurrencies.length > 10 && (
                    <p className="text-[10px] text-center text-gray-400 pt-1 italic">Affinez votre recherche pour plus de résultats</p>
                  )}
                </div>
              </div>

              <a href="#" className="text-lg font-medium text-gray-600 p-2">Vols</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
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
                onClick={handleShowNearbyAgencies}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-2xl font-bold transition-all group"
              >
                <Navigation className="w-5 h-5 text-brand-primary group-hover:scale-110 transition-transform" />
                Agences à proximité
              </button>
              <button 
                onClick={handleShowCityAgencies}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-2xl font-bold transition-all group"
              >
                <MapPin className="w-5 h-5 text-brand-primary group-hover:scale-110 transition-transform" />
                Agences de ma ville
              </button>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <SearchForm onSearch={handleSearch} isLoading={isLoading} />

        <div className="mt-16">
          {!hasSearched ? (
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
          ) : (
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {isLoading ? 'Recherche en cours...' : `${flights.length} vols trouvés`}
                  </h2>
                  {!isLoading && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                      <ShieldCheck className="w-3 h-3" />
                      Prix vérifiés en temps réel
                    </span>
                  )}
                </div>

                {!isLoading && flights.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Escales:</span>
                    <div className="flex bg-gray-100 p-1 rounded-xl">
                      {[
                        { id: 'all', label: 'Tous' },
                        { id: '0', label: 'Direct' },
                        { id: '1', label: '1' },
                        { id: '2+', label: '2+' }
                      ].map((filter) => (
                        <button
                          key={filter.id}
                          onClick={() => setStopsFilter(filter.id as any)}
                          className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                            stopsFilter === filter.id 
                              ? 'bg-white text-brand-primary shadow-sm' 
                              : 'text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          {filter.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {isLoading ? (
                <div className="space-y-6">
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="relative mb-6">
                      <div className="w-20 h-20 border-4 border-orange-100 border-t-brand-primary rounded-full animate-spin" />
                      <Plane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-brand-primary animate-pulse" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Recherche des meilleures offres...</h3>
                    <p className="text-gray-500 max-w-xs mx-auto">
                      Nous comparons les tarifs en temps réel auprès de centaines de compagnies pour vous.
                    </p>
                  </div>
                  
                  <div className="space-y-4 opacity-50">
                    {[1, 2].map((i) => (
                      <div key={i} className="glass-card p-6 animate-pulse">
                        <div className="flex flex-col md:flex-row justify-between gap-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                            <div className="space-y-2">
                              <div className="h-4 bg-gray-200 rounded w-24" />
                              <div className="h-3 bg-gray-200 rounded w-16" />
                            </div>
                          </div>
                          <div className="flex-1 flex items-center justify-between max-w-md">
                            <div className="h-8 bg-gray-200 rounded w-16" />
                            <div className="h-2 bg-gray-200 rounded flex-1 mx-8" />
                            <div className="h-8 bg-gray-200 rounded w-16" />
                          </div>
                          <div className="h-12 bg-gray-200 rounded-xl w-32" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : flights.length > 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  {flights
                    .filter(flight => {
                      if (stopsFilter === 'all') return true;
                      if (stopsFilter === '0') return flight.stops === 0;
                      if (stopsFilter === '1') return flight.stops === 1;
                      if (stopsFilter === '2+') return flight.stops >= 2;
                      return true;
                    })
                    .map((flight) => (
                      <FlightCard key={flight.id} flight={flight} />
                    ))}
                  {flights.filter(flight => {
                    if (stopsFilter === 'all') return true;
                    if (stopsFilter === '0') return flight.stops === 0;
                    if (stopsFilter === '1') return flight.stops === 1;
                    if (stopsFilter === '2+') return flight.stops >= 2;
                    return true;
                  }).length === 0 && (
                    <div className="text-center py-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                      <Filter className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 font-medium">Aucun vol ne correspond à ce filtre d'escales.</p>
                      <button 
                        onClick={() => setStopsFilter('all')}
                        className="mt-4 text-brand-primary font-bold hover:underline"
                      >
                        Afficher tous les vols
                      </button>
                    </div>
                  )}
                </motion.div>
              ) : (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                  <Plane className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun vol trouvé</h3>
                  <p className="text-gray-500">Essayez d'autres villes ou d'autres dates.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Agency Modal */}
      <AgencyModal 
        isOpen={isAgencyModalOpen}
        onClose={() => setIsAgencyModalOpen(false)}
        agencies={agencies}
        title={agencyModalTitle}
        isLoading={isAgencyLoading}
      />

      {/* About Modal */}
      <AnimatePresence>
        {isAboutModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAboutModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-50 p-2 rounded-xl">
                      <Plane className="w-6 h-6 text-brand-primary" />
                    </div>
                    <h3 className="text-2xl font-black text-brand-secondary">À propos d'AfriFlights</h3>
                  </div>
                  <button 
                    onClick={() => setIsAboutModalOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
                
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p className="font-medium">
                    Nous aidons les voyageurs à trouver facilement le vol le mieux adapté à leur emploi du temps et à leur budget.
                  </p>
                  <p>
                    Grâce à nos recherches avancées, nous centralisons les meilleures options pour vous éviter de parcourir de nombreux sites, une tâche souvent longue et fastidieuse.
                  </p>
                  <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 mt-6">
                    <p className="text-sm text-brand-primary font-bold">
                      Notez qu'AfriFlights est un comparateur : une fois votre vol choisi, la réservation s'effectue directement sur le site officiel de la compagnie aérienne, et non sur notre plateforme.
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => setIsAboutModalOpen(false)}
                  className="w-full mt-8 bg-brand-secondary text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                >
                  J'ai compris
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
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
                © 2026 AfriFlights. Tous droits réservés.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
