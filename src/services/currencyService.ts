import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export async function convertCurrency(amount: number, from: string, to: string): Promise<{ amount: number; rate: number }> {
  const prompt = `What is the current real-time exchange rate from ${from} to ${to}? 
  Calculate ${amount} ${from} in ${to}.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            rate: {
              type: Type.NUMBER,
              description: "The exchange rate from source to target currency",
            },
            convertedAmount: {
              type: Type.NUMBER,
              description: "The calculated amount in the target currency",
            },
          },
          required: ["rate", "convertedAmount"],
        },
      },
    });

    const text = response.text || "{}";
    const data = JSON.parse(text);

    if (typeof data.rate !== 'number' || typeof data.convertedAmount !== 'number') {
      throw new Error("Invalid response format from AI");
    }

    return {
      amount: data.convertedAmount,
      rate: data.rate
    };
  } catch (error) {
    console.error("Currency conversion failed:", error);
    // Fallback logic or rethrow
    throw error;
  }
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
