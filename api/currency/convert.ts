import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ai, Type } from '../_gemini';

interface CurrencyConvertRequest {
  amount: number;
  from: string;
  to: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'GEMINI_API_KEY non configurée sur le serveur.' });
  }

  const { amount, from, to } = req.body as CurrencyConvertRequest;

  if (!amount || !from || !to) {
    return res.status(400).json({ error: 'Paramètres de conversion manquants.' });
  }

  const prompt = `What is the current real-time exchange rate from ${from} to ${to}? 
Calculate ${amount} ${from} in ${to}.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            rate: {
              type: Type.NUMBER,
              description: 'The exchange rate from source to target currency',
            },
            convertedAmount: {
              type: Type.NUMBER,
              description: 'The calculated amount in the target currency',
            },
          },
          required: ['rate', 'convertedAmount'],
        },
      },
    });

    const text = response.text || '{}';
    const data = JSON.parse(text) as { rate?: number; convertedAmount?: number };

    if (typeof data.rate !== 'number' || typeof data.convertedAmount !== 'number') {
      return res.status(500).json({ error: 'Réponse invalide du service de conversion.' });
    }

    return res.status(200).json({
      amount: data.convertedAmount,
      rate: data.rate,
    });
  } catch (error) {
    console.error('Currency conversion failed:', error);
    return res.status(500).json({ error: 'Impossible de convertir la devise pour le moment.' });
  }
}