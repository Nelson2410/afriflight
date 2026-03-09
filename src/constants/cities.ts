export interface City {
  name: string;
  country: string;
  code: string;
}

export const POPULAR_CITIES: City[] = [
  // West Africa
  { name: "Dakar", country: "Sénégal", code: "DSS" },
  { name: "Abidjan", country: "Côte d'Ivoire", code: "ABJ" },
  { name: "Lagos", country: "Nigeria", code: "LOS" },
  { name: "Accra", country: "Ghana", code: "ACC" },
  { name: "Bamako", country: "Mali", code: "BKO" },
  { name: "Ouagadougou", country: "Burkina Faso", code: "OUA" },
  { name: "Conakry", country: "Guinée", code: "CKY" },
  { name: "Lomé", country: "Togo", code: "LFW" },
  { name: "Cotonou", country: "Bénin", code: "COO" },
  { name: "Banjul", country: "Gambie", code: "BJL" },
  { name: "Freetown", country: "Sierra Leone", code: "FNA" },
  { name: "Monrovia", country: "Liberia", code: "ROB" },
  { name: "Niamey", country: "Niger", code: "NIM" },
  { name: "Praia", country: "Cap-Vert", code: "RAI" },
  { name: "Bissau", country: "Guinée-Bissau", code: "OXB" },

  // Central Africa
  { name: "Douala", country: "Cameroun", code: "DLA" },
  { name: "Yaoundé", country: "Cameroun", code: "NSI" },
  { name: "Kinshasa", country: "RDC", code: "FIH" },
  { name: "Brazzaville", country: "Congo", code: "BZV" },
  { name: "Libreville", country: "Gabon", code: "LBV" },
  { name: "Bangui", country: "RCA", code: "BGF" },
  { name: "N'Djamena", country: "Tchad", code: "NDJ" },
  { name: "Malabo", country: "Guinée Équatoriale", code: "SSG" },

  // North Africa
  { name: "Casablanca", country: "Maroc", code: "CMN" },
  { name: "Marrakech", country: "Maroc", code: "RAK" },
  { name: "Rabat", country: "Maroc", code: "RBA" },
  { name: "Alger", country: "Algérie", code: "ALG" },
  { name: "Tunis", country: "Tunisie", code: "TUN" },
  { name: "Le Caire", country: "Égypte", code: "CAI" },
  { name: "Tripoli", country: "Libye", code: "TIP" },

  // East Africa
  { name: "Nairobi", country: "Kenya", code: "NBO" },
  { name: "Addis-Abeba", country: "Éthiopie", code: "ADD" },
  { name: "Dar es Salaam", country: "Tanzanie", code: "DAR" },
  { name: "Kigali", country: "Rwanda", code: "KGL" },
  { name: "Kampala", country: "Ouganda", code: "EBB" },
  { name: "Djibouti", country: "Djibouti", code: "JIB" },
  { name: "Mogadiscio", country: "Somalie", code: "MGQ" },
  { name: "Asmara", country: "Érythrée", code: "ASM" },

  // Southern Africa
  { name: "Johannesburg", country: "Afrique du Sud", code: "JNB" },
  { name: "Le Cap", country: "Afrique du Sud", code: "CPT" },
  { name: "Luanda", country: "Angola", code: "LAD" },
  { name: "Maputo", country: "Mozambique", code: "MPM" },
  { name: "Lusaka", country: "Zambie", code: "LUN" },
  { name: "Harare", country: "Zimbabwe", code: "HRE" },
  { name: "Windhoek", country: "Namibie", code: "WDH" },
  { name: "Gaborone", country: "Botswana", code: "GBE" },
  { name: "Antananarivo", country: "Madagascar", code: "TNR" },
  { name: "Port-Louis", country: "Maurice", code: "MRU" },

  // International
  { name: "Paris", country: "France", code: "CDG" },
  { name: "Lyon", country: "France", code: "LYS" },
  { name: "Marseille", country: "France", code: "MRS" },
  { name: "Bruxelles", country: "Belgique", code: "BRU" },
  { name: "Genève", country: "Suisse", code: "GVA" },
  { name: "Montréal", country: "Canada", code: "YUL" },
  { name: "New York", country: "USA", code: "JFK" },
  { name: "Londres", country: "Royaume-Uni", code: "LHR" },
  { name: "Dubaï", country: "EAU", code: "DXB" },
  { name: "Istanbul", country: "Turquie", code: "IST" }
];
