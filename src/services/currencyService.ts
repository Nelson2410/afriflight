const API_BASE_URL = import.meta.env.VITE_API_URL ?? '';

export async function convertCurrency(
  amount: number,
  from: string,
  to: string
): Promise<{ amount: number; rate: number }> {
  const response = await fetch(`${API_BASE_URL}/api/currency/convert`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amount, from, to }),
  });

  if (!response.ok) {
    console.error('Currency conversion failed with status', response.status);
    throw new Error("La conversion de devise a échoué. Veuillez réessayer plus tard.");
  }

  const data = (await response.json()) as { amount: number; rate: number };
  if (typeof data.amount !== 'number' || typeof data.rate !== 'number') {
    throw new Error('Réponse invalide du serveur de conversion.');
  }

  return data;
}

export const POPULAR_CURRENCIES = [
  // International
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'GBP', name: 'Livre Sterling', symbol: '£' },
  { code: 'CHF', name: 'Franc Suisse', symbol: 'CHF' },
  { code: 'CAD', name: 'Dollar Canadien', symbol: 'C$' },
  { code: 'CNY', name: 'Yuan Chinois', symbol: '¥' },
  { code: 'RUB', name: 'Rouble Russe', symbol: '₽' },
  { code: 'AED', name: 'Dirham des Émirats', symbol: 'د.إ' },
  { code: 'SAR', name: 'Riyal Saoudien', symbol: '﷼' },
  { code: 'QAR', name: 'Riyal Qatari', symbol: '﷼' },

  // Afrique Centrale & Ouest
  { code: 'XAF', name: 'Franc CFA (BEAC)', symbol: 'FCFA' },
  { code: 'XOF', name: 'Franc CFA (BCEAO)', symbol: 'FCFA' },
  { code: 'NGN', name: 'Naira Nigérian', symbol: '₦' },
  { code: 'GHS', name: 'Cedi Ghanéen', symbol: 'GH₵' },
  { code: 'GNF', name: 'Franc Guinéen', symbol: 'FG' },
  { code: 'LRD', name: 'Dollar Libérien', symbol: 'L$' },
  { code: 'SLE', name: 'Leone Sierra-Léonais', symbol: 'Le' },

  // Afrique du Nord
  { code: 'MAD', name: 'Dirham Marocain', symbol: 'DH' },
  { code: 'DZD', name: 'Dinar Algérien', symbol: 'DA' },
  { code: 'TND', name: 'Dinar Tunisien', symbol: 'DT' },
  { code: 'EGP', name: 'Livre Égyptienne', symbol: 'E£' },

  // Afrique de l'Est
  { code: 'KES', name: 'Shilling Kényan', symbol: 'KSh' },
  { code: 'ETB', name: 'Birr Éthiopien', symbol: 'Br' },
  { code: 'UGX', name: 'Shilling Ougandais', symbol: 'USh' },
  { code: 'RWF', name: 'Franc Rwandais', symbol: 'FRw' },
  { code: 'TZS', name: 'Shilling Tanzanien', symbol: 'TSh' },

  // Afrique Australe
  { code: 'ZAR', name: 'Rand Sud-Africain', symbol: 'R' },
  { code: 'AOA', name: 'Kwanza Angolais', symbol: 'Kz' },
  { code: 'MZN', name: 'Metical Mozambicain', symbol: 'MT' },
  { code: 'BWP', name: 'Pula du Botswana', symbol: 'P' },
  { code: 'NAD', name: 'Dollar Namibien', symbol: 'N$' },
  { code: 'MUR', name: 'Roupie Mauricienne', symbol: '₨' },
  { code: 'SCR', name: 'Roupie des Seychelles', symbol: 'SR' },
];
